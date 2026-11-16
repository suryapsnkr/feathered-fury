/**
 * GameScene - Main gameplay scene with Matter.js physics, slingshot mechanics,
 * special bird abilities, destructible structures, pigs, camera, particles, and scoring.
 */
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.levelId = data && data.levelId ? data.levelId : 1;
    this.levelData = GAME_LEVELS.find(l => l.id === this.levelId) || GAME_LEVELS[0];

    // State flags
    this.score = 0;
    this.displayScore = 0;
    this.isPaused = false;
    this.isLevelOver = false;
    this.gameState = 'READY'; // READY, AIMING, FLIGHT, SETTLING, RESOLVED

    // Slingshot parameters
    this.SLING_X = 220;
    this.SLING_Y = 505;
    this.PRONG_L = { x: 204, y: 468 };
    this.PRONG_R = { x: 236, y: 468 };
    this.REST_POS = { x: 220, y: 474 };
    this.MAX_PULL = 95;
    this.LAUNCH_SPEED = 0.25;

    // Collections
    this.birdsQueue = [];
    this.activeBird = null;
    this.activeBirdClones = [];
    this.blocks = [];
    this.pigs = [];
    this.pastTrajectoryDots = [];
    this.trajectoryDots = [];

    // Timers
    this.flightTimer = 0;
    this.settleTimer = 0;

    // UI handles
    this.hintText = null;
    this.scoreText = null;
    this.highScoreText = null;
    this.hudContainer = null;
    this.hintContainer = null;
    this.pauseModal = null;
  }

  create() {
    const { width, height } = this.scale;

    // Reference to Matter Body helper
    this.MatterBody = Phaser.Physics.Matter.Matter.Body;

    // Set world and camera bounds (supports wide pan)
    this.cameras.main.setBounds(0, 0, 1400, 720);
    this.matter.world.setBounds(0, -600, 1450, 1320);

    // 1. Environment Layers
    this.createEnvironment();

    // 2. Physics Static Ground & Boundaries
    this.createGround();

    // 3. Destructible Structure & Pigs
    this.buildLevel();

    // 4. Slingshot & Rubber Bands Graphics
    this.createSlingshot();

    // 5. HUD & UI Overlays (created before birds so hintText is available)
    this.createHUD();

    // 6. Birds Queue & First Bird Load
    this.initBirds();

    // 7. Collision Listeners
    this.setupCollisions();

    // 8. Input Controls (Drag, Ability, Pan, Shortcuts)
    this.setupInput();

    // 9. Camera Intro Pan
    this.runIntroCamera();
  }

  // --- ENVIRONMENT & GROUND ---
  createEnvironment() {
    const { width, height } = this.scale;
    // Parallax Sky, Mountains, Hills
    this.add.image(700, 360, 'bg_sky').setDisplaySize(1400, 720).setScrollFactor(0.2);

    // Drifting clouds
    this.clouds = [];
    for (let i = 0; i < 5; i++) {
      const c = this.add.image(
        Phaser.Math.Between(50, 1350),
        Phaser.Math.Between(40, 220),
        'bg_cloud'
      ).setScrollFactor(0.3).setScale(Phaser.Math.FloatBetween(0.8, 1.4));
      c.speed = Phaser.Math.FloatBetween(0.3, 0.7);
      this.clouds.push(c);
    }

    this.add.image(700, height - 200, 'bg_mountains').setDisplaySize(1400, 260).setScrollFactor(0.5);
    this.add.image(700, height - 120, 'bg_hills').setDisplaySize(1400, 200).setScrollFactor(0.8);
    this.add.image(700, height - 40, 'ground').setDisplaySize(1400, 120).setScrollFactor(1.0).setDepth(2);
  }

  createGround() {
    // Static Ground Body at y = 660, height 120 (top is at y = 600)
    this.groundBody = this.matter.add.rectangle(700, 660, 1500, 120, {
      isStatic: true,
      friction: 0.85,
      restitution: 0.1,
      label: 'ground'
    });
  }

  // --- LEVEL BUILDER ---
  buildLevel() {
    // Spawn Blocks
    this.levelData.blocks.forEach(bData => {
      const block = this.createBlock(bData);
      this.blocks.push(block);
    });

    // Spawn Pigs
    this.levelData.pigs.forEach(pData => {
      const pig = this.createPig(pData);
      this.pigs.push(pig);
    });
  }

  createBlock(data) {
    const { type, x, y } = data;
    let width = 40, height = 40;
    let maxHp = 80;
    let density = 0.002;
    let friction = 0.65;
    let restitution = 0.15;
    let material = 'wood';

    if (type === 'wood_plank_h') {
      width = 140; height = 24; maxHp = 100;
    } else if (type === 'wood_plank_v') {
      width = 24; height = 140; maxHp = 100;
    } else if (type === 'wood_block') {
      width = 40; height = 40; maxHp = 80;
    } else if (type === 'stone_plank_h') {
      width = 140; height = 26; maxHp = 250; density = 0.0055; friction = 0.85; restitution = 0.05; material = 'stone';
    } else if (type === 'stone_plank_v') {
      width = 26; height = 140; maxHp = 250; density = 0.0055; friction = 0.85; restitution = 0.05; material = 'stone';
    } else if (type === 'stone_block') {
      width = 40; height = 40; maxHp = 220; density = 0.0055; friction = 0.85; restitution = 0.05; material = 'stone';
    } else if (type === 'glass_plank_h') {
      width = 140; height = 20; maxHp = 35; density = 0.0012; friction = 0.25; restitution = 0.05; material = 'glass';
    } else if (type === 'glass_plank_v') {
      width = 20; height = 140; maxHp = 35; density = 0.0012; friction = 0.25; restitution = 0.05; material = 'glass';
    } else if (type === 'glass_block') {
      width = 40; height = 40; maxHp = 30; density = 0.0012; friction = 0.25; restitution = 0.05; material = 'glass';
    } else if (type === 'tnt_box') {
      width = 44; height = 44; maxHp = 25; density = 0.0025; friction = 0.6; restitution = 0.1; material = 'tnt';
    }

    const sprite = this.matter.add.sprite(x, y, type, null, {
      density: density,
      friction: friction,
      frictionStatic: friction * 1.2,
      restitution: restitution,
      chamfer: { radius: 1 }
    });

    sprite.setDepth(5);
    sprite.customData = {
      isBlock: true,
      material: material,
      type: type,
      maxHp: maxHp,
      hp: maxHp,
      isTnt: material === 'tnt',
      destroyed: false
    };

    return sprite;
  }

  createPig(data) {
    const { type, x, y } = data;
    let texKey = 'pig_basic';
    let radius = 20;
    let maxHp = 40;
    let density = 0.0018;

    if (type === 'helmet') {
      texKey = 'pig_helmet';
      radius = 21;
      maxHp = 90;
      density = 0.0025;
    } else if (type === 'king') {
      texKey = 'pig_king';
      radius = 26;
      maxHp = 150;
      density = 0.003;
    }

    const sprite = this.matter.add.sprite(x, y, texKey, null, {
      shape: { type: 'circle', radius: radius },
      density: density,
      friction: 0.55,
      frictionStatic: 0.7,
      restitution: 0.2
    });

    sprite.setDepth(6);
    sprite.customData = {
      isPig: true,
      type: type,
      maxHp: maxHp,
      hp: maxHp,
      dead: false
    };

    return sprite;
  }

  // --- SLINGSHOT & RUBBER BANDS ---
  createSlingshot() {
    // Back fork
    this.slingshotBase = this.add.image(this.SLING_X, this.SLING_Y, 'slingshot_base').setDepth(3);

    // Front prong (layered above bird pouch for 3D realism)
    this.slingshotFront = this.add.image(this.SLING_X, this.SLING_Y, 'slingshot_front').setDepth(8);

    // Graphics object for dynamic rubber bands
    this.rubberGfx = this.add.graphics().setDepth(7);

    // Guide dots container
    this.trajectoryGroup = this.add.group();
    for (let i = 0; i < 24; i++) {
      const dot = this.add.image(0, 0, 'trajectory_dot').setScale(0.7 - i * 0.02).setVisible(false).setDepth(4);
      this.trajectoryDots.push(dot);
    }
  }

  drawRubberBands(birdX, birdY) {
    this.rubberGfx.clear();

    const dist = Phaser.Math.Distance.Between(this.REST_POS.x, this.REST_POS.y, birdX, birdY);
    const bandThickness = Math.max(2.5, 6 - (dist / this.MAX_PULL) * 3);

    // Back band (Prong Left to Bird)
    this.rubberGfx.lineStyle(bandThickness, 0x3d1a08, 1);
    this.rubberGfx.beginPath();
    this.rubberGfx.moveTo(this.PRONG_L.x, this.PRONG_L.y);
    this.rubberGfx.lineTo(birdX - 10, birdY);
    this.rubberGfx.stroke();

    // Leather Pouch holding bird
    this.rubberGfx.fillStyle(0x271105, 0.95);
    this.rubberGfx.fillCircle(birdX - 8, birdY, 12);

    // Front band (Prong Right to Bird)
    this.rubberGfx.lineStyle(bandThickness, 0x4a220b, 1);
    this.rubberGfx.beginPath();
    this.rubberGfx.moveTo(this.PRONG_R.x, this.PRONG_R.y);
    this.rubberGfx.lineTo(birdX + 8, birdY);
    this.rubberGfx.stroke();
  }

  clearRubberBands() {
    this.rubberGfx.clear();
    // Rest resting bands connecting prongs
    this.rubberGfx.lineStyle(4, 0x3d1a08, 1);
    this.rubberGfx.beginPath();
    this.rubberGfx.moveTo(this.PRONG_L.x, this.PRONG_L.y);
    this.rubberGfx.lineTo(this.REST_POS.x, this.REST_POS.y);
    this.rubberGfx.lineTo(this.PRONG_R.x, this.PRONG_R.y);
    this.rubberGfx.stroke();
  }

  // --- BIRDS & QUEUE ---
  initBirds() {
    this.birdsQueue = [...this.levelData.birds];
    this.queueSprites = [];

    // Render waiting birds on the ground behind slingshot
    this.updateBirdsQueueDisplay();

    // Load first bird into slingshot
    this.loadNextBird();
  }

  updateBirdsQueueDisplay() {
    // Clear old queue sprites
    if (this.queueSprites) {
      this.queueSprites.forEach(s => s.destroy());
    }
    this.queueSprites = [];

    const groundY = 580;
    this.birdsQueue.forEach((bType, idx) => {
      const qx = 135 - idx * 45;
      const qSprite = this.add.image(qx, groundY, `bird_${bType}`).setScale(0.85).setDepth(4);

      // Cute idle blinking & hop animation
      this.time.addEvent({
        delay: Phaser.Math.Between(2500, 5000),
        loop: true,
        callback: () => {
          if (!qSprite.active) return;
          qSprite.setTexture(`bird_${bType}_blink`);
          this.time.delayedCall(160, () => {
            if (qSprite.active) qSprite.setTexture(`bird_${bType}`);
          });
        }
      });

      this.queueSprites.push(qSprite);
    });
  }

  loadNextBird() {
    if (this.birdsQueue.length === 0) {
      this.activeBird = null;
      return;
    }

    const bType = this.birdsQueue.shift();
    this.updateBirdsQueueDisplay();

    // Create bird visual sprite at queue start, then tween-hop into slingshot pouch
    const startX = 135;
    const startY = 580;
    const birdSpr = this.add.image(startX, startY, `bird_${bType}`).setDepth(6);

    // Update ability hint banner
    this.updateAbilityHint(bType);

    // Hop into slingshot animation
    this.tweens.add({
      targets: birdSpr,
      x: this.REST_POS.x,
      y: this.REST_POS.y,
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.activeBird = birdSpr;
        this.activeBird.birdType = bType;
        this.activeBird.isLaunched = false;
        this.activeBird.abilityUsed = false;
        this.activeBird.hasCollided = false;
        this.gameState = 'READY';
        this.drawRubberBands(this.REST_POS.x, this.REST_POS.y);
      }
    });
  }

  // --- TRAJECTORY PREDICTION ---
  updateTrajectory(pullVec) {
    const vx = pullVec.x * this.LAUNCH_SPEED;
    const vy = pullVec.y * this.LAUNCH_SPEED;
    const startX = this.activeBird.x;
    const startY = this.activeBird.y;

    // Simulation steps
    const simSteps = 24;
    const dt = 1.6;
    const grav = 0.32; // Calibrated for Matter.js gravity

    let simX = startX;
    let simY = startY;
    let simVx = vx;
    let simVy = vy;

    for (let i = 0; i < simSteps; i++) {
      simX += simVx * dt;
      simY += simVy * dt + 0.5 * grav * dt * dt;
      simVy += grav * dt;

      const dot = this.trajectoryDots[i];
      if (dot) {
        dot.setPosition(simX, simY);
        dot.setVisible(true);
        dot.setAlpha(Math.max(0.1, 1 - (i / simSteps) * 0.9));
      }
    }
  }

  hideTrajectory() {
    this.trajectoryDots.forEach(dot => dot.setVisible(false));
  }

  savePastTrajectory() {
    // Clear old past dots
    this.pastTrajectoryDots.forEach(d => d.destroy());
    this.pastTrajectoryDots = [];

    // Copy current trajectory dots as faint guides
    for (let i = 0; i < this.trajectoryDots.length; i += 2) {
      const dot = this.trajectoryDots[i];
      if (dot && dot.visible) {
        const pDot = this.add.image(dot.x, dot.y, 'past_trajectory_dot').setDepth(3).setAlpha(0.35);
        this.pastTrajectoryDots.push(pDot);
      }
    }
  }

  // --- INPUT & CONTROLS ---
  setupInput() {
    this.dragStartPos = null;
    this.isDraggingSlingshot = false;
    this.lastStretchSoundTime = 0;

    // Pointer Down
    this.input.on('pointerdown', (pointer) => {
      if (this.isPaused || this.isLevelOver) return;

      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

      // Fast-forward skip on click during settling phase or after bird impact
      if (this.gameState === 'SETTLING' || (this.gameState === 'FLIGHT' && this.activeBird && this.activeBird.customData && this.activeBird.customData.hasCollided)) {
        this.resolveTurn();
        return;
      }

      // Check if clicking near bird in slingshot to aim (large, forgiving grab radius)
      if (this.gameState === 'READY' && this.activeBird) {
        const dist = Phaser.Math.Distance.Between(worldPoint.x, worldPoint.y, this.activeBird.x, this.activeBird.y);
        const nearSlingshot = (worldPoint.x >= 100 && worldPoint.x <= 340 && worldPoint.y >= 350 && worldPoint.y <= 620);
        if (dist < 110 || nearSlingshot) {
          this.isDraggingSlingshot = true;
          this.gameState = 'AIMING';
          return;
        }
      }

      // Check for mid-flight special ability activation
      if (this.gameState === 'FLIGHT' && this.activeBird && !this.activeBird.abilityUsed) {
        this.triggerSpecialAbility();
        return;
      }

      // Otherwise: Camera manual drag start (restricted to clicks safely away from slingshot)
      if (worldPoint.x > 380) {
        this.dragStartPos = { x: pointer.x, y: pointer.y, camX: this.cameras.main.scrollX };
      }
    });

    // Pointer Move
    this.input.on('pointermove', (pointer) => {
      if (this.isPaused || this.isLevelOver) return;

      if (this.isDraggingSlingshot && this.activeBird) {
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

        let dx = worldPoint.x - this.REST_POS.x;
        let dy = worldPoint.y - this.REST_POS.y;

        // Clamp forward pulling: cannot drag bird forward past rest position
        if (dx > 15) dx = 15;

        // Limit drag radius
        const dist = Math.hypot(dx, dy);
        if (dist > this.MAX_PULL) {
          const angle = Math.atan2(dy, dx);
          dx = Math.cos(angle) * this.MAX_PULL;
          dy = Math.sin(angle) * this.MAX_PULL;
        }

        const birdX = this.REST_POS.x + dx;
        const birdY = this.REST_POS.y + dy;

        this.activeBird.setPosition(birdX, birdY);
        this.drawRubberBands(birdX, birdY);

        // Calculate launch vector
        const pullVec = {
          x: this.REST_POS.x - birdX,
          y: this.REST_POS.y - birdY
        };

        this.updateTrajectory(pullVec);

        // Sound effect for stretching elastic
        const now = this.time.now;
        if (now - this.lastStretchSoundTime > 160 && dist > 20) {
          window.audioManager.playSlingshotStretch(dist / this.MAX_PULL);
          this.lastStretchSoundTime = now;
        }
      } else if (this.dragStartPos && pointer.isDown && this.gameState !== 'AIMING' && !this.isDraggingSlingshot) {
        // Camera manual panning
        const dragDist = this.dragStartPos.x - pointer.x;
        this.cameras.main.scrollX = Phaser.Math.Clamp(this.dragStartPos.camX + dragDist, 0, 700);
      }
    });

    // Pointer Up (Launch!)
    this.input.on('pointerup', (pointer) => {
      if (this.isDraggingSlingshot && this.activeBird) {
        this.isDraggingSlingshot = false;

        const dist = Phaser.Math.Distance.Between(this.REST_POS.x, this.REST_POS.y, this.activeBird.x, this.activeBird.y);

        if (dist < 20) {
          // Cancel shot: Return bird smoothly to rest
          this.tweens.add({
            targets: this.activeBird,
            x: this.REST_POS.x,
            y: this.REST_POS.y,
            duration: 200,
            ease: 'Quad.easeOut',
            onUpdate: () => {
              this.drawRubberBands(this.activeBird.x, this.activeBird.y);
            },
            onComplete: () => {
              this.gameState = 'READY';
              this.clearRubberBands();
            }
          });
          this.hideTrajectory();
        } else {
          // Fire projectile!
          this.launchActiveBird();
        }
      }
      this.isDraggingSlingshot = false;
      this.dragStartPos = null;
    });

    // Keyboard Shortcuts
    this.input.keyboard.on('keydown-R', () => {
      window.audioManager.playButtonClick();
      this.scene.restart();
    });

    this.input.keyboard.on('keydown-P', () => {
      this.togglePause();
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.gameState === 'FLIGHT') {
        this.triggerSpecialAbility();
      } else {
        this.togglePause();
      }
    });

    this.input.keyboard.on('keydown-M', () => {
      this.toggleSound();
    });

    this.input.keyboard.on('keydown-ESC', () => {
      window.audioManager.playButtonClick();
      this.scene.start('LevelSelectScene');
    });
  }

  launchActiveBird() {
    this.savePastTrajectory();
    this.hideTrajectory();
    this.clearRubberBands();

    const birdSpr = this.activeBird;
    const bType = birdSpr.birdType;

    const pullX = this.REST_POS.x - birdSpr.x;
    const pullY = this.REST_POS.y - birdSpr.y;
    const vx = pullX * this.LAUNCH_SPEED;
    const vy = pullY * this.LAUNCH_SPEED;

    // Convert sprite into dynamic Matter physics body
    let radius = 20;
    let density = 0.004;
    let restitution = 0.35;

    if (bType === 'yellow') {
      radius = 18; density = 0.003; restitution = 0.25;
    } else if (bType === 'blue') {
      radius = 14; density = 0.002; restitution = 0.3;
    }

    const birdBody = this.matter.add.gameObject(birdSpr, {
      shape: { type: 'circle', radius: radius },
      density: density,
      friction: 0.5,
      frictionStatic: 0.7,
      restitution: restitution
    });

    birdBody.setDepth(6);
    birdBody.customData = {
      isBird: true,
      birdType: bType,
      abilityUsed: false,
      hasCollided: false,
      launchTime: this.time.now
    };

    // Apply launch velocity
    birdBody.setVelocity(vx, vy);
    birdBody.setAngularVelocity(Phaser.Math.FloatBetween(-0.04, 0.04));

    // Sounds & FX
    window.audioManager.playSlingshotRelease();
    window.audioManager.playBirdLaunch(bType);
    this.spawnLaunchDust(this.REST_POS.x, this.REST_POS.y);

    if (window.AchievementTracker) {
      window.AchievementTracker.recordStat('birdsLaunched', 1);
    }

    birdSpr.isLaunched = true;
    this.gameState = 'FLIGHT';
    this.flightTimer = 0;

    // Camera follow bird smoothly
    this.cameras.main.startFollow(birdSpr, false, 0.08, 0.08, -120, 0);
  }

  // --- SPECIAL BIRD ABILITIES ---
  triggerSpecialAbility() {
    const bird = this.activeBird;
    if (!bird || bird.abilityUsed || !bird.body) return;

    bird.abilityUsed = true;
    bird.customData.abilityUsed = true;
    const bType = bird.birdType;

    window.audioManager.playBirdAbility(bType);

    if (bType === 'yellow') {
      // Chuck's Turbo Speed Boost!
      const curVel = bird.body.velocity;
      const angle = Math.atan2(curVel.y, curVel.x);
      const speed = Math.max(Math.hypot(curVel.x, curVel.y) * 2.3, 30);

      bird.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed * 0.75
      );

      // Yellow speed streak visual effect
      this.spawnSpeedStreak(bird.x, bird.y);
      this.showPopScoreText(bird.x, bird.y - 30, 'SPEED BOOST!', '#facc15');

    } else if (bType === 'blue') {
      // The Blues: Split into 3 Birds!
      const curVel = bird.body.velocity;
      const curX = bird.x;
      const curY = bird.y;

      // Spawn Blue Feather Burst
      this.spawnFeatherBurst(curX, curY, 'blue');
      this.showPopScoreText(curX, curY - 30, 'SPLIT!', '#38bdf8');

      // Top clone (-14 degrees)
      const clone1 = this.createBlueClone(curX, curY - 18, curVel.x * 1.05, curVel.y - 2.8);
      // Bottom clone (+14 degrees)
      const clone2 = this.createBlueClone(curX, curY + 18, curVel.x * 1.05, curVel.y + 2.8);

      this.activeBirdClones.push(clone1, clone2);

    } else if (bType === 'red') {
      // Red Bird War Cry & Heavy Dive
      const curVel = bird.body.velocity;
      bird.setVelocity(curVel.x * 1.25, curVel.y + 4.5);
      this.spawnFeatherBurst(bird.x, bird.y, 'red');
      this.showPopScoreText(bird.x, bird.y - 30, 'BATTLE CRY!', '#ef4444');
    }
  }

  createBlueClone(x, y, vx, vy) {
    const cloneSpr = this.matter.add.sprite(x, y, 'bird_blue', null, {
      shape: { type: 'circle', radius: 14 },
      density: 0.002,
      friction: 0.5,
      restitution: 0.3
    });
    cloneSpr.setDepth(6);
    cloneSpr.customData = {
      isBird: true,
      birdType: 'blue',
      isClone: true,
      abilityUsed: true,
      hasCollided: false
    };
    cloneSpr.setVelocity(vx, vy);
    return cloneSpr;
  }

  // --- COLLISIONS & DESTRUCTION ---
  setupCollisions() {
    this.matter.world.on('collisionstart', (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        this.handleCollisionPair(pairs[i].bodyA, pairs[i].bodyB);
      }
    });
  }

  handleCollisionPair(bodyA, bodyB) {
    if (!bodyA || !bodyB || !bodyA.velocity || !bodyB.velocity) return;

    const objA = bodyA.gameObject;
    const objB = bodyB.gameObject;

    // Check if one is bird
    const birdObj = (objA && objA.customData && objA.customData.isBird) ? objA :
                    (objB && objB.customData && objB.customData.isBird) ? objB : null;

    const targetObj = (birdObj === objA) ? objB : (birdObj === objB) ? objA : null;

    // Calculate relative velocity
    const vxRel = bodyA.velocity.x - bodyB.velocity.x;
    const vyRel = bodyA.velocity.y - bodyB.velocity.y;
    const relSpeed = Math.hypot(vxRel, vyRel);

    // 1. Bird hitting target
    if (birdObj && targetObj && targetObj.customData && targetObj.active && targetObj.body) {
      birdObj.customData.hasCollided = true;
      let damage = relSpeed * 8.5;

      const targetX = targetObj.body ? targetObj.body.position.x : 0;
      const targetY = targetObj.body ? targetObj.body.position.y : 0;
      const bType = birdObj.customData.birdType;
      const mat = targetObj.customData.material || 'wood';

      if (bType === 'yellow' && mat === 'wood') {
        damage *= 2.6; // Yellow slices wood!
      } else if (bType === 'blue' && mat === 'glass') {
        damage *= 3.2; // Blue shatters glass!
      } else if (bType === 'red' && mat === 'stone') {
        damage *= 1.4; // Red smashes stone!
      }

      window.audioManager.playCollision(mat, relSpeed / 12);
      this.spawnDebris(targetX, targetY, mat, 4);
      this.applyDamage(targetObj, damage, mat);
    }

    // 2. Falling block / structural collisions
    if (!birdObj && objA && objB && objA.customData && objB.customData && objA.active && objB.active) {
      if (relSpeed > 2.2) {
        const damageA = relSpeed * 4.5;
        const damageB = relSpeed * 4.5;

        const matA = objA.customData.material || 'wood';
        const matB = objB.customData.material || 'wood';
        const mat = matA || matB || 'wood';
        window.audioManager.playCollision(mat, relSpeed / 14);

        if (objA.active && objA.body) {
          this.applyDamage(objA, damageA, matA);
        }
        if (objB.active && objB.body) {
          this.applyDamage(objB, damageB, matB);
        }
      }
    }
  }

  applyDamage(obj, damage, material) {
    if (!obj || !obj.active || !obj.body || !obj.customData || obj.customData.destroyed || obj.customData.dead) return;

    obj.customData.hp -= damage;

    // A. Destructible Block
    if (obj.customData.isBlock) {
      const hpPct = obj.customData.hp / obj.customData.maxHp;

      // Visual Cracks
      if (hpPct <= 0.35) {
        obj.setTint(0xffb0b0);
      } else if (hpPct <= 0.65) {
        obj.setTint(0xffdcdc);
      }

      // Destruction
      if (obj.customData.hp <= 0) {
        this.destroyBlock(obj);
      }
    }

    // B. Pig
    if (obj.customData.isPig) {
      if (damage > 6) {
        window.audioManager.playPigHurt();
        obj.setTexture('pig_hurt');
      }

      if (obj.customData.hp <= 0) {
        this.defeatPig(obj);
      }
    }
  }

  destroyBlock(block) {
    if (!block || !block.active || !block.body || block.customData.destroyed) return;
    block.customData.destroyed = true;

    const bx = block.body ? block.body.position.x : 0;
    const by = block.body ? block.body.position.y : 0;
    const mat = block.customData.material || 'wood';
    const isTnt = block.customData.isTnt;

    // Score
    this.addScore(500);
    this.showPopScoreText(bx, by, '+500', '#facc15');

    if (window.AchievementTracker) {
      window.AchievementTracker.recordStat(mat === 'glass' ? 'glassDestroyed' : 'blocksDestroyed', 1);
    }

    // SFX & Particles
    window.audioManager.playDestroy(mat);
    this.spawnDebris(bx, by, mat, 8);

    // Safely remove from Matter world
    this.blocks = this.blocks.filter(b => b !== block);
    if (block.body) {
      this.matter.world.remove(block.body);
    }
    block.destroy();

    // TNT Explosion
    if (isTnt) {
      this.triggerTntExplosion(bx, by);
    }
  }

  triggerTntExplosion(x, y) {
    window.audioManager.playExplosion();
    this.cameras.main.shake(300, 0.015);
    this.spawnExplosionFX(x, y);

    if (window.AchievementTracker) {
      window.AchievementTracker.recordStat('tntDetonated', 1);
    }

    const radius = 180;
    const impulseStrength = 0.08;

    // Affect all nearby physics bodies
    const allBodies = this.matter.world.getAllBodies ? this.matter.world.getAllBodies() : this.matter.world.localWorld.bodies;
    const bodiesCopy = [...allBodies];
    bodiesCopy.forEach(body => {
      if (!body || body.isStatic || !body.position) return;

      const dist = Phaser.Math.Distance.Between(x, y, body.position.x, body.position.y);
      if (dist < radius && dist > 1) {
        const force = (1 - dist / radius) * impulseStrength;
        const angle = Math.atan2(body.position.y - y, body.position.x - x);

        this.MatterBody.applyForce(body, body.position, {
          x: Math.cos(angle) * force,
          y: Math.sin(angle) * force - 0.02
        });

        // Deal massive explosion damage
        if (body.gameObject && body.gameObject.active && body.gameObject.body && body.gameObject.customData) {
          const dmg = (1 - dist / radius) * 140;
          this.applyDamage(body.gameObject, dmg, body.gameObject.customData.material || 'stone');
        }
      }
    });
  }

  defeatPig(pig) {
    if (!pig || !pig.active || !pig.body || pig.customData.dead) return;
    pig.customData.dead = true;

    const px = pig.body ? pig.body.position.x : 0;
    const py = pig.body ? pig.body.position.y : 0;

    // Score: 5000 points!
    this.addScore(5000);
    this.showPopScoreText(px, py, '+5000 🐷', '#4ade80');

    if (window.AchievementTracker) {
      window.AchievementTracker.recordStat('pigsDefeated', 1);
      if (pig.customData && pig.customData.pigType === 'king') {
        window.AchievementTracker.unlock('citadel_conqueror');
      }
    }

    // Sound & Cartoon Poof
    window.audioManager.playPigDefeated();
    this.spawnPigPoofFX(px, py);

    // Remove from world
    this.pigs = this.pigs.filter(p => p !== pig);
    if (pig.body) {
      this.matter.world.remove(pig.body);
    }
    pig.destroy();

    // Check instant victory if all pigs defeated!
    if (this.pigs.length === 0 && !this.isLevelOver) {
      this.time.delayedCall(800, () => {
        this.handleLevelVictory();
      });
    }
  }

  // --- SETTLE & TURN RESOLUTION ---
  update(time, delta) {
    // Drifting clouds
    if (this.clouds) {
      this.clouds.forEach(c => {
        c.x += c.speed;
        if (c.x > 1450) c.x = -100;
      });
    }

    // Smooth rolling score
    if (this.displayScore < this.score) {
      this.displayScore = Math.min(this.score, this.displayScore + Math.ceil((this.score - this.displayScore) * 0.1));
      if (this.scoreText) this.scoreText.setText(`${this.displayScore}`);
    }

    // Monitor Active Bird in Flight
    if (this.gameState === 'FLIGHT' && this.activeBird && this.activeBird.active && this.activeBird.body && this.activeBird.body.position) {
      this.flightTimer += delta;

      const vel = this.activeBird.body.velocity;
      const speed = vel ? Math.hypot(vel.x, vel.y) : 0;
      const bx = this.activeBird.body.position.x;
      const by = this.activeBird.body.position.y;

      // Check bounds or stopped
      const isOutOfBounds = bx > 1420 || by > 720 || bx < -60;
      const hasStopped = this.activeBird.customData.hasCollided && (speed < 0.65 || (this.flightTimer > 2000 && speed < 1.4));
      const timeout = this.flightTimer > 4500;

      if (isOutOfBounds || hasStopped || timeout) {
        this.gameState = 'SETTLING';
        this.settleTimer = 0;
      }
    }

    // Settling Phase: Wait until blocks stabilize or timeout
    if (this.gameState === 'SETTLING') {
      this.settleTimer += delta;

      let maxWorldSpeed = 0;
      const bodies = this.matter.world.getAllBodies ? this.matter.world.getAllBodies() : this.matter.world.localWorld.bodies;
      bodies.forEach(b => {
        if (!b.isStatic && b.velocity && !b.isSleeping) {
          const spd = Math.hypot(b.velocity.x, b.velocity.y);
          if (spd > maxWorldSpeed) maxWorldSpeed = spd;
        }
      });

      const isSettled = maxWorldSpeed < 0.65 && this.settleTimer > 350;
      const settleTimeout = this.settleTimer > 1600;

      if (isSettled || settleTimeout) {
        this.gameState = 'RESOLVED';
        this.resolveTurn();
      }
    }
  }

  resolveTurn() {
    if (this.isLevelOver) return;

    // Check 1: Are all pigs dead?
    if (this.pigs.length === 0) {
      this.handleLevelVictory();
      return;
    }

    // Check 2: Are there more birds in queue?
    if (this.birdsQueue.length > 0) {
      // Clean up previous active bird
      if (this.activeBird) {
        if (this.activeBird.body) {
          this.matter.world.remove(this.activeBird.body);
        }
        this.activeBird.destroy();
        this.activeBird = null;
      }
      this.activeBirdClones.forEach(c => {
        if (c.active) {
          if (c.body) {
            this.matter.world.remove(c.body);
          }
          c.destroy();
        }
      });
      this.activeBirdClones = [];

      // Camera pan back to slingshot (snappy 380ms)
      this.cameras.main.stopFollow();
      this.tweens.add({
        targets: this.cameras.main,
        scrollX: 0,
        duration: 380,
        ease: 'Quad.easeInOut',
        onComplete: () => {
          this.loadNextBird();
        }
      });
    } else {
      // Out of birds and pigs remain -> Level Failed!
      this.handleLevelFailed();
    }
  }

  handleLevelVictory() {
    if (this.isLevelOver) return;
    this.isLevelOver = true;

    // Bird bonus: 10,000 points per unused bird!
    const unusedBirdsCount = this.birdsQueue.length + (this.activeBird && !this.activeBird.isLaunched ? 1 : 0);
    const birdBonus = unusedBirdsCount * 10000;
    this.addScore(birdBonus);

    // Calculate Stars
    const thresholds = this.levelData.starThresholds;
    let starsEarned = 1;
    if (this.score >= thresholds[2]) starsEarned = 3;
    else if (this.score >= thresholds[1]) starsEarned = 2;

    // Save Progress
    LevelProgress.setLevelStars(this.levelId, starsEarned);
    LevelProgress.setHighScore(this.levelId, this.score);
    if (this.levelId < GAME_LEVELS.length) {
      LevelProgress.setUnlockedLevel(this.levelId + 1);
    }

    // Sound & Event Trigger
    window.audioManager.playWinFanfare();

    if (starsEarned === 3 && window.AchievementTracker) {
      window.AchievementTracker.unlock('three_stars');
    }

    try {
      window.dispatchEvent(new CustomEvent('angry_birds_victory', {
        detail: { levelId: this.levelId, score: this.score, stars: starsEarned }
      }));
    } catch (e) {}

    // Show Victory Dialog
    this.showVictoryModal(starsEarned, birdBonus, unusedBirdsCount);
  }

  handleLevelFailed() {
    if (this.isLevelOver) return;
    this.isLevelOver = true;

    window.audioManager.playLoseFanfare();
    this.showGameOverModal();
  }

  // --- PARTICLES & VISUAL FX ---
  spawnLaunchDust(x, y) {
    for (let i = 0; i < 8; i++) {
      const p = this.add.image(x, y, 'particle_smoke').setDepth(8);
      const angle = Phaser.Math.FloatBetween(Math.PI * 0.7, Math.PI * 1.3);
      const speed = Phaser.Math.FloatBetween(40, 100);

      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 1.8,
        duration: 400,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  spawnSpeedStreak(x, y) {
    for (let i = 0; i < 14; i++) {
      const p = this.add.image(x - i * 8, y + Phaser.Math.Between(-8, 8), 'particle_feather_yellow').setDepth(8);
      this.tweens.add({
        targets: p,
        alpha: 0,
        scale: 0.2,
        duration: 350,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  spawnFeatherBurst(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const p = this.add.image(x, y, `particle_feather_${color}`).setDepth(8);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.FloatBetween(30, 80);

      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        rotation: Phaser.Math.FloatBetween(-2, 2),
        duration: 500,
        ease: 'Cubic.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  spawnDebris(x, y, material, count = 6) {
    let key = 'particle_wood';
    if (material.includes('glass')) key = 'particle_glass';
    else if (material.includes('stone')) key = 'particle_stone';

    for (let i = 0; i < count; i++) {
      const p = this.add.image(x, y, key).setDepth(8);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const speed = Phaser.Math.FloatBetween(40, 120);

      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed + 20,
        alpha: 0,
        rotation: Phaser.Math.FloatBetween(-3, 3),
        duration: 450,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  spawnPigPoofFX(x, y) {
    // Cloud smoke puff
    for (let i = 0; i < 10; i++) {
      const p = this.add.image(x, y, 'particle_smoke').setDepth(9).setScale(1.2);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.FloatBetween(20, 60);

      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 2.2,
        duration: 550,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy()
      });
    }

    // Golden stars burst
    for (let i = 0; i < 6; i++) {
      const star = this.add.image(x, y, 'particle_star').setDepth(10).setScale(0.8);
      const angle = (i / 6) * Math.PI * 2;
      const dist = Phaser.Math.FloatBetween(40, 90);

      this.tweens.add({
        targets: star,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.2,
        duration: 650,
        ease: 'Cubic.easeOut',
        onComplete: () => star.destroy()
      });
    }
  }

  spawnExplosionFX(x, y) {
    // Fire & Smoke blast
    for (let i = 0; i < 16; i++) {
      const p = this.add.image(x, y, 'particle_smoke').setDepth(10).setScale(1.6);
      p.setTint(i % 2 === 0 ? 0xef4444 : 0xfacc15);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.FloatBetween(40, 140);

      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 3.0,
        duration: 600,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  showPopScoreText(x, y, text, color = '#facc15') {
    const txt = this.add.text(x, y, text, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '22px',
      color: color,
      stroke: '#0f172a',
      strokeThickness: 5
    }).setOrigin(0.5).setDepth(12);

    this.tweens.add({
      targets: txt,
      y: y - 45,
      alpha: 0,
      scale: 1.2,
      duration: 850,
      ease: 'Quad.easeOut',
      onComplete: () => txt.destroy()
    });
  }

  addScore(points) {
    this.score += points;
  }

  // --- HUD & UI OVERLAYS ---
  createHUD() {
    const { width } = this.scale;

    this.hudContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(20);

    // Top Header Banner
    const bannerBg = this.add.rectangle(width / 2, 34, width - 40, 52, 0x0f172a, 0.75)
      .setStrokeStyle(2, 0x334155);

    // Level Title
    const lvlText = this.add.text(40, 34, `Level ${this.levelId}: ${this.levelData.name}`, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0, 0.5);

    // Score Display
    const scoreTitle = this.add.text(width / 2 - 40, 34, 'SCORE:', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '16px',
      color: '#94a3b8'
    }).setOrigin(1, 0.5);

    this.scoreText = this.add.text(width / 2 - 25, 34, '0', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '26px',
      color: '#facc15'
    }).setOrigin(0, 0.5);

    // High Score Badge
    const high = LevelProgress.getHighScore(this.levelId);
    this.highScoreText = this.add.text(width / 2 + 130, 34, `BEST: ${high}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#38bdf8'
    }).setOrigin(0, 0.5);

    // HUD Action Buttons (Right)
    const btnX = width - 50;

    // 1. Pause Button
    const pauseBtn = this.createHUDIconButton(btnX - 110, 34, '⏸', () => this.togglePause());

    // 2. Restart Button
    const restartBtn = this.createHUDIconButton(btnX - 55, 34, '🔄', () => {
      window.audioManager.playButtonClick();
      this.scene.restart();
    });

    // 3. Sound Button
    const soundBtn = this.createHUDIconButton(btnX, 34, window.audioManager.isMuted ? '🔇' : '🔊', () => {
      this.toggleSound();
    });
    this.hudSoundIcon = soundBtn.iconText;

    this.hudContainer.add([bannerBg, lvlText, scoreTitle, this.scoreText, this.highScoreText, pauseBtn, restartBtn, soundBtn]);

    // Hint Banner (Bottom-Center)
    this.hintContainer = this.add.container(width / 2, 75).setScrollFactor(0).setDepth(15);
    const hintBg = this.add.rectangle(0, 0, 520, 30, 0x1e293b, 0.85).setStrokeStyle(1.5, 0x38bdf8);
    this.hintText = this.add.text(0, 0, this.levelData.hint, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#f8fafc'
    }).setOrigin(0.5);
    this.hintContainer.add([hintBg, this.hintText]);
  }

  updateAbilityHint(birdType) {
    if (!this.hintText || !this.hintText.active) return;
    try {
      if (birdType === 'yellow') {
        this.hintText.setText('🟡 Yellow Bird: Tap in flight to activate TURBO SPEED BOOST!');
      } else if (birdType === 'blue') {
        this.hintText.setText('🔵 Blue Bird: Tap in flight to SPLIT INTO 3 BIRDS (Great vs Glass!)');
      } else {
        this.hintText.setText('🔴 Red Bird: High mass projectile with heavy knockback!');
      }
    } catch (e) {}
  }

  createHUDIconButton(x, y, iconChar, callback) {
    const container = this.add.container(x, y);
    const bg = this.add.circle(0, 0, 18, 0x1e293b).setStrokeStyle(2, 0x64748b);
    const iconText = this.add.text(0, 0, iconChar, { fontSize: '18px' }).setOrigin(0.5);

    container.add([bg, iconText]);
    container.setSize(36, 36);
    container.setInteractive(new Phaser.Geom.Circle(0, 0, 18), Phaser.Geom.Circle.Contains);
    bg.setInteractive({ useHandCursor: true });

    container.on('pointerdown', callback);
    bg.on('pointerdown', callback);
    container.iconText = iconText;
    return container;
  }

  toggleSound() {
    const isMuted = window.audioManager.toggleMute();
    if (this.hudSoundIcon) {
      this.hudSoundIcon.setText(isMuted ? '🔇' : '🔊');
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    window.audioManager.playButtonClick();

    if (this.isPaused) {
      this.matter.world.pause();
      this.showPauseModal();
    } else {
      this.matter.world.resume();
      if (this.pauseModal) {
        this.pauseModal.destroy();
        this.pauseModal = null;
      }
    }
  }

  showPauseModal() {
    const { width, height } = this.scale;
    this.pauseModal = this.add.container(width / 2, height / 2).setScrollFactor(0).setDepth(100);

    const dim = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setInteractive();
    const card = this.add.rectangle(0, 0, 420, 360, 0x0f172a, 0.95).setStrokeStyle(4, 0x38bdf8);

    const title = this.add.text(0, -130, 'GAME PAUSED', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Resume Button
    const resumeBtn = this.createModalButton(0, -40, 'RESUME', 0x22c55e, 0x15803d, () => {
      this.togglePause();
    });

    // Restart Button
    const restartBtn = this.createModalButton(0, 30, 'RESTART LEVEL', 0x3b82f6, 0x1d4ed8, () => {
      window.audioManager.playButtonClick();
      this.scene.restart();
    });

    // Level Select Button
    const selectBtn = this.createModalButton(0, 100, 'LEVEL SELECT', 0x64748b, 0x334155, () => {
      window.audioManager.playButtonClick();
      this.scene.start('LevelSelectScene');
    });

    this.pauseModal.add([dim, card, title, resumeBtn, restartBtn, selectBtn]);
  }

  showVictoryModal(stars, birdBonus, unusedCount) {
    const { width, height } = this.scale;
    const modal = this.add.container(width / 2, height / 2).setScrollFactor(0).setDepth(100);

    const dim = this.add.rectangle(0, 0, width, height, 0x000000, 0.75).setInteractive();
    const card = this.add.rectangle(0, 0, 560, 460, 0x0f172a, 0.96).setStrokeStyle(4, 0xfacc15);

    const title = this.add.text(0, -180, 'LEVEL CLEARED!', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '34px',
      color: '#facc15',
      stroke: '#713f12',
      strokeThickness: 6
    }).setOrigin(0.5);

    // 3 Golden Stars Container
    const starsContainer = this.add.container(0, -100);
    for (let s = 0; s < 3; s++) {
      const starSlot = this.add.image(-80 + s * 80, 0, 'ui_star_empty').setScale(0.9);
      starsContainer.add(starSlot);

      if (s < stars) {
        // Sequential star reveal animation with chime
        this.time.delayedCall(400 + s * 350, () => {
          starSlot.setTexture('ui_star_filled');
          window.audioManager.playStarPop(s);
          this.tweens.add({
            targets: starSlot,
            scale: 1.25,
            duration: 160,
            yoyo: true,
            ease: 'Back.easeOut'
          });
        });
      }
    }

    // Score Details
    const scoreInfo = [
      `Level Score: ${this.score - birdBonus}`,
      `Unused Birds Bonus (${unusedCount}x): +${birdBonus}`,
      `TOTAL SCORE: ${this.score}`
    ];

    const scoreTxt = this.add.text(0, -5, scoreInfo.join('\n'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '18px',
      color: '#f8fafc',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5);

    // Buttons Container
    const hasNext = this.levelId < GAME_LEVELS.length;

    // Next Level / Play Again
    const nextBtn = this.createModalButton(hasNext ? 120 : 0, 140, hasNext ? 'NEXT LEVEL ➡' : 'PLAY AGAIN', 0x22c55e, 0x15803d, () => {
      window.audioManager.playButtonClick();
      const nextLvl = hasNext ? this.levelId + 1 : 1;
      this.scene.start('GameScene', { levelId: nextLvl });
    }, 200, 48);

    // Replay Button
    const replayBtn = this.createModalButton(hasNext ? -120 : -130, 140, '🔄 REPLAY', 0x3b82f6, 0x1d4ed8, () => {
      window.audioManager.playButtonClick();
      this.scene.restart();
    }, 180, 48);

    // Level Select (Small Button)
    const selectBtn = this.createModalButton(0, 195, 'LEVEL SELECT', 0x475569, 0x1e293b, () => {
      window.audioManager.playButtonClick();
      this.scene.start('LevelSelectScene');
    }, 180, 38);

    modal.add([dim, card, title, starsContainer, scoreTxt, nextBtn, replayBtn, selectBtn]);
  }

  showGameOverModal() {
    const { width, height } = this.scale;
    const modal = this.add.container(width / 2, height / 2).setScrollFactor(0).setDepth(100);

    const dim = this.add.rectangle(0, 0, width, height, 0x000000, 0.75).setInteractive();
    const card = this.add.rectangle(0, 0, 500, 420, 0x0f172a, 0.96).setStrokeStyle(4, 0xef4444);

    const title = this.add.text(0, -150, 'LEVEL FAILED!', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '32px',
      color: '#ef4444',
      stroke: '#450a0a',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Sad Hurt Pig
    const sadPig = this.add.image(0, -70, 'pig_hurt').setScale(1.3);

    const desc = this.add.text(0, 15, "Out of birds! The pigs survived.\nDon't give up!", {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#cbd5e1',
      align: 'center',
      lineSpacing: 5
    }).setOrigin(0.5);

    const finalScore = this.add.text(0, 75, `Score: ${this.score}`, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '22px',
      color: '#facc15'
    }).setOrigin(0.5);

    // Retry Button
    const retryBtn = this.createModalButton(-100, 145, '🔄 RETRY', 0x22c55e, 0x15803d, () => {
      window.audioManager.playButtonClick();
      this.scene.restart();
    }, 170, 48);

    // Level Select Button
    const selectBtn = this.createModalButton(100, 145, 'LEVEL SELECT', 0x64748b, 0x334155, () => {
      window.audioManager.playButtonClick();
      this.scene.start('LevelSelectScene');
    }, 170, 48);

    modal.add([dim, card, title, sadPig, desc, finalScore, retryBtn, selectBtn]);
  }

  createModalButton(x, y, text, bgCol, borderCol, callback, width = 200, height = 48) {
    const container = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, width, height, bgCol).setStrokeStyle(3, borderCol);
    const label = this.add.text(0, 0, text, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);

    container.add([bg, label]);
    container.setSize(width, height);
    container.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
    bg.setInteractive({ useHandCursor: true });

    const handleOver = () => {
      this.tweens.add({ targets: container, scaleX: 1.06, scaleY: 1.06, duration: 100 });
    };
    const handleOut = () => {
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 100 });
    };
    const handleDown = () => {
      this.tweens.add({
        targets: container,
        scaleX: 0.94,
        scaleY: 0.94,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          callback();
        }
      });
    };

    container.on('pointerover', handleOver);
    container.on('pointerout', handleOut);
    container.on('pointerdown', handleDown);
    bg.on('pointerdown', handleDown);

    return container;
  }

  runIntroCamera() {
    // Smooth cinematic intro pan across fortress, then pan back to slingshot
    this.cameras.main.scrollX = 420;
    this.tweens.add({
      targets: this.cameras.main,
      scrollX: 0,
      duration: 1200,
      ease: 'Cubic.easeInOut'
    });
  }
}

if (typeof window !== 'undefined') { window.GameScene = GameScene; }
