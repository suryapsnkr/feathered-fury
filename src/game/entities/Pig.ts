import type Phaser from 'phaser';
import { PigType } from '../types';
import { AudioSystem } from '../systems/AudioSystem';
import { gameEvents } from '../events';

export class Pig {
  public scene: Phaser.Scene;
  public type: PigType;
  public sprite: Phaser.Physics.Matter.Sprite;
  public hp: number;
  public maxHp: number;
  public isDefeated: boolean = false;
  private audio: AudioSystem;

  constructor(scene: Phaser.Scene, x: number, y: number, type: PigType) {
    this.scene = scene;
    this.type = type;
    this.audio = AudioSystem.getInstance();

    let textureKey = 'pig_basic';
    let radius = 20;
    let hp = 35;

    if (type === 'helmet') {
      textureKey = 'pig_helmet';
      radius = 21;
      hp = 85;
    } else if (type === 'king') {
      textureKey = 'pig_king';
      radius = 28;
      hp = 160;
    }

    this.hp = hp;
    this.maxHp = hp;

    this.sprite = scene.matter.add.sprite(x, y, textureKey, undefined, {
      shape: {
        type: 'circle',
        radius: radius
      },
      density: 0.003,
      friction: 0.8,
      restitution: 0.25,
      label: 'pig'
    });

    (this.sprite as any).pigInstance = this;
    this.sprite.setDepth(12);
  }

  public takeDamage(amount: number): void {
    if (this.isDefeated) return;

    this.hp -= amount;

    // Facial expression reaction
    if (this.hp <= this.maxHp * 0.55 && this.type === 'basic') {
      this.sprite.setTexture('pig_basic_hurt');
    }

    // Comical shudder/shake tween
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.15,
      scaleY: 0.85,
      yoyo: true,
      duration: 80,
      ease: 'Quad.easeInOut'
    });

    if (this.hp <= 0) {
      this.defeat();
    } else {
      this.audio.playPigOink();
    }
  }

  public defeat(): void {
    if (this.isDefeated) return;
    this.isDefeated = true;

    const x = this.sprite.x;
    const y = this.sprite.y;

    let scoreAward = 5000;
    if (this.type === 'helmet') scoreAward = 8000;
    if (this.type === 'king') scoreAward = 15000;

    this.audio.playPigDefeat();

    // Spawn defeat particle explosion & smoke
    this.spawnDefeatParticles(x, y);

    // Floating score popup text
    this.spawnFloatingScore(x, y, `+${scoreAward.toLocaleString()}`);

    // Safely destroy physics body & sprite
    if (this.sprite && this.sprite.active) {
      this.sprite.destroy();
    }

    // Notify scoring and level manager
    gameEvents.emit('PIG_DEFEATED', this.type, 0, scoreAward);
    gameEvents.emit('SCORE_UPDATED', {
      score: 0,
      delta: scoreAward,
      x,
      y,
      reason: `Defeated ${this.type} pig`
    });
  }

  private spawnDefeatParticles(x: number, y: number): void {
    // White smoke puff
    for (let i = 0; i < 4; i++) {
      const puff = this.scene.add.image(x + (Math.random() * 20 - 10), y + (Math.random() * 20 - 10), 'part_smoke');
      puff.setDepth(20);
      puff.setScale(0.8);
      this.scene.tweens.add({
        targets: puff,
        scale: 1.6,
        alpha: 0,
        x: puff.x + (Math.random() * 40 - 20),
        y: puff.y - 30 - Math.random() * 20,
        duration: 550,
        ease: 'Cubic.easeOut',
        onComplete: () => puff.destroy()
      });
    }

    // Little pop stars
    for (let i = 0; i < 6; i++) {
      const star = this.scene.add.image(x, y, 'part_star');
      star.setDepth(21);
      star.setScale(0.7);
      const angle = (i * Math.PI * 2) / 6;
      const dist = 35 + Math.random() * 25;
      this.scene.tweens.add({
        targets: star,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        rotation: 3,
        duration: 500,
        ease: 'Quad.easeOut',
        onComplete: () => star.destroy()
      });
    }
  }

  private spawnFloatingScore(x: number, y: number, text: string): void {
    const scoreText = this.scene.add.text(x, y - 10, text, {
      fontFamily: 'Titan One, Fredoka, sans-serif',
      fontSize: '22px',
      color: '#facc15',
      stroke: '#0f172a',
      strokeThickness: 4
    });
    scoreText.setOrigin(0.5);
    scoreText.setDepth(30);

    this.scene.tweens.add({
      targets: scoreText,
      y: y - 55,
      alpha: 0,
      scale: 1.25,
      duration: 1000,
      ease: 'Cubic.easeOut',
      onComplete: () => scoreText.destroy()
    });
  }

  public destroy(): void {
    if (this.sprite && this.sprite.active) {
      this.sprite.destroy();
    }
  }
}
