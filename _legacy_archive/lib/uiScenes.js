/**
 * UIScenes: BootScene, MenuScene, and LevelSelectScene.
 */

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    // Generate all procedural canvas textures
    TextureGenerator.generateAll(this);
    // Transition to MenuScene
    this.scene.start('MenuScene');
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.scale;

    // Background Sky & Scenery
    this.add.image(width / 2, height / 2, 'bg_sky').setDisplaySize(width, height);

    // Drifting clouds
    this.clouds = [];
    for (let i = 0; i < 4; i++) {
      const cloud = this.add.image(
        Phaser.Math.Between(50, width - 50),
        Phaser.Math.Between(40, 220),
        'bg_cloud'
      );
      cloud.setScale(Phaser.Math.FloatBetween(0.8, 1.3));
      cloud.speed = Phaser.Math.FloatBetween(0.3, 0.7);
      this.clouds.push(cloud);
    }

    // Mountains & Hills
    this.add.image(width / 2, height - 200, 'bg_mountains').setDisplaySize(width, 260);
    this.add.image(width / 2, height - 120, 'bg_hills').setDisplaySize(width, 200);
    this.add.image(width / 2, height - 40, 'ground').setDisplaySize(width, 120);

    // Slingshot on the left
    this.add.image(220, height - 140, 'slingshot_base');

    // Idle Bouncing Bird on slingshot
    const redBird = this.add.image(220, height - 170, 'bird_red');
    this.tweens.add({
      targets: redBird,
      y: height - 185,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Idle Pig on the right smiling
    const pig = this.add.image(width - 240, height - 125, 'pig_basic');
    this.tweens.add({
      targets: pig,
      scaleX: 1.08,
      scaleY: 0.92,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Yellow and Blue birds hopping near pig
    const yellowBird = this.add.image(320, height - 90, 'bird_yellow');
    this.tweens.add({
      targets: yellowBird,
      y: height - 110,
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 200
    });

    const blueBird = this.add.image(130, height - 85, 'bird_blue');
    this.tweens.add({
      targets: blueBird,
      y: height - 100,
      duration: 550,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 400
    });

    // Title Logo Container
    const titleContainer = this.add.container(width / 2, 170);

    const titleShadow = this.add.text(4, 4, 'ANGRY BIRDS', {
      fontFamily: 'Arial Black, Impact, sans-serif',
      fontSize: '76px',
      color: '#451a03',
      stroke: '#451a03',
      strokeThickness: 12
    }).setOrigin(0.5);

    const titleText = this.add.text(0, 0, 'ANGRY BIRDS', {
      fontFamily: 'Arial Black, Impact, sans-serif',
      fontSize: '76px',
      color: '#facc15',
      stroke: '#b91c1c',
      strokeThickness: 12
    }).setOrigin(0.5);

    const subtitleText = this.add.text(0, 58, 'PHYSICS DESTRUCTION GAME', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      stroke: '#0f172a',
      strokeThickness: 6
    }).setOrigin(0.5);

    titleContainer.add([titleShadow, titleText, subtitleText]);

    // Bouncing logo animation
    this.tweens.add({
      targets: titleContainer,
      y: 180,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Buttons
    const btnY = 360;
    this.createButton(width / 2, btnY, 'PLAY GAME', '#22c55e', '#15803d', () => {
      window.audioManager.playButtonClick();
      window.audioManager.resume();
      const unlocked = LevelProgress.getUnlockedLevel();
      this.scene.start('GameScene', { levelId: Math.min(unlocked, GAME_LEVELS.length) });
    }, 240, 64);

    this.createButton(width / 2, btnY + 80, 'SELECT LEVEL', '#3b82f6', '#1d4ed8', () => {
      window.audioManager.playButtonClick();
      window.audioManager.resume();
      this.scene.start('LevelSelectScene');
    }, 240, 56);

    this.createButton(width / 2, btnY + 155, 'HOW TO PLAY', '#eab308', '#a16207', () => {
      window.audioManager.playButtonClick();
      window.audioManager.resume();
      this.showHowToPlayModal();
    }, 240, 52);

    // Audio Mute Toggle Button (Top Right)
    this.createSoundButton(width - 55, 45);

    // Initial click on canvas to resume audio
    this.input.once('pointerdown', () => {
      window.audioManager.resume();
    });
  }

  update() {
    // Move drifting clouds
    if (this.clouds) {
      this.clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > this.scale.width + 100) {
          cloud.x = -100;
          cloud.y = Phaser.Math.Between(40, 220);
        }
      });
    }
  }

  createButton(x, y, text, bgCol, borderCol, callback, width = 220, height = 54) {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, width, height, Phaser.Display.Color.HexStringToColor(bgCol).color, 1)
      .setStrokeStyle(4, Phaser.Display.Color.HexStringToColor(borderCol).color);
    bg.isFilled = true;

    // Corner curves simulated with rounded rect if graphics, or clean rect
    const label = this.add.text(0, 0, text, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '22px',
      color: '#ffffff',
      stroke: borderCol,
      strokeThickness: 4
    }).setOrigin(0.5);

    container.add([bg, label]);
    container.setSize(width, height);
    container.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
    bg.setInteractive({ useHandCursor: true });

    const handleOver = () => {
      this.tweens.add({
        targets: container,
        scaleX: 1.06,
        scaleY: 1.06,
        duration: 100
      });
    };

    const handleOut = () => {
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    };

    const handleDown = () => {
      this.tweens.add({
        targets: container,
        scaleX: 0.94,
        scaleY: 0.94,
        duration: 60,
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

  createSoundButton(x, y) {
    const container = this.add.container(x, y);
    const isMuted = window.audioManager.isMuted;

    const bg = this.add.circle(0, 0, 26, 0x1e293b).setStrokeStyle(3, 0x64748b);
    const icon = this.add.text(0, 0, isMuted ? '🔇' : '🔊', {
      fontSize: '24px'
    }).setOrigin(0.5);

    container.add([bg, icon]);
    container.setSize(52, 52);
    container.setInteractive(new Phaser.Geom.Circle(0, 0, 26), Phaser.Geom.Circle.Contains);
    bg.setInteractive({ useHandCursor: true });

    const handleToggle = () => {
      const muted = window.audioManager.toggleMute();
      icon.setText(muted ? '🔇' : '🔊');
    };

    container.on('pointerdown', handleToggle);
    bg.on('pointerdown', handleToggle);

    return container;
  }

  showHowToPlayModal() {
    const { width, height } = this.scale;
    const modal = this.add.container(width / 2, height / 2).setDepth(100);

    // Dim backdrop
    const dim = this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
      .setInteractive(); // block clicks behind

    // Card background
    const card = this.add.rectangle(0, 0, 680, 480, 0x0f172a, 0.95)
      .setStrokeStyle(4, 0x38bdf8);

    const title = this.add.text(0, -200, 'HOW TO PLAY', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '32px',
      color: '#38bdf8'
    }).setOrigin(0.5);

    const instructions = [
      "🎯 AIM & LAUNCH:",
      "Click & drag the bird in the slingshot backwards, then release to fire!",
      "",
      "⚡ SPECIAL BIRD POWERS (Tap/click mid-flight):",
      "🔴 RED BIRD: Standard projectile with heavy impact damage.",
      "🟡 YELLOW BIRD: Turbo speed boost to slice through wooden beams!",
      "🔵 BLUE BIRD: Splits into 3 birds in a spread to shatter glass structures!",
      "",
      "💥 OBJECTIVE:",
      "Defeat all green pigs to clear each level. Earn bonus points for unused birds!"
    ];

    const bodyText = this.add.text(0, -30, instructions.join('\n'), {
      fontFamily: 'Arial, sans-serif',
      fontSize: '17px',
      color: '#f8fafc',
      align: 'center',
      lineSpacing: 5
    }).setOrigin(0.5);

    // Close Button
    const closeBtn = this.add.container(0, 190);
    const closeBg = this.add.rectangle(0, 0, 160, 46, 0x22c55e).setStrokeStyle(3, 0x15803d);
    const closeTxt = this.add.text(0, 0, 'GOT IT!', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);
    closeBtn.add([closeBg, closeTxt]);
    closeBtn.setSize(160, 46);
    closeBtn.setInteractive(new Phaser.Geom.Rectangle(-80, -23, 160, 46), Phaser.Geom.Rectangle.Contains);
    closeBg.setInteractive({ useHandCursor: true });
    const handleClose = () => {
      window.audioManager.playButtonClick();
      modal.destroy();
    };
    closeBtn.on('pointerdown', handleClose);
    closeBg.on('pointerdown', handleClose);

    modal.add([dim, card, title, bodyText, closeBtn]);
  }
}

class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create() {
    const { width, height } = this.scale;

    // Background Sky & Mountains
    this.add.image(width / 2, height / 2, 'bg_sky').setDisplaySize(width, height);
    this.add.image(width / 2, height - 200, 'bg_mountains').setDisplaySize(width, 260);
    this.add.image(width / 2, height - 120, 'bg_hills').setDisplaySize(width, 200);
    this.add.image(width / 2, height - 40, 'ground').setDisplaySize(width, 120);

    // Header Title
    this.add.text(width / 2, 60, 'SELECT LEVEL', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '44px',
      color: '#ffffff',
      stroke: '#0f172a',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Back to Menu Button
    const backBtn = this.add.container(90, 55);
    const backBg = this.add.rectangle(0, 0, 120, 44, 0x475569).setStrokeStyle(3, 0x1e293b);
    const backTxt = this.add.text(0, 0, '⬅ BACK', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);
    backBtn.add([backBg, backTxt]);
    backBtn.setSize(120, 44);
    backBtn.setInteractive(new Phaser.Geom.Rectangle(-60, -22, 120, 44), Phaser.Geom.Rectangle.Contains);
    backBg.setInteractive({ useHandCursor: true });
    const handleBack = () => {
      window.audioManager.playButtonClick();
      this.scene.start('MenuScene');
    };
    backBtn.on('pointerdown', handleBack);
    backBg.on('pointerdown', handleBack);

    // Sound Button
    const soundBtn = this.add.container(width - 60, 55);
    const sBg = this.add.circle(0, 0, 24, 0x1e293b).setStrokeStyle(3, 0x64748b);
    const sIcon = this.add.text(0, 0, window.audioManager.isMuted ? '🔇' : '🔊', { fontSize: '22px' }).setOrigin(0.5);
    soundBtn.add([sBg, sIcon]);
    soundBtn.setSize(48, 48);
    soundBtn.setInteractive(new Phaser.Geom.Circle(0, 0, 24), Phaser.Geom.Circle.Contains);
    sBg.setInteractive({ useHandCursor: true });
    const handleToggleLevelSound = () => {
      const muted = window.audioManager.toggleMute();
      sIcon.setText(muted ? '🔇' : '🔊');
    };
    soundBtn.on('pointerdown', handleToggleLevelSound);
    sBg.on('pointerdown', handleToggleLevelSound);

    // Level Cards Layout (5 Levels)
    const unlockedLevel = LevelProgress.getUnlockedLevel();
    const startX = width / 2 - (2 * 190);
    const cardY = 280;

    let totalStars = 0;

    GAME_LEVELS.forEach((lvl, idx) => {
      const isUnlocked = lvl.id <= unlockedLevel;
      const starsEarned = LevelProgress.getLevelStars(lvl.id);
      const highScore = LevelProgress.getHighScore(lvl.id);
      totalStars += starsEarned;

      const cardX = startX + idx * 190;
      const card = this.add.container(cardX, cardY);

      // Card Box
      const cardBg = this.add.rectangle(0, 0, 160, 230, isUnlocked ? 0x1e293b : 0x0f172a, 0.95)
        .setStrokeStyle(4, isUnlocked ? 0x38bdf8 : 0x334155);

      // Level Number
      const numTxt = this.add.text(0, -75, `${lvl.id}`, {
        fontFamily: 'Arial Black, sans-serif',
        fontSize: '48px',
        color: isUnlocked ? '#facc15' : '#64748b',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5);

      // Level Name
      const nameTxt = this.add.text(0, -25, lvl.name, {
        fontFamily: 'Arial Black, sans-serif',
        fontSize: '15px',
        color: isUnlocked ? '#ffffff' : '#94a3b8',
        align: 'center',
        wordWrap: { width: 140 }
      }).setOrigin(0.5);

      card.add([cardBg, numTxt, nameTxt]);

      if (isUnlocked) {
        // Star container
        const starRow = this.add.container(0, 25);
        for (let s = 0; s < 3; s++) {
          const starKey = s < starsEarned ? 'ui_star_filled' : 'ui_star_empty';
          const starSpr = this.add.image(-34 + s * 34, 0, starKey).setScale(0.55);
          starRow.add(starSpr);
        }
        card.add(starRow);

        // High score label
        const scoreTxt = this.add.text(0, 75, `Best: ${highScore}`, {
          fontFamily: 'Arial, sans-serif',
          fontSize: '13px',
          color: '#38bdf8'
        }).setOrigin(0.5);
        card.add(scoreTxt);

        card.setSize(160, 230);
        card.setInteractive(new Phaser.Geom.Rectangle(-80, -115, 160, 230), Phaser.Geom.Rectangle.Contains);
        cardBg.setInteractive({ useHandCursor: true });
        const handleCardSelect = () => {
          window.audioManager.playButtonClick();
          this.scene.start('GameScene', { levelId: lvl.id });
        };
        card.on('pointerover', () => {
          this.tweens.add({ targets: card, scaleX: 1.08, scaleY: 1.08, duration: 120 });
        });
        card.on('pointerout', () => {
          this.tweens.add({ targets: card, scaleX: 1, scaleY: 1, duration: 120 });
        });
        card.on('pointerdown', handleCardSelect);
        cardBg.on('pointerdown', handleCardSelect);
      } else {
        // Locked icon
        const lockTxt = this.add.text(0, 30, '🔒 LOCKED', {
          fontFamily: 'Arial Black, sans-serif',
          fontSize: '15px',
          color: '#ef4444'
        }).setOrigin(0.5);
        card.add(lockTxt);
      }
    });

    // Total Stars Earned Counter (Bottom)
    const starBox = this.add.container(width / 2, height - 170);
    const starIcon = this.add.image(-45, 0, 'ui_star_filled').setScale(0.7);
    const starCount = this.add.text(5, 0, `Total Stars: ${totalStars} / ${GAME_LEVELS.length * 3}`, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '20px',
      color: '#facc15',
      stroke: '#0f172a',
      strokeThickness: 4
    }).setOrigin(0, 0.5);
    starBox.add([starIcon, starCount]);

    // Reset Progress Button (Bottom Right)
    const resetBtn = this.add.container(width - 120, height - 70);
    const rBg = this.add.rectangle(0, 0, 160, 36, 0xef4444, 0.8).setStrokeStyle(2, 0x991b1b);
    const rTxt = this.add.text(0, 0, 'Reset Progress', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      color: '#ffffff'
    }).setOrigin(0.5);
    resetBtn.add([rBg, rTxt]);
    resetBtn.setSize(160, 36);
    resetBtn.setInteractive(new Phaser.Geom.Rectangle(-80, -18, 160, 36), Phaser.Geom.Rectangle.Contains);
    rBg.setInteractive({ useHandCursor: true });
    const handleReset = () => {
      if (confirm('Are you sure you want to reset all unlocked levels and stars?')) {
        LevelProgress.resetProgress();
        this.scene.restart();
      }
    };
    resetBtn.on('pointerdown', handleReset);
    rBg.on('pointerdown', handleReset);
  }
}

if (typeof window !== 'undefined') { window.BootScene = BootScene; window.MenuScene = MenuScene; window.LevelSelectScene = LevelSelectScene; }
