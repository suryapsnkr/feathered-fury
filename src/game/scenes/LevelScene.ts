import Phaser from 'phaser';
import { Bird } from '../entities/Bird';
import { Pig } from '../entities/Pig';
import { DestructibleBlock } from '../entities/DestructibleBlock';
import { Slingshot } from '../entities/Slingshot';
import { PhysicsSystem } from '../systems/PhysicsSystem';
import { ScoringSystem } from '../systems/ScoringSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { GAME_LEVELS } from '../levels/levelData';
import { LevelData } from '../types';
import { gameEvents } from '../events';

export class LevelScene extends Phaser.Scene {
  public levelId: number = 1;
  public currentLevelData!: LevelData;
  public slingshot!: Slingshot;
  public birdsQueue: Bird[] = [];
  public activeBird: Bird | null = null;
  public activeSplitBirds: Bird[] = [];
  public pigs: Pig[] = [];
  public blocks: DestructibleBlock[] = [];
  public groundBody!: any;

  private physicsSystem!: PhysicsSystem;
  private scoringSystem!: ScoringSystem;
  private audio!: AudioSystem;

  private isLevelComplete: boolean = false;
  private isFinishing: boolean = false;
  private isIntroRunning: boolean = false;
  private clouds: Phaser.GameObjects.Image[] = [];
  private blinkTimer: number = 0;

  constructor() {
    super({ key: 'LevelScene' });
  }

  init(data: { levelId?: number }): void {
    this.levelId = data.levelId || 1;
    const found = GAME_LEVELS.find((l) => l.id === this.levelId);
    this.currentLevelData = found || GAME_LEVELS[0];
    this.isLevelComplete = false;
    this.isFinishing = false;
    this.isIntroRunning = false;
    this.birdsQueue = [];
    this.activeBird = null;
    this.activeSplitBirds = [];
    this.pigs = [];
    this.blocks = [];
    this.clouds = [];
    this.blinkTimer = 0;
  }

  create(): void {
    this.audio = AudioSystem.getInstance();
    this.scoringSystem = new ScoringSystem(this.currentLevelData);

    // Setup World Bounds & Camera
    this.cameras.main.setBounds(0, 0, 1300, 720);
    this.matter.world.setBounds(0, 0, 1300, 720, 32, true, true, false, true);

    // 1. Build Visual Environment
    this.createEnvironment();

    // 2. Setup Matter Ground Platform
    this.createGround();

    // 3. Initialize Physics System
    this.physicsSystem = new PhysicsSystem(this);

    // 4. Spawn Blocks and Pigs from level definition
    this.spawnLevelEntities();

    // 5. Spawn Slingshot and Birds
    this.spawnSlingshotAndBirds();

    // 6. Ability Activation & Quick Skip Input
    this.setupAbilityInput();

    // 7. Setup Keyboard Shortcuts
    this.setupKeyboardShortcuts();

    // 8. Run Cinematic Level Intro Camera Pan
    this.runIntroCamera();

    // 9. Emit Level Loaded Event
    gameEvents.emit('LEVEL_LOADED', this.currentLevelData);
  }

  private createEnvironment(): void {
    // 1. Sky Gradient
    const sky = this.add.graphics();
    sky.fillGradientStyle(0x38bdf8, 0x38bdf8, 0xbae6fd, 0xe0f2fe, 1);
    sky.fillRect(0, 0, 1300, 720);
    sky.setDepth(0);

    // 2. Sun
    const sun = this.add.image(1120, 100, 'sun');
    sun.setDepth(1);

    // 3. Parallax Rolling Hills
    const hills = this.add.image(650, 520, 'hill_bg');
    hills.setDepth(2);
    hills.setDisplaySize(1300, 260);

    // 4. Animated Clouds
    const cloud1 = this.add.image(200, 110, 'cloud_1');
    const cloud2 = this.add.image(650, 80, 'cloud_2');
    const cloud3 = this.add.image(1050, 140, 'cloud_1');
    cloud1.setDepth(3);
    cloud2.setDepth(3);
    cloud3.setDepth(3);
    this.clouds = [cloud1, cloud2, cloud3];
  }

  private createGround(): void {
    // Solid static ground body for Matter physics
    this.groundBody = this.matter.add.rectangle(650, 650, 1320, 80, {
      isStatic: true,
      friction: 0.9,
      restitution: 0.1,
      label: 'ground'
    });

    // Grass and soil visual sprite
    const groundSprite = this.add.image(650, 645, 'ground_grass');
    groundSprite.setDisplaySize(1300, 90);
    groundSprite.setDepth(10);
  }

  private spawnLevelEntities(): void {
    // Destructible Blocks
    this.currentLevelData.blocks.forEach((b) => {
      const block = new DestructibleBlock(this, b.x, b.y, b.type);
      if (b.angle) {
        block.sprite.setRotation(b.angle);
      }
      this.blocks.push(block);
    });

    // Enemy Pigs
    this.currentLevelData.pigs.forEach((p) => {
      const pig = new Pig(this, p.x, p.y, p.type);
      this.pigs.push(pig);
    });
  }

  private spawnSlingshotAndBirds(): void {
    // Slingshot on left side of field
    this.slingshot = new Slingshot(this, 220, 580);

    // Spawn queued birds behind slingshot on the grass
    const birdTypes = this.currentLevelData.birds;
    this.birdsQueue = [];

    birdTypes.forEach((type, index) => {
      const startX = index === 0 ? this.slingshot.anchorX : 155 - index * 36;
      const startY = index === 0 ? this.slingshot.anchorY : 595;

      const bird = new Bird(this, startX, startY, type);
      this.birdsQueue.push(bird);
    });

    // Load first bird into slingshot
    if (this.birdsQueue.length > 0) {
      this.activeBird = this.birdsQueue[0];
      this.slingshot.loadBird(this.activeBird);
    }
  }

  private runIntroCamera(): void {
    this.isIntroRunning = true;
    this.cameras.main.scrollX = 340;

    // Ready Banner Overlay
    const banner = this.add.text(
      640,
      180,
      `LEVEL ${this.levelId}: ${this.currentLevelData.name.toUpperCase()}`,
      {
        fontFamily: 'Titan One, Fredoka, sans-serif',
        fontSize: '26px',
        color: '#facc15',
        stroke: '#0f172a',
        strokeThickness: 5
      }
    );
    banner.setOrigin(0.5);
    banner.setDepth(40);
    banner.setScrollFactor(0); // keep stationary on screen during pan

    this.tweens.add({
      targets: this.cameras.main,
      scrollX: 0,
      duration: 1100,
      ease: 'Cubic.easeInOut',
      onComplete: () => {
        this.isIntroRunning = false;
        this.audio.playBirdChirp();
        this.tweens.add({
          targets: banner,
          alpha: 0,
          y: 140,
          duration: 350,
          delay: 250,
          onComplete: () => banner.destroy()
        });
      }
    });
  }

  private setupAbilityInput(): void {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isIntroRunning) return;

      // 1. If bird in flight: Trigger mid-air special ability
      if (this.activeBird && this.activeBird.state === 'FLYING') {
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        // Avoid clicking inside slingshot bounding box if somehow still there
        if (worldPoint.x < 260 && worldPoint.y > 480) return;

        this.activeBird.activateAbility();
        this.activeSplitBirds.forEach((b) => b.activateAbility());
        return;
      }

      // 2. If settling or tumbling on ground: Quick skip to next bird
      if (this.activeBird && this.activeBird.state === 'SETTLED') {
        this.advanceBirdQueue();
      }
    });
  }

  private setupKeyboardShortcuts(): void {
    if (!this.input.keyboard) return;

    // R: Restart level
    this.input.keyboard.on('keydown-R', () => {
      this.audio.playButtonClick();
      this.restartLevel();
    });

    // M: Toggle Sound
    this.input.keyboard.on('keydown-M', () => {
      this.audio.toggleMute();
    });

    // ESC: Toggle Pause
    this.input.keyboard.on('keydown-ESC', () => {
      gameEvents.emit('TOGGLE_PAUSE');
    });

    // Space: Special Ability in flight
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.activeBird && this.activeBird.state === 'FLYING') {
        this.activeBird.activateAbility();
        this.activeSplitBirds.forEach((b) => b.activateAbility());
      }
    });

    // Number keys 1-5 for instant level selection
    for (let i = 1; i <= 5; i++) {
      this.input.keyboard.on(`keydown-${i}`, () => {
        this.audio.playButtonClick();
        this.loadLevel(i);
      });
    }
  }

  public advanceBirdQueue(): void {
    if (this.isLevelComplete) return;

    const finishedBird = this.activeBird;

    // Remove active bird from queue
    if (this.birdsQueue.length > 0) {
      this.birdsQueue.shift();
    }

    // Clean up active split birds
    this.activeSplitBirds.forEach((b) => b.destroy());
    this.activeSplitBirds = [];

    // Fade out finished bird cleanly
    if (finishedBird) {
      const targetObj = finishedBird.sprite || finishedBird.image;
      if (targetObj && targetObj.active) {
        this.tweens.add({
          targets: targetObj,
          alpha: 0,
          duration: 500,
          delay: 500,
          onComplete: () => {
            finishedBird.destroy();
          }
        });
      }
    }

    if (this.birdsQueue.length > 0) {
      // Load next bird with friendly chirp
      this.activeBird = this.birdsQueue[0];
      this.audio.playBirdChirp();

      this.tweens.add({
        targets: this.activeBird.image,
        x: this.slingshot.anchorX,
        y: this.slingshot.anchorY,
        duration: 350,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          if (this.activeBird) {
            this.slingshot.loadBird(this.activeBird);
          }
        }
      });

      // Pan camera back to slingshot view
      this.cameras.main.pan(650, 360, 500, 'Cubic.easeInOut');
    } else {
      this.activeBird = null;
    }

    // Check resolution after bird settles
    this.time.delayedCall(1200, () => {
      this.checkLevelResolution();
    });
  }

  public checkLevelResolution(): void {
    if (this.isLevelComplete || this.isFinishing) return;

    // Count remaining alive pigs
    const alivePigs = this.pigs.filter((p) => !p.isDefeated && p.sprite && p.sprite.active);

    if (alivePigs.length === 0) {
      // VICTORY!
      this.handleVictory();
    } else if (!this.activeBird && this.birdsQueue.length === 0) {
      // DEFEAT! Out of birds and pigs remain
      this.handleDefeat('Out of birds! Pigs survived the assault.');
    }
  }

  private handleVictory(): void {
    if (this.isLevelComplete) return;
    this.isLevelComplete = true;
    this.isFinishing = false;

    // Remaining unused birds bonus
    const unusedBirdsCount =
      this.birdsQueue.length + (this.activeBird && this.activeBird.state === 'LOADED' ? 1 : 0);
    const birdBonus = unusedBirdsCount * 10000;
    const finalScore = this.scoringSystem.addScore(birdBonus);
    const stars = this.scoringSystem.calculateStars(finalScore);
    const isHighScore = this.scoringSystem.saveLevelProgress(finalScore, stars);

    // Unused birds celebration hop!
    this.birdsQueue.forEach((bird, idx) => {
      this.time.delayedCall(idx * 200, () => {
        this.audio.playBonusHop();
        this.tweens.add({
          targets: bird.image,
          y: bird.image.y - 30,
          yoyo: true,
          duration: 180,
          ease: 'Cubic.easeOut'
        });
      });
    });

    this.audio.playVictoryFanfare();

    gameEvents.emit('LEVEL_VICTORY', {
      levelId: this.levelId,
      score: finalScore,
      stars,
      birdsUnused: unusedBirdsCount,
      birdBonus,
      isHighScore
    });
  }

  private handleDefeat(reason: string): void {
    if (this.isLevelComplete) return;
    this.isLevelComplete = true;
    this.isFinishing = false;

    this.audio.playDefeat();

    gameEvents.emit('LEVEL_DEFEAT', {
      levelId: this.levelId,
      score: this.scoringSystem.currentScore,
      reason
    });
  }

  update(time: number, delta: number): void {
    // 1. Animated drifting clouds
    this.clouds.forEach((cloud, idx) => {
      cloud.x += 0.2 + idx * 0.1;
      if (cloud.x > 1400) {
        cloud.x = -150;
      }
    });

    // 2. Active Bird Flight update & Camera follow
    if (this.activeBird && this.activeBird.state === 'FLYING') {
      this.activeBird.update(time, delta);

      // Follow flying bird smoothly with camera
      if (this.activeBird.sprite && this.activeBird.sprite.active) {
        const targetCamX = Phaser.Math.Clamp(this.activeBird.sprite.x + 120, 650, 950);
        this.cameras.main.scrollX = Phaser.Math.Linear(
          this.cameras.main.scrollX,
          targetCamX - 640,
          0.05
        );
      }

      if (this.activeBird.isSettled()) {
        this.advanceBirdQueue();
      }
    }

    // 3. Update any split birds
    this.activeSplitBirds.forEach((b) => {
      if (b.state === 'FLYING') {
        b.update(time, delta);
      }
    });

    // 4. Idle blinking animation for waiting birds
    this.blinkTimer += delta;
    if (this.blinkTimer > 2800) {
      this.blinkTimer = 0;
      const available = this.birdsQueue.filter(
        (b) => b.state === 'WAITING' || b.state === 'LOADED'
      );
      if (available.length > 0) {
        const b = available[Math.floor(Math.random() * available.length)];
        const originalTex =
          b.type === 'yellow' ? 'bird_yellow' : b.type === 'blue' ? 'bird_blue' : 'bird_red';
        const blinkTex =
          b.type === 'yellow'
            ? 'bird_yellow'
            : b.type === 'blue'
            ? 'bird_blue_blink'
            : 'bird_red_blink';

        b.image.setTexture(blinkTex);
        this.time.delayedCall(160, () => {
          if (b.image && b.image.active) {
            b.image.setTexture(originalTex);
          }
        });
      }
    }

    // 5. Cinematic check for final pig defeat slow-motion
    if (!this.isLevelComplete && !this.isFinishing && this.pigs.length > 0) {
      const alivePigs = this.pigs.filter((p) => !p.isDefeated && p.sprite && p.sprite.active);
      if (alivePigs.length === 0) {
        this.isFinishing = true;
        // Slow-motion impact finale!
        this.matter.world.engine.timing.timeScale = 0.35;
        this.time.delayedCall(450, () => {
          this.matter.world.engine.timing.timeScale = 1.0;
          this.handleVictory();
        });
      }
    }
  }

  public restartLevel(): void {
    this.matter.world.engine.timing.timeScale = 1.0;
    this.scene.restart({ levelId: this.levelId });
  }

  public loadNextLevel(): void {
    this.matter.world.engine.timing.timeScale = 1.0;
    const nextId = Math.min(5, this.levelId + 1);
    this.scene.restart({ levelId: nextId });
  }

  public loadLevel(levelId: number): void {
    this.matter.world.engine.timing.timeScale = 1.0;
    this.scene.restart({ levelId });
  }

  public shutdown(): void {
    this.matter.world.engine.timing.timeScale = 1.0;
    if (this.physicsSystem) {
      this.physicsSystem.destroy();
    }
    if (this.slingshot) {
      this.slingshot.destroy();
    }
    this.birdsQueue.forEach((b) => b.destroy());
    this.activeSplitBirds.forEach((b) => b.destroy());
    this.pigs.forEach((p) => p.destroy());
    this.blocks.forEach((b) => b.destroy());
  }
}
