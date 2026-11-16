import type Phaser from 'phaser';
import { Bird } from './Bird';
import { AudioSystem } from '../systems/AudioSystem';

export class Slingshot {
  public scene: Phaser.Scene;
  public x: number;
  public y: number;
  public anchorX: number;
  public anchorY: number;
  public leftProngX: number;
  public leftProngY: number;
  public rightProngX: number;
  public rightProngY: number;

  private baseSprite: Phaser.GameObjects.Image;
  private backBandGraphics: Phaser.GameObjects.Graphics;
  private frontBandGraphics: Phaser.GameObjects.Graphics;
  private trajectoryGraphics: Phaser.GameObjects.Graphics;
  private ghostTrajectoryGraphics: Phaser.GameObjects.Graphics;
  private currentBird: Bird | null = null;
  private isAiming: boolean = false;
  private maxDragDistance: number = 95;
  private launchMultiplier: number = 0.32;
  private audio: AudioSystem;
  private stretchAudioTimer: number = 0;
  private lastTrajectoryPoints: { x: number; y: number }[] = [];

  constructor(scene: Phaser.Scene, x: number = 220, y: number = 550) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    // Anchor rest position in center of fork
    this.anchorX = x;
    this.anchorY = y - 62;

    this.leftProngX = x - 13;
    this.leftProngY = y - 76;

    this.rightProngX = x + 13;
    this.rightProngY = y - 76;

    this.audio = AudioSystem.getInstance();

    // Graphics layers: ghost trajectory at back, bands, and front bands
    this.ghostTrajectoryGraphics = scene.add.graphics();
    this.ghostTrajectoryGraphics.setDepth(5);

    this.backBandGraphics = scene.add.graphics();
    this.backBandGraphics.setDepth(13);

    this.baseSprite = scene.add.image(x, y - 40, 'slingshot_base');
    this.baseSprite.setDepth(14);

    this.frontBandGraphics = scene.add.graphics();
    this.frontBandGraphics.setDepth(16);

    this.trajectoryGraphics = scene.add.graphics();
    this.trajectoryGraphics.setDepth(12);

    this.setupInput();
    this.drawRestingBands();
  }

  public loadBird(bird: Bird): void {
    this.currentBird = bird;
    bird.state = 'LOADED';
    bird.image.setPosition(this.anchorX, this.anchorY);
    bird.image.setRotation(0);
    this.drawRestingBands();
  }

  public getCurrentBird(): Bird | null {
    return this.currentBird;
  }

  private setupInput(): void {
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.currentBird || this.currentBird.state !== 'LOADED') return;

      const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const dist = Math.hypot(worldPoint.x - this.anchorX, worldPoint.y - this.anchorY);
      const nearSlingshot =
        worldPoint.x >= 80 && worldPoint.x <= 360 && worldPoint.y >= 340 && worldPoint.y <= 640;

      if (dist < 110 || nearSlingshot) {
        this.isAiming = true;
        this.audio.playSlingshotStretch(0.3);
      }
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.isAiming || !this.currentBird) return;

      const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);

      let dx = worldPoint.x - this.anchorX;
      let dy = worldPoint.y - this.anchorY;

      // Prevent dragging forward past slingshot fork
      if (dx > 12) dx = 12;

      // Limit drag radius
      const dist = Math.hypot(dx, dy);
      if (dist > this.maxDragDistance) {
        const angle = Math.atan2(dy, dx);
        dx = Math.cos(angle) * this.maxDragDistance;
        dy = Math.sin(angle) * this.maxDragDistance;
      }

      const birdX = this.anchorX + dx;
      const birdY = this.anchorY + dy;

      this.currentBird.image.setPosition(birdX, birdY);

      // Face forward toward launch target!
      const launchAngle = Math.atan2(this.anchorY - birdY, this.anchorX - birdX);
      this.currentBird.image.setRotation(launchAngle);

      this.drawActiveBands(birdX, birdY);
      this.drawTrajectory(birdX, birdY);

      // Periodic stretch sound on drag
      this.stretchAudioTimer++;
      if (this.stretchAudioTimer % 16 === 0 && dist > 15) {
        this.audio.playSlingshotStretch(dist / this.maxDragDistance);
      }
    });

    const handleRelease = () => {
      if (!this.isAiming || !this.currentBird) return;
      this.isAiming = false;

      const birdX = this.currentBird.image.x;
      const birdY = this.currentBird.image.y;
      const pullDist = Math.hypot(this.anchorX - birdX, this.anchorY - birdY);

      this.clearTrajectory();

      if (pullDist > 18) {
        // Save current trajectory as ghost trail for next shot reference
        this.saveGhostTrajectory();

        // Valid launch! Convert pull vector into velocity
        const vx = (this.anchorX - birdX) * this.launchMultiplier;
        const vy = (this.anchorY - birdY) * this.launchMultiplier;

        const birdToLaunch = this.currentBird;
        this.currentBird = null;
        birdToLaunch.launch(vx, vy);

        // Snap rubber band back animation & launch dust
        this.animateBandSnap();
        this.spawnLaunchDust(this.x, this.y - 30);
      } else {
        // Cancel shot: Return bird smoothly to rest
        const bird = this.currentBird;
        this.scene.tweens.add({
          targets: bird.image,
          x: this.anchorX,
          y: this.anchorY,
          duration: 180,
          ease: 'Quad.easeOut',
          onUpdate: () => {
            if (this.currentBird) {
              this.drawActiveBands(this.currentBird.image.x, this.currentBird.image.y);
            }
          },
          onComplete: () => {
            if (this.currentBird) {
              this.currentBird.image.setRotation(0);
            }
            this.drawRestingBands();
          }
        });
      }
    };

    this.scene.input.on('pointerup', handleRelease);
    this.scene.input.on('pointerupoutside', handleRelease);
  }

  private drawRestingBands(): void {
    this.backBandGraphics.clear();
    this.frontBandGraphics.clear();

    const bx = this.currentBird ? this.currentBird.image.x : this.anchorX;
    const by = this.currentBird ? this.currentBird.image.y : this.anchorY;

    // Back band (Left prong to center)
    this.backBandGraphics.lineStyle(5, 0x3e1f0e, 1);
    this.backBandGraphics.beginPath();
    this.backBandGraphics.moveTo(this.leftProngX, this.leftProngY);
    this.backBandGraphics.lineTo(bx - 4, by);
    this.backBandGraphics.strokePath();

    // Front band (Right prong to center)
    this.frontBandGraphics.lineStyle(5, 0x4d2813, 1);
    this.frontBandGraphics.beginPath();
    this.frontBandGraphics.moveTo(this.rightProngX, this.rightProngY);
    this.frontBandGraphics.lineTo(bx + 4, by);
    this.frontBandGraphics.strokePath();

    // Leather pouch
    this.frontBandGraphics.fillStyle(0x27140a, 1);
    this.frontBandGraphics.fillCircle(bx, by, 7);
  }

  private drawActiveBands(bx: number, by: number): void {
    this.backBandGraphics.clear();
    this.frontBandGraphics.clear();

    const pullDist = Math.hypot(this.anchorX - bx, this.anchorY - by);
    const bandThickness = Math.max(2.5, 6 - (pullDist / this.maxDragDistance) * 3);

    // Back band (stretching from left prong to bird)
    this.backBandGraphics.lineStyle(bandThickness, 0x3e1f0e, 1);
    this.backBandGraphics.beginPath();
    this.backBandGraphics.moveTo(this.leftProngX, this.leftProngY);
    this.backBandGraphics.lineTo(bx - 6, by);
    this.backBandGraphics.strokePath();

    // Front band (stretching from right prong to bird)
    this.frontBandGraphics.lineStyle(bandThickness, 0x4d2813, 1);
    this.frontBandGraphics.beginPath();
    this.frontBandGraphics.moveTo(this.rightProngX, this.rightProngY);
    this.frontBandGraphics.lineTo(bx + 6, by);
    this.frontBandGraphics.strokePath();

    // Leather Pouch holding bird
    this.frontBandGraphics.fillStyle(0x27140a, 1);
    this.frontBandGraphics.fillCircle(bx, by, 8);
  }

  private animateBandSnap(): void {
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 180,
      ease: 'Elastic.easeOut',
      onUpdate: () => {
        this.drawRestingBands();
      }
    });
  }

  private drawTrajectory(bx: number, by: number): void {
    this.trajectoryGraphics.clear();
    this.lastTrajectoryPoints = [];

    const vx = (this.anchorX - bx) * this.launchMultiplier;
    const vy = (this.anchorY - by) * this.launchMultiplier;

    // Trajectory prediction steps
    const simSteps = 26;
    const dt = 1.6;
    const grav = 0.32; // Calibrated for Matter.js gravity

    let simX = this.anchorX;
    let simY = this.anchorY;
    let simVx = vx;
    let simVy = vy;

    for (let i = 0; i < simSteps; i++) {
      simX += simVx * dt;
      simY += simVy * dt + 0.5 * grav * dt * dt;
      simVy += grav * dt;

      if (simY > 630) break; // hits ground level

      this.lastTrajectoryPoints.push({ x: simX, y: simY });

      const alpha = 1 - (i / simSteps) * 0.72;
      const radius = Math.max(2, 5 - (i / simSteps) * 3);

      this.trajectoryGraphics.fillStyle(0xffffff, alpha);
      this.trajectoryGraphics.fillCircle(simX, simY, radius);
    }
  }

  private saveGhostTrajectory(): void {
    this.ghostTrajectoryGraphics.clear();
    if (this.lastTrajectoryPoints.length === 0) return;

    this.ghostTrajectoryGraphics.fillStyle(0xffffff, 0.3);
    for (let i = 0; i < this.lastTrajectoryPoints.length; i += 2) {
      const pt = this.lastTrajectoryPoints[i];
      this.ghostTrajectoryGraphics.fillCircle(pt.x, pt.y, 2.5);
    }
  }

  private spawnLaunchDust(x: number, y: number): void {
    for (let i = 0; i < 6; i++) {
      const dust = this.scene.add.image(
        x + (Math.random() * 24 - 12),
        y + (Math.random() * 16 - 8),
        'part_dust'
      );
      dust.setDepth(15);
      dust.setScale(0.6 + Math.random() * 0.4);
      this.scene.tweens.add({
        targets: dust,
        x: dust.x - 25 - Math.random() * 30,
        y: dust.y - 12 - Math.random() * 20,
        alpha: 0,
        scale: 1.3,
        duration: 380 + Math.random() * 200,
        ease: 'Quad.easeOut',
        onComplete: () => dust.destroy()
      });
    }
  }

  private clearTrajectory(): void {
    this.trajectoryGraphics.clear();
  }

  public destroy(): void {
    this.backBandGraphics.destroy();
    this.frontBandGraphics.destroy();
    this.trajectoryGraphics.destroy();
    this.ghostTrajectoryGraphics.destroy();
    this.baseSprite.destroy();
  }
}
