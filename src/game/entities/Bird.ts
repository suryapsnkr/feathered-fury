import type Phaser from 'phaser';
import { BirdType } from '../types';
import { AudioSystem } from '../systems/AudioSystem';
import { gameEvents } from '../events';

export type BirdState = 'WAITING' | 'LOADED' | 'FLYING' | 'SETTLED' | 'DESTROYED';

export class Bird {
  public scene: Phaser.Scene;
  public type: BirdType;
  public image: Phaser.GameObjects.Image;
  public sprite: Phaser.Physics.Matter.Sprite | null = null;
  public state: BirdState = 'WAITING';
  public hasUsedAbility: boolean = false;
  public isSplitChild: boolean = false;
  private audio: AudioSystem;
  private smokeTimer: number = 0;
  private settleTimer: number = 0;
  private lastPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(scene: Phaser.Scene, x: number, y: number, type: BirdType, isSplitChild: boolean = false) {
    this.scene = scene;
    this.type = type;
    this.isSplitChild = isSplitChild;
    this.audio = AudioSystem.getInstance();

    const textureKey = type === 'yellow' ? 'bird_yellow' : type === 'blue' ? 'bird_blue' : 'bird_red';

    // Start as a smooth visual image sprite (no physics body while in queue or slingshot)
    this.image = scene.add.image(x, y, textureKey);
    this.image.setDepth(15);
    (this.image as any).birdInstance = this;
    this.lastPosition = { x, y };

    if (isSplitChild) {
      this.convertToPhysicsBody();
      this.state = 'FLYING';
      this.hasUsedAbility = true;
    }
  }

  public convertToPhysicsBody(): Phaser.Physics.Matter.Sprite {
    const radius = this.type === 'blue' ? 14 : this.type === 'yellow' ? 18 : 20;
    const density = this.type === 'blue' ? 0.0025 : this.type === 'yellow' ? 0.0035 : 0.0045;
    const restitution = this.type === 'yellow' ? 0.28 : 0.4;

    this.sprite = this.scene.matter.add.gameObject(this.image, {
      shape: { type: 'circle', radius },
      density,
      friction: 0.5,
      frictionStatic: 0.7,
      restitution,
      label: 'bird'
    }) as Phaser.Physics.Matter.Sprite;

    (this.sprite as any).birdInstance = this;
    return this.sprite;
  }

  public isSettled(): boolean {
    return this.state === 'SETTLED';
  }

  public launch(vx: number, vy: number): void {
    if (this.state !== 'LOADED') return;
    this.state = 'FLYING';
    this.settleTimer = 0;

    // Convert image into dynamic Matter physics body at exact launch position
    this.convertToPhysicsBody();

    // Apply launch velocity directly to the new dynamic body
    this.sprite!.setVelocity(vx, vy);
    this.sprite!.setAngularVelocity(0);

    this.audio.playSlingshotRelease();

    // Ability notification for Yellow / Blue
    if (this.type !== 'red') {
      gameEvents.emit('BIRD_ABILITY_READY', this.type, true);
    }
  }

  public activateAbility(): boolean {
    if (this.state !== 'FLYING' || this.hasUsedAbility || !this.sprite) return false;
    this.hasUsedAbility = true;
    gameEvents.emit('BIRD_ABILITY_READY', this.type, false);
    gameEvents.emit('BIRD_ABILITY_USED', this.type);

    const body = this.sprite.body as any;
    if (!body) return false;
    const vx = body.velocity.x;
    const vy = body.velocity.y;

    if (this.type === 'yellow') {
      // Chuck's Speed Boost: supersonic thrust along flight path
      this.audio.playYellowBoost();
      this.sprite.setTexture('bird_yellow_boost');
      const boostSpeed = Math.max(24, Math.hypot(vx, vy) * 2.2);
      const angle = Math.atan2(vy, vx);
      this.sprite.setVelocity(Math.cos(angle) * boostSpeed, Math.sin(angle) * boostSpeed);

      // Increase density during boost to smash wooden structures
      this.scene.matter.body.setDensity(body, 0.015);

      this.spawnSpeedParticles();
      return true;
    } else if (this.type === 'blue') {
      // The Blues' Tri-Split: clone into 3 projectiles with angular spread
      this.audio.playBlueSplit();
      const currentSpeed = Math.max(14, Math.hypot(vx, vy));
      const currentAngle = Math.atan2(vy, vx);

      const spread = 0.22; // ~12 degrees spread
      const angleUp = currentAngle - spread;
      const angleDown = currentAngle + spread;

      const birdUp = new Bird(this.scene, this.sprite.x, this.sprite.y - 12, 'blue', true);
      birdUp.sprite!.setVelocity(Math.cos(angleUp) * currentSpeed, Math.sin(angleUp) * currentSpeed);

      const birdDown = new Bird(this.scene, this.sprite.x, this.sprite.y + 12, 'blue', true);
      birdDown.sprite!.setVelocity(Math.cos(angleDown) * currentSpeed, Math.sin(angleDown) * currentSpeed);

      const levelScene = this.scene as any;
      if (levelScene.activeSplitBirds) {
        levelScene.activeSplitBirds.push(birdUp, birdDown);
      }

      return true;
    } else if (this.type === 'red') {
      // Red War Cry: downward shockwave thrust
      this.audio.playSlingshotStretch(0.9);
      this.sprite.setVelocity(vx * 1.15, vy + 4.5);
      return true;
    }

    return false;
  }

  public update(time: number, delta: number): void {
    if (this.state !== 'FLYING' || !this.sprite || !this.sprite.active) return;

    const body = this.sprite.body as any;
    if (!body) return;

    const vx = body.velocity.x;
    const vy = body.velocity.y;
    const speed = Math.hypot(vx, vy);

    // Face direction of flight
    if (speed > 0.8) {
      this.sprite.setRotation(Math.atan2(vy, vx));
    }

    // Trajectory smoke puff trail
    this.smokeTimer += delta;
    if (this.smokeTimer > 75 && speed > 2) {
      this.smokeTimer = 0;
      this.spawnSmokeParticle(this.sprite.x, this.sprite.y);
    }

    // Check if settled or out of bounds
    const dx = Math.abs(this.sprite.x - this.lastPosition.x);
    const dy = Math.abs(this.sprite.y - this.lastPosition.y);
    this.lastPosition = { x: this.sprite.x, y: this.sprite.y };

    if (speed < 0.4 && dx < 0.4 && dy < 0.4) {
      this.settleTimer += delta;
    } else {
      this.settleTimer = 0;
    }

    const outOfBounds = this.sprite.x > 1400 || this.sprite.x < -100 || this.sprite.y > 670;

    if (this.settleTimer > 1200 || outOfBounds) {
      this.state = 'SETTLED';
      gameEvents.emit('BIRD_ABILITY_READY', this.type, false);
      gameEvents.emit('BIRD_SETTLED');
    }
  }

  private spawnSmokeParticle(x: number, y: number): void {
    const puff = this.scene.add.image(x, y, 'part_smoke');
    puff.setScale(0.5);
    puff.setAlpha(0.6);
    puff.setDepth(10);
    this.scene.tweens.add({
      targets: puff,
      scale: 1.1,
      alpha: 0,
      duration: 450,
      onComplete: () => puff.destroy()
    });
  }

  private spawnSpeedParticles(): void {
    if (!this.sprite) return;
    for (let i = 0; i < 8; i++) {
      const p = this.scene.add.image(this.sprite.x - 10, this.sprite.y + (Math.random() * 20 - 10), 'part_feather_yellow');
      p.setDepth(14);
      p.setScale(0.8);
      this.scene.tweens.add({
        targets: p,
        x: p.x - 40 - Math.random() * 30,
        y: p.y + (Math.random() * 30 - 15),
        alpha: 0,
        scale: 0.2,
        duration: 400,
        onComplete: () => p.destroy()
      });
    }
  }

  public destroy(): void {
    this.state = 'DESTROYED';
    if (this.sprite && this.sprite.active) {
      this.sprite.destroy();
      this.sprite = null;
    }
    if (this.image && this.image.active) {
      this.image.destroy();
    }
  }
}
