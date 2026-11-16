import type Phaser from 'phaser';

export class PhysicsSystem {
  private scene: Phaser.Scene;
  private collisionHandler: (event: any) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.collisionHandler = (event: any) => {
      this.handleCollisions(event);
    };

    this.scene.matter.world.on('collisionstart', this.collisionHandler);
  }

  private handleCollisions(event: any): void {
    const pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      if (!bodyA || !bodyB) continue;

      const spriteA = bodyA.gameObject;
      const spriteB = bodyB.gameObject;

      // Calculate relative velocity
      const vx = bodyA.velocity.x - bodyB.velocity.x;
      const vy = bodyA.velocity.y - bodyB.velocity.y;
      const relativeSpeed = Math.sqrt(vx * vx + vy * vy);

      // Low threshold ignores stationary stacked resting friction jitter
      if (relativeSpeed < 2.0) continue;

      const bird = (spriteA && spriteA.birdInstance) || (spriteB && spriteB.birdInstance);
      const pig = (spriteA && spriteA.pigInstance) || (spriteB && spriteB.pigInstance);
      const block = (spriteA && spriteA.blockInstance) || (spriteB && spriteB.blockInstance);

      const colX = (bodyA.position.x + bodyB.position.x) / 2;
      const colY = (bodyA.position.y + bodyB.position.y) / 2;

      // 1. Bird hit Pig
      if (bird && pig) {
        const damage = Math.max(35, relativeSpeed * 14);
        pig.takeDamage(damage);
        this.checkScreenShake(relativeSpeed, colX, colY);
        continue;
      }

      // 2. Bird hit Block
      if (bird && block) {
        const birdType = bird.type;
        let mult = 1.0;
        // Material effectiveness
        if (birdType === 'yellow' && block.material === 'wood') mult = 2.4; // Chuck destroys wood
        if (birdType === 'blue' && block.material === 'glass') mult = 2.8; // The Blues shatter glass

        const damage = relativeSpeed * 10 * mult;
        block.takeDamage(damage, relativeSpeed);
        this.checkScreenShake(relativeSpeed, colX, colY);
        continue;
      }

      // 3. Falling / Crushing Block hit Pig
      if (block && pig) {
        // Block falling or rolling onto pig
        const damage = Math.max(20, relativeSpeed * 8);
        pig.takeDamage(damage);
        this.checkScreenShake(relativeSpeed, colX, colY);
        continue;
      }

      // 4. Block hit another Block (Structural collapse)
      if (spriteA && spriteA.blockInstance && spriteB && spriteB.blockInstance) {
        if (relativeSpeed > 3.2) {
          const dmg = (relativeSpeed - 3.0) * 8;
          spriteA.blockInstance.takeDamage(dmg, relativeSpeed);
          spriteB.blockInstance.takeDamage(dmg, relativeSpeed);
        }
        continue;
      }

      // 5. Block hit Ground at high velocity
      if (block && (bodyA.label === 'ground' || bodyB.label === 'ground')) {
        if (relativeSpeed > 5.0) {
          block.takeDamage((relativeSpeed - 4.5) * 8, relativeSpeed);
        }
      }
    }
  }

  private checkScreenShake(speed: number, x?: number, y?: number): void {
    if (speed > 13) {
      this.scene.cameras.main.shake(180, 0.012);
      if (x && y) {
        this.spawnComicPopup(x, y, 'comic_boom');
        this.spawnSparks(x, y);
      }
    } else if (speed > 7.5) {
      this.scene.cameras.main.shake(110, 0.007);
      if (x && y) {
        const key = speed > 10 ? 'comic_smash' : 'comic_crash';
        this.spawnComicPopup(x, y, key);
        this.spawnSparks(x, y);
      }
    }
  }

  private spawnComicPopup(x: number, y: number, key: string): void {
    if (!this.scene.textures.exists(key)) return;
    const badge = this.scene.add.image(x, y - 20, key);
    badge.setDepth(35);
    badge.setScale(0.4);
    badge.setRotation((Math.random() * 0.4) - 0.2);

    this.scene.tweens.add({
      targets: badge,
      scale: 1.05,
      y: y - 45,
      duration: 180,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: badge,
          alpha: 0,
          y: y - 65,
          scale: 0.9,
          duration: 350,
          delay: 200,
          ease: 'Quad.easeIn',
          onComplete: () => badge.destroy()
        });
      }
    });
  }

  private spawnSparks(x: number, y: number): void {
    if (!this.scene.textures.exists('part_spark')) return;
    for (let i = 0; i < 4; i++) {
      const spark = this.scene.add.image(x, y, 'part_spark');
      spark.setDepth(32);
      spark.setScale(0.8);
      const angle = Math.random() * Math.PI * 2;
      const dist = 25 + Math.random() * 30;
      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        rotation: 4,
        duration: 300,
        onComplete: () => spark.destroy()
      });
    }
  }

  public destroy(): void {
    this.scene.matter.world.off('collisionstart', this.collisionHandler);
  }
}
