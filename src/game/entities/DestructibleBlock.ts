import type Phaser from 'phaser';
import { BlockMaterial } from '../types';
import { AudioSystem } from '../systems/AudioSystem';
import { gameEvents } from '../events';

export class DestructibleBlock {
  public scene: Phaser.Scene;
  public type: string;
  public material: BlockMaterial;
  public sprite: Phaser.Physics.Matter.Sprite;
  public hp: number;
  public maxHp: number;
  public isDestroyed: boolean = false;
  private audio: AudioSystem;

  constructor(scene: Phaser.Scene, x: number, y: number, type: string) {
    this.scene = scene;
    this.type = type;
    this.audio = AudioSystem.getInstance();

    let material: BlockMaterial = 'wood';
    if (type.startsWith('glass')) material = 'glass';
    else if (type.startsWith('stone')) material = 'stone';
    else if (type.startsWith('tnt')) material = 'tnt';
    this.material = material;

    // Dimensions
    let width = 48;
    let height = 48;
    if (type.endsWith('_plank_h')) {
      width = 120;
      height = type.startsWith('glass') ? 20 : type.startsWith('stone') ? 28 : 24;
    } else if (type.endsWith('_plank_v')) {
      width = type.startsWith('glass') ? 20 : type.startsWith('stone') ? 28 : 24;
      height = 120;
    }

    // Physics Properties per Material
    let density = 0.0022;
    let friction = 0.75;
    let restitution = 0.2;
    let hp = 60;

    if (material === 'glass') {
      density = 0.0012;
      friction = 0.45;
      restitution = 0.35;
      hp = 25; // fragile!
    } else if (material === 'stone') {
      density = 0.006;
      friction = 0.85;
      restitution = 0.15;
      hp = 140; // sturdy!
    } else if (material === 'tnt') {
      density = 0.0025;
      friction = 0.7;
      restitution = 0.2;
      hp = 18;
    }

    this.hp = hp;
    this.maxHp = hp;

    this.sprite = scene.matter.add.sprite(x, y, type, undefined, {
      shape: {
        type: 'rectangle',
        width,
        height
      },
      density,
      friction,
      restitution,
      label: 'block'
    });

    (this.sprite as any).blockInstance = this;
    this.sprite.setDepth(11);
  }

  public takeDamage(amount: number, impactForce: number = 1): void {
    if (this.isDestroyed) return;

    // Material resistance multiplier
    let finalDamage = amount;
    if (this.material === 'glass') {
      finalDamage *= 1.4; // very brittle
    } else if (this.material === 'stone') {
      finalDamage *= 0.65; // hard stone resistance
    }

    this.hp -= finalDamage;

    // Play impact clink/knock
    if (this.material === 'wood') {
      this.audio.playWoodImpact(impactForce);
    } else if (this.material === 'glass') {
      this.audio.playGlassImpact(impactForce);
    } else if (this.material === 'stone') {
      this.audio.playStoneImpact(impactForce);
    }

    // Visual crack / damage feedback: slight tint or alpha shift
    const healthRatio = Math.max(0.2, this.hp / this.maxHp);
    if (this.material === 'glass') {
      this.sprite.setAlpha(0.4 + 0.6 * healthRatio);
    } else {
      this.sprite.setTint(healthRatio < 0.5 ? 0xdd9988 : 0xffffff);
    }

    if (this.hp <= 0) {
      this.destroyBlock();
    }
  }

  public destroyBlock(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    const x = this.sprite.x;
    const y = this.sprite.y;

    let scoreAward = 500;
    if (this.material === 'glass') scoreAward = 750;
    if (this.material === 'stone') scoreAward = 1000;
    if (this.material === 'tnt') scoreAward = 2000;

    // Sound effect
    if (this.material === 'wood') {
      this.audio.playWoodBreak();
    } else if (this.material === 'glass') {
      this.audio.playGlassBreak();
    } else if (this.material === 'stone') {
      this.audio.playStoneBreak();
    } else if (this.material === 'tnt') {
      this.audio.playTntExplode();
      this.triggerTntExplosion(x, y);
    }

    // Debris particles
    this.spawnDebris(x, y);

    // Floating score popup
    this.spawnFloatingScore(x, y, `+${scoreAward}`);

    // Cleanly remove sprite and physics body from world
    if (this.sprite && this.sprite.active) {
      this.sprite.destroy();
    }

    gameEvents.emit('BLOCK_DESTROYED', this.material, scoreAward);
    gameEvents.emit('SCORE_UPDATED', {
      score: 0,
      delta: scoreAward,
      x,
      y,
      reason: `Destroyed ${this.material} block`
    });
  }

  private triggerTntExplosion(x: number, y: number): void {
    // Screen shake
    this.scene.cameras.main.shake(250, 0.02);

    // Blast wave particle
    const blast = this.scene.add.circle(x, y, 15, 0xfacc15, 0.9);
    blast.setDepth(25);
    this.scene.tweens.add({
      targets: blast,
      radius: 120,
      alpha: 0,
      duration: 350,
      ease: 'Cubic.easeOut',
      onComplete: () => blast.destroy()
    });

    // Radial force to all nearby rigid bodies
    const bodies = this.scene.matter.world.getAllBodies();
    const blastRadius = 220;
    const blastForce = 0.08;

    bodies.forEach((body: any) => {
      if (body.isStatic) return;
      const dx = body.position.x - x;
      const dy = body.position.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0 && dist < blastRadius) {
        const falloff = 1 - dist / blastRadius;
        const fx = (dx / dist) * blastForce * falloff;
        const fy = ((dy - 40) / dist) * blastForce * falloff; // slight upward lift

        this.scene.matter.body.applyForce(body, body.position, { x: fx, y: fy });

        // Apply explosion damage to blocks and pigs
        const sprite = body.gameObject;
        if (sprite) {
          if (sprite.blockInstance && !sprite.blockInstance.isDestroyed) {
            sprite.blockInstance.takeDamage(120 * falloff, 4);
          } else if (sprite.pigInstance && !sprite.pigInstance.isDefeated) {
            sprite.pigInstance.takeDamage(120 * falloff);
          }
        }
      }
    });
  }

  private spawnDebris(x: number, y: number): void {
    const partKey =
      this.material === 'glass'
        ? 'part_glass_shard'
        : this.material === 'stone'
        ? 'part_stone_chunk'
        : 'part_wood_chip';

    for (let i = 0; i < 6; i++) {
      const part = this.scene.add.image(x, y, partKey);
      part.setDepth(15);
      part.setScale(0.8 + Math.random() * 0.4);

      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 50;

      this.scene.tweens.add({
        targets: part,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed + 25,
        rotation: Math.random() * 6 - 3,
        alpha: 0,
        duration: 500 + Math.random() * 200,
        ease: 'Quad.easeOut',
        onComplete: () => part.destroy()
      });
    }
  }

  private spawnFloatingScore(x: number, y: number, text: string): void {
    const scoreText = this.scene.add.text(x, y - 5, text, {
      fontFamily: 'Titan One, Fredoka, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#0f172a',
      strokeThickness: 3
    });
    scoreText.setOrigin(0.5);
    scoreText.setDepth(28);

    this.scene.tweens.add({
      targets: scoreText,
      y: y - 40,
      alpha: 0,
      duration: 800,
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
