import type Phaser from 'phaser';

/**
 * Procedural Canvas Texture Generator for Phaser 3
 * Generates all original game sprites, materials, characters, and environmental elements.
 */
export class TextureGenerator {
  public static generateAll(scene: Phaser.Scene): void {
    if (scene.textures.exists('bird_red')) {
      return; // Already generated
    }

    this.generateBirds(scene);
    this.generatePigs(scene);
    this.generateBlocks(scene);
    this.generateSlingshot(scene);
    this.generateEnvironment(scene);
    this.generateParticles(scene);
  }

  private static createCanvas(
    scene: Phaser.Scene,
    key: string,
    width: number,
    height: number,
    drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
  ): void {
    if (scene.textures.exists(key)) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawFn(ctx, width, height);
      scene.textures.addCanvas(key, canvas);
    }
  }

  // --- BIRDS ---
  private static generateBirds(scene: Phaser.Scene): void {
    // 1. Red Bird (Normal & Blink)
    [false, true].forEach((blink) => {
      const key = blink ? 'bird_red_blink' : 'bird_red';
      this.createCanvas(scene, key, 52, 52, (ctx) => {
        const cx = 26;
        const cy = 28;

        // Tail feathers (3 black spikes)
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy);
        ctx.lineTo(cx - 30, cy - 8);
        ctx.lineTo(cx - 24, cy - 2);
        ctx.lineTo(cx - 32, cy + 2);
        ctx.lineTo(cx - 23, cy + 5);
        ctx.lineTo(cx - 28, cy + 10);
        ctx.lineTo(cx - 18, cy + 4);
        ctx.closePath();
        ctx.fill();

        // Crest feathers
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(cx - 4, cy - 18);
        ctx.quadraticCurveTo(cx - 8, cy - 30, cx - 2, cy - 30);
        ctx.quadraticCurveTo(cx + 2, cy - 25, cx, cy - 18);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx, cy - 18);
        ctx.quadraticCurveTo(cx + 4, cy - 32, cx + 10, cy - 30);
        ctx.quadraticCurveTo(cx + 8, cy - 23, cx + 4, cy - 18);
        ctx.fill();

        // Body gradient (crimson red)
        const grad = ctx.createRadialGradient(cx - 4, cy - 4, 4, cx, cy, 22);
        grad.addColorStop(0, '#f87171');
        grad.addColorStop(0.7, '#ef4444');
        grad.addColorStop(1, '#b91c1c');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#7f1d1d';
        ctx.stroke();

        // Belly (cream patch)
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.ellipse(cx + 3, cy + 9, 12, 8, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        const eyeY = cy - 4;
        if (blink) {
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(cx + 2, eyeY, 5, 0.2, Math.PI - 0.2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx + 12, eyeY, 5, 0.2, Math.PI - 0.2);
          ctx.stroke();
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + 2, eyeY, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx + 12, eyeY, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Black pupils looking right/forward
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(cx + 3.5, eyeY, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx + 13.5, eyeY, 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Catchlights
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + 4.5, eyeY - 1, 0.9, 0, Math.PI * 2);
          ctx.arc(cx + 14.5, eyeY - 1, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }

        // Angry thick black eyebrows (angled sharply downward towards beak)
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(cx - 4, eyeY - 7);
        ctx.lineTo(cx + 7, eyeY - 3);
        ctx.lineTo(cx + 7, eyeY - 6);
        ctx.lineTo(cx - 3, eyeY - 10);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx + 8, eyeY - 3);
        ctx.lineTo(cx + 19, eyeY - 7);
        ctx.lineTo(cx + 18, eyeY - 10);
        ctx.lineTo(cx + 8, eyeY - 6);
        ctx.closePath();
        ctx.fill();

        // Beak (Bright orange-yellow cone)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(cx + 5, cy);
        ctx.lineTo(cx + 22, cy + 4);
        ctx.lineTo(cx + 6, cy + 9);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#b45309';
        ctx.stroke();

        // Beak dividing line
        ctx.beginPath();
        ctx.moveTo(cx + 5, cy + 4);
        ctx.lineTo(cx + 20, cy + 4);
        ctx.stroke();
      });
    });

    // 2. Yellow Bird (Chuck style - triangle wedge)
    [false, true].forEach((boost) => {
      const key = boost ? 'bird_yellow_boost' : 'bird_yellow';
      this.createCanvas(scene, key, 54, 54, (ctx) => {
        const cx = 26;
        const cy = 28;

        // Tail feathers (4 black feathers)
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy + 6);
        ctx.lineTo(cx - 30, cy + 2);
        ctx.lineTo(cx - 24, cy + 8);
        ctx.lineTo(cx - 32, cy + 12);
        ctx.lineTo(cx - 16, cy + 14);
        ctx.closePath();
        ctx.fill();

        // Crest top spike
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy - 14);
        ctx.lineTo(cx - 14, cy - 26);
        ctx.lineTo(cx - 2, cy - 18);
        ctx.lineTo(cx - 4, cy - 30);
        ctx.lineTo(cx + 4, cy - 16);
        ctx.closePath();
        ctx.fill();

        // Triangle Body (Vibrant Yellow gradient)
        const grad = ctx.createLinearGradient(cx - 14, cy - 20, cx + 18, cy + 18);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.5, '#facc15');
        grad.addColorStop(1, '#eab308');
        ctx.fillStyle = grad;

        ctx.beginPath();
        // Rounded triangle
        ctx.moveTo(cx + 20, cy + 14);
        ctx.lineTo(cx - 18, cy + 16);
        ctx.quadraticCurveTo(cx - 22, cy + 16, cx - 18, cy + 10);
        ctx.lineTo(cx - 2, cy - 20);
        ctx.quadraticCurveTo(cx + 3, cy - 22, cx + 8, cy - 16);
        ctx.lineTo(cx + 22, cy + 8);
        ctx.quadraticCurveTo(cx + 24, cy + 14, cx + 20, cy + 14);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#a16207';
        ctx.stroke();

        // White belly patch
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(cx + 2, cy + 12, 11, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        const eyeY = cy - 2;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx + 4, eyeY, 5, 0, Math.PI * 2);
        ctx.arc(cx + 13, eyeY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = boost ? '#dc2626' : '#0f172a';
        ctx.beginPath();
        ctx.arc(cx + 6, eyeY, 2.2, 0, Math.PI * 2);
        ctx.arc(cx + 15, eyeY, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Slanted determined eyebrows
        ctx.fillStyle = '#92400e';
        ctx.fillRect(cx - 1, eyeY - 7, 8, 3);
        ctx.fillRect(cx + 9, eyeY - 7, 8, 3);

        // Sharp sharp cone beak
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(cx + 8, cy);
        ctx.lineTo(cx + 26, cy + 3);
        ctx.lineTo(cx + 9, cy + 8);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#9a3412';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Speed flames if boost
        if (boost) {
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.moveTo(cx - 18, cy - 6);
          ctx.lineTo(cx - 30, cy - 4);
          ctx.lineTo(cx - 22, cy);
          ctx.lineTo(cx - 32, cy + 4);
          ctx.lineTo(cx - 18, cy + 8);
          ctx.closePath();
          ctx.fill();
        }
      });
    });

    // 3. Blue Bird (Cute, small, azure)
    [false, true].forEach((blink) => {
      const key = blink ? 'bird_blue_blink' : 'bird_blue';
      this.createCanvas(scene, key, 40, 40, (ctx) => {
        const cx = 20;
        const cy = 20;

        // Tail
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(cx - 12, cy + 2);
        ctx.lineTo(cx - 20, cy);
        ctx.lineTo(cx - 14, cy + 6);
        ctx.lineTo(cx - 18, cy + 9);
        ctx.lineTo(cx - 10, cy + 8);
        ctx.closePath();
        ctx.fill();

        // Crest feather
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(cx - 2, cy - 12);
        ctx.quadraticCurveTo(cx + 2, cy - 20, cx + 6, cy - 18);
        ctx.lineTo(cx + 2, cy - 12);
        ctx.fill();

        // Body gradient (Sky blue / cyan)
        const grad = ctx.createRadialGradient(cx - 3, cy - 3, 3, cx, cy, 15);
        grad.addColorStop(0, '#7dd3fc');
        grad.addColorStop(0.7, '#38bdf8');
        grad.addColorStop(1, '#0284c7');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#0369a1';
        ctx.stroke();

        // Eyes (big innocent cute eyes)
        const eyeY = cy - 2;
        if (blink) {
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx + 1, eyeY, 4, 0.2, Math.PI - 0.2);
          ctx.arc(cx + 8, eyeY, 4, 0.2, Math.PI - 0.2);
          ctx.stroke();
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + 1, eyeY, 4.5, 0, Math.PI * 2);
          ctx.arc(cx + 8, eyeY, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(cx + 2, eyeY, 2, 0, Math.PI * 2);
          ctx.arc(cx + 9, eyeY, 2, 0, Math.PI * 2);
          ctx.fill();

          // Cute sparkle
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + 2.5, eyeY - 0.8, 0.8, 0, Math.PI * 2);
          ctx.arc(cx + 9.5, eyeY - 0.8, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Orange beak
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(cx + 4, cy + 2);
        ctx.lineTo(cx + 14, cy + 4);
        ctx.lineTo(cx + 4, cy + 8);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#c2410c';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });
  }

  // --- PIGS ---
  private static generatePigs(scene: Phaser.Scene): void {
    // 1. Basic Pig (Normal & Hurt)
    [false, true].forEach((hurt) => {
      const key = hurt ? 'pig_basic_hurt' : 'pig_basic';
      this.createCanvas(scene, key, 56, 56, (ctx) => {
        const cx = 28;
        const cy = 30;

        // Round Green Pig Ears
        ctx.fillStyle = '#4ade80';
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 1.8;

        ctx.beginPath();
        ctx.arc(cx - 16, cy - 16, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx + 16, cy - 16, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Ear inner
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(cx - 16, cy - 16, 3.5, 0, Math.PI * 2);
        ctx.arc(cx + 16, cy - 16, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Body Gradient (Vibrant Lime Green)
        const grad = ctx.createRadialGradient(cx - 5, cy - 5, 5, cx, cy, 24);
        grad.addColorStop(0, '#86efac');
        grad.addColorStop(0.65, '#4ade80');
        grad.addColorStop(1, '#22c55e');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Eyes
        const eyeY = cy - 7;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx - 9, eyeY, 6.5, 0, Math.PI * 2);
        ctx.arc(cx + 9, eyeY, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (hurt) {
          // X eyes for hurt
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2.2;
          // Left X
          ctx.beginPath();
          ctx.moveTo(cx - 12, eyeY - 3);
          ctx.lineTo(cx - 6, eyeY + 3);
          ctx.moveTo(cx - 6, eyeY - 3);
          ctx.lineTo(cx - 12, eyeY + 3);
          ctx.stroke();

          // Right X
          ctx.beginPath();
          ctx.moveTo(cx + 6, eyeY - 3);
          ctx.lineTo(cx + 12, eyeY + 3);
          ctx.moveTo(cx + 12, eyeY - 3);
          ctx.lineTo(cx + 6, eyeY + 3);
          ctx.stroke();

          // Purple bruise patch
          ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
          ctx.beginPath();
          ctx.arc(cx - 12, cy + 6, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Comical googly pupils
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(cx - 7, eyeY, 2.5, 0, Math.PI * 2);
          ctx.arc(cx + 11, eyeY, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx - 6, eyeY - 1, 1, 0, Math.PI * 2);
          ctx.arc(cx + 12, eyeY - 1, 1, 0, Math.PI * 2);
          ctx.fill();
        }

        // Snout (Big oval nose)
        const snoutGrad = ctx.createLinearGradient(cx - 10, cy, cx + 10, cy + 12);
        snoutGrad.addColorStop(0, '#86efac');
        snoutGrad.addColorStop(1, '#22c55e');
        ctx.fillStyle = snoutGrad;

        ctx.beginPath();
        ctx.ellipse(cx, cy + 4, 11, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Nostrils (2 dark green ovals)
        ctx.fillStyle = '#14532d';
        ctx.beginPath();
        ctx.ellipse(cx - 4, cy + 4, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + 4, cy + 4, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cheerful smile under snout
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (hurt) {
          // Wobbly wavy mouth
          ctx.arc(cx, cy + 17, 5, Math.PI, 0);
        } else {
          ctx.arc(cx, cy + 10, 6, 0.2, Math.PI - 0.2);
        }
        ctx.stroke();
      });
    });

    // 2. Helmet Pig (Tougher Pig with Metal Battle Helmet)
    this.createCanvas(scene, 'pig_helmet', 58, 62, (ctx) => {
      const cx = 29;
      const cy = 34;

      // Base pig ears
      ctx.fillStyle = '#4ade80';
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(cx - 16, cy - 14, 6, 0, Math.PI * 2);
      ctx.arc(cx + 16, cy - 14, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Body
      const grad = ctx.createRadialGradient(cx - 4, cy - 4, 4, cx, cy, 23);
      grad.addColorStop(0, '#86efac');
      grad.addColorStop(0.7, '#4ade80');
      grad.addColorStop(1, '#16a34a');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 21, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Snout
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 5, 10, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.fillStyle = '#14532d';
      ctx.beginPath();
      ctx.ellipse(cx - 4, cy + 5, 2.2, 3.2, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + 4, cy + 5, 2.2, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      const eyeY = cy - 4;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - 8, eyeY, 5.5, 0, Math.PI * 2);
      ctx.arc(cx + 8, eyeY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#15803d';
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cx - 7, eyeY, 2.2, 0, Math.PI * 2);
      ctx.arc(cx + 9, eyeY, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Heavy Metal Helmet on top
      const helmGrad = ctx.createLinearGradient(cx - 24, cy - 32, cx + 24, cy - 10);
      helmGrad.addColorStop(0, '#94a3b8');
      helmGrad.addColorStop(0.5, '#64748b');
      helmGrad.addColorStop(1, '#334155');
      ctx.fillStyle = helmGrad;

      ctx.beginPath();
      ctx.arc(cx, cy - 10, 22, Math.PI + 0.1, -0.1);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Helmet Rim & Golden Rivets
      ctx.fillStyle = '#475569';
      ctx.fillRect(cx - 22, cy - 13, 44, 5);
      ctx.strokeRect(cx - 22, cy - 13, 44, 5);

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(cx - 15, cy - 10, 2, 0, Math.PI * 2);
      ctx.arc(cx, cy - 10, 2.2, 0, Math.PI * 2);
      ctx.arc(cx + 15, cy - 10, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. King Pig (Boss Pig with Crown)
    this.createCanvas(scene, 'pig_king', 74, 80, (ctx) => {
      const cx = 37;
      const cy = 46;

      // Ears
      ctx.fillStyle = '#4ade80';
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx - 22, cy - 20, 8, 0, Math.PI * 2);
      ctx.arc(cx + 22, cy - 20, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Big round boss body
      const grad = ctx.createRadialGradient(cx - 6, cy - 6, 6, cx, cy, 32);
      grad.addColorStop(0, '#a7f3d0');
      grad.addColorStop(0.65, '#4ade80');
      grad.addColorStop(1, '#15803d');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 2.8;
      ctx.stroke();

      // Snout
      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 6, 14, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.fillStyle = '#14532d';
      ctx.beginPath();
      ctx.ellipse(cx - 5, cy + 6, 3.2, 4.2, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + 5, cy + 6, 3.2, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      const eyeY = cy - 7;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - 10, eyeY, 7.5, 0, Math.PI * 2);
      ctx.arc(cx + 10, eyeY, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#15803d';
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cx - 8, eyeY, 3, 0, Math.PI * 2);
      ctx.arc(cx + 12, eyeY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Smug smile
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy + 15, 8, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Golden Crown with 3 Points & Rubies
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 18, cy - 24);
      ctx.lineTo(cx - 20, cy - 40);
      ctx.lineTo(cx - 10, cy - 32);
      ctx.lineTo(cx, cy - 44);
      ctx.lineTo(cx + 10, cy - 32);
      ctx.lineTo(cx + 20, cy - 40);
      ctx.lineTo(cx + 18, cy - 24);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Rubies on Crown peaks
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx - 20, cy - 40, 2.5, 0, Math.PI * 2);
      ctx.arc(cx, cy - 44, 3, 0, Math.PI * 2);
      ctx.arc(cx + 20, cy - 40, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // --- BLOCKS & STRUCTURES ---
  private static generateBlocks(scene: Phaser.Scene): void {
    // 1. Wood Plank Horizontal (120x24)
    this.createCanvas(scene, 'wood_plank_h', 120, 24, (ctx, w, h) => {
      // Wood gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#d97706');
      grad.addColorStop(0.5, '#b45309');
      grad.addColorStop(1, '#78350f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Wood grain lines
      ctx.strokeStyle = 'rgba(254, 243, 199, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(4, 7);
      ctx.bezierCurveTo(40, 5, 80, 9, w - 4, 7);
      ctx.moveTo(4, 17);
      ctx.bezierCurveTo(35, 19, 85, 15, w - 4, 17);
      ctx.stroke();

      // Border and corner nails
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);

      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(6, 6, 2, 0, Math.PI * 2);
      ctx.arc(w - 6, 6, 2, 0, Math.PI * 2);
      ctx.arc(6, h - 6, 2, 0, Math.PI * 2);
      ctx.arc(w - 6, h - 6, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Wood Plank Vertical (24x120)
    this.createCanvas(scene, 'wood_plank_v', 24, 120, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#d97706');
      grad.addColorStop(0.5, '#b45309');
      grad.addColorStop(1, '#78350f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(254, 243, 199, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(7, 4);
      ctx.bezierCurveTo(5, 40, 9, 80, 7, h - 4);
      ctx.moveTo(17, 4);
      ctx.bezierCurveTo(19, 35, 15, 85, 17, h - 4);
      ctx.stroke();

      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);

      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(6, 6, 2, 0, Math.PI * 2);
      ctx.arc(w - 6, 6, 2, 0, Math.PI * 2);
      ctx.arc(6, h - 6, 2, 0, Math.PI * 2);
      ctx.arc(w - 6, h - 6, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Wood Block (48x48 Crate)
    this.createCanvas(scene, 'wood_block', 48, 48, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(1, '#92400e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Inner diagonal cross brace
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(4, 4);
      ctx.lineTo(w - 4, h - 4);
      ctx.moveTo(w - 4, 4);
      ctx.lineTo(4, h - 4);
      ctx.stroke();

      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });

    // 4. Glass Plank Horizontal (120x20)
    this.createCanvas(scene, 'glass_plank_h', 120, 20, (ctx, w, h) => {
      ctx.fillStyle = 'rgba(186, 230, 253, 0.65)';
      ctx.fillRect(0, 0, w, h);

      // Diagonal shine reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(35, 0);
      ctx.lineTo(25, h);
      ctx.lineTo(10, h);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(75, 0);
      ctx.lineTo(95, 0);
      ctx.lineTo(85, h);
      ctx.lineTo(65, h);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });

    // 5. Glass Plank Vertical (20x120)
    this.createCanvas(scene, 'glass_plank_v', 20, 120, (ctx, w, h) => {
      ctx.fillStyle = 'rgba(186, 230, 253, 0.65)';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(w, 35);
      ctx.lineTo(w, 25);
      ctx.lineTo(0, 10);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });

    // 6. Glass Block (44x44)
    this.createCanvas(scene, 'glass_block', 44, 44, (ctx, w, h) => {
      ctx.fillStyle = 'rgba(224, 242, 254, 0.7)';
      ctx.fillRect(0, 0, w, h);

      // Bright glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(8, 8);
      ctx.lineTo(28, 8);
      ctx.lineTo(8, 28);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });

    // 7. Stone Plank Horizontal (120x28)
    this.createCanvas(scene, 'stone_plank_h', 120, 28, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.5, '#64748b');
      grad.addColorStop(1, '#475569');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Rock grain and chisel pits
      ctx.fillStyle = '#334155';
      for (let i = 10; i < w; i += 24) {
        ctx.fillRect(i, 8, 3, 2);
        ctx.fillRect(i + 12, 18, 4, 2);
      }

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });

    // 8. Stone Plank Vertical (28x120)
    this.createCanvas(scene, 'stone_plank_v', 28, 120, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.5, '#64748b');
      grad.addColorStop(1, '#475569');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#334155';
      for (let i = 10; i < h; i += 24) {
        ctx.fillRect(8, i, 2, 3);
        ctx.fillRect(18, i + 12, 2, 4);
      }

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });

    // 9. Stone Block (48x48)
    this.createCanvas(scene, 'stone_block', 48, 48, (ctx, w, h) => {
      const grad = ctx.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, 32);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.7, '#64748b');
      grad.addColorStop(1, '#334155');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Brick mortar line
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h / 2);
      ctx.stroke();

      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });

    // 10. TNT Crate (48x48)
    this.createCanvas(scene, 'tnt_block', 48, 48, (ctx, w, h) => {
      // Red explosive crate background
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, w, h);

      // Yellow hazard stripes top & bottom
      ctx.fillStyle = '#facc15';
      ctx.fillRect(0, 0, w, 8);
      ctx.fillRect(0, h - 8, w, 8);

      // Black hazard diagonal hashes
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      for (let i = -10; i < w + 10; i += 12) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 8, 8);
        ctx.moveTo(i, h - 8);
        ctx.lineTo(i + 8, h);
        ctx.stroke();
      }

      // "TNT" Bold text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TNT', w / 2, h / 2);

      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });
  }

  // --- SLINGSHOT ---
  private static generateSlingshot(scene: Phaser.Scene): void {
    // Stylized wooden Y-fork slingshot
    this.createCanvas(scene, 'slingshot_base', 44, 130, (ctx, w, h) => {
      // Slingshot wooden fork
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#92400e');
      grad.addColorStop(0.5, '#b45309');
      grad.addColorStop(1, '#78350f');
      ctx.fillStyle = grad;

      ctx.beginPath();
      // Base trunk
      ctx.moveTo(16, h);
      ctx.lineTo(28, h);
      ctx.lineTo(26, 55);
      // Right prong
      ctx.quadraticCurveTo(36, 45, 38, 10);
      ctx.lineTo(30, 8);
      ctx.quadraticCurveTo(24, 38, 22, 50);
      // Left prong
      ctx.quadraticCurveTo(20, 38, 14, 8);
      ctx.lineTo(6, 10);
      ctx.quadraticCurveTo(8, 45, 18, 55);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Prongs leather strap attachments
      ctx.fillStyle = '#451a03';
      ctx.fillRect(4, 12, 12, 5);
      ctx.fillRect(28, 12, 12, 5);
    });
  }

  // --- ENVIRONMENT ---
  private static generateEnvironment(scene: Phaser.Scene): void {
    // 1. Ground with grass top and rich soil strata (1280x90)
    this.createCanvas(scene, 'ground_grass', 1280, 90, (ctx, w, h) => {
      // Dirt gradient
      const dirtGrad = ctx.createLinearGradient(0, 16, 0, h);
      dirtGrad.addColorStop(0, '#78350f');
      dirtGrad.addColorStop(0.3, '#572607');
      dirtGrad.addColorStop(1, '#2c1404');
      ctx.fillStyle = dirtGrad;
      ctx.fillRect(0, 16, w, h - 16);

      // Embedded rocks
      ctx.fillStyle = '#64748b';
      for (let i = 40; i < w; i += 90) {
        ctx.beginPath();
        ctx.ellipse(i, 45, 10, 6, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Top grass layer
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, 8, w, 14);

      // Grass fringe (little blades)
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.moveTo(0, 10);
      for (let i = 0; i < w; i += 16) {
        ctx.lineTo(i + 8, 0);
        ctx.lineTo(i + 16, 10);
      }
      ctx.lineTo(w, 20);
      ctx.lineTo(0, 20);
      ctx.closePath();
      ctx.fill();
    });

    // 2. Cartoon Clouds
    this.createCanvas(scene, 'cloud_1', 160, 70, (ctx) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(45, 45, 22, 0, Math.PI * 2);
      ctx.arc(80, 32, 28, 0, Math.PI * 2);
      ctx.arc(115, 45, 20, 0, Math.PI * 2);
      ctx.fill();
    });

    this.createCanvas(scene, 'cloud_2', 220, 90, (ctx) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(50, 55, 30, 0, Math.PI * 2);
      ctx.arc(105, 42, 38, 0, Math.PI * 2);
      ctx.arc(165, 55, 28, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Rolling Hills Parallax Background (1280x260)
    this.createCanvas(scene, 'hill_bg', 1280, 260, (ctx, w, h) => {
      // Far hill (teal/green)
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.bezierCurveTo(300, h - 180, 600, h - 220, w, h - 80);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // Near hill (bright vibrant green)
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.bezierCurveTo(400, h - 120, 900, h - 160, w, h - 120);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
    });

    // 4. Sun (80x80)
    this.createCanvas(scene, 'sun', 80, 80, (ctx) => {
      const grad = ctx.createRadialGradient(40, 40, 6, 40, 40, 38);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.6, '#facc15');
      grad.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(40, 40, 38, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(40, 40, 22, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // --- PARTICLES & HUD ---
  private static generateParticles(scene: Phaser.Scene): void {
    // 1. Trajectory Dot (aiming bead)
    this.createCanvas(scene, 'trajectory_dot', 12, 12, (ctx) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(6, 6, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // 2. Feather Particles
    [
      { key: 'part_feather_red', color: '#ef4444' },
      { key: 'part_feather_yellow', color: '#facc15' },
      { key: 'part_feather_blue', color: '#38bdf8' }
    ].forEach((f) => {
      this.createCanvas(scene, f.key, 16, 8, (ctx) => {
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.ellipse(8, 4, 7, 3, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // 3. Debris particles
    this.createCanvas(scene, 'part_wood_chip', 12, 12, (ctx) => {
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(2, 2);
      ctx.lineTo(10, 4);
      ctx.lineTo(8, 10);
      ctx.lineTo(3, 8);
      ctx.closePath();
      ctx.fill();
    });

    this.createCanvas(scene, 'part_glass_shard', 12, 12, (ctx) => {
      ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
      ctx.beginPath();
      ctx.moveTo(6, 1);
      ctx.lineTo(11, 10);
      ctx.lineTo(2, 9);
      ctx.closePath();
      ctx.fill();
    });

    this.createCanvas(scene, 'part_stone_chunk', 14, 14, (ctx) => {
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(7, 7, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    this.createCanvas(scene, 'part_smoke', 20, 20, (ctx) => {
      const grad = ctx.createRadialGradient(10, 10, 2, 10, 10, 9);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(1, 'rgba(240, 240, 240, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(10, 10, 9, 0, Math.PI * 2);
      ctx.fill();
    });

    this.createCanvas(scene, 'part_star', 20, 20, (ctx) => {
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = 10 + Math.cos(outerAngle) * 8;
        const y = 10 + Math.sin(outerAngle) * 8;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    });

    // 4. Ghost Trajectory Dot (for past shot reference)
    this.createCanvas(scene, 'trajectory_dot_ghost', 8, 8, (ctx) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.arc(4, 4, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Dust Particle (for slingshot launch & ground impact)
    this.createCanvas(scene, 'part_dust', 16, 16, (ctx) => {
      const grad = ctx.createRadialGradient(8, 8, 2, 8, 8, 8);
      grad.addColorStop(0, 'rgba(217, 119, 6, 0.7)');
      grad.addColorStop(1, 'rgba(180, 83, 9, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(8, 8, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // 6. Impact Spark
    this.createCanvas(scene, 'part_spark', 12, 12, (ctx) => {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(8, 6);
      ctx.lineTo(12, 6);
      ctx.lineTo(8, 8);
      ctx.lineTo(10, 12);
      ctx.lineTo(6, 9);
      ctx.lineTo(2, 12);
      ctx.lineTo(4, 8);
      ctx.lineTo(0, 6);
      ctx.lineTo(4, 6);
      ctx.closePath();
      ctx.fill();
    });

    // 7. Comic Impact Badges
    const comicWords = [
      { key: 'comic_smash', text: 'SMASH!', color: '#ef4444', border: '#7f1d1d' },
      { key: 'comic_crash', text: 'CRASH!', color: '#f59e0b', border: '#78350f' },
      { key: 'comic_boom', text: 'BOOM!', color: '#dc2626', border: '#450a0a' },
      { key: 'comic_direct', text: 'DIRECT HIT!', color: '#10b981', border: '#064e3b' }
    ];

    comicWords.forEach((c) => {
      this.createCanvas(scene, c.key, 120, 36, (ctx, w, h) => {
        // Comic jagged badge
        ctx.fillStyle = c.color;
        ctx.beginPath();
        const numSpikes = 10;
        const cx = w / 2;
        const cy = h / 2;
        const rx = w / 2 - 4;
        const ry = h / 2 - 4;
        for (let i = 0; i < numSpikes; i++) {
          const a1 = (i / numSpikes) * Math.PI * 2;
          const a2 = ((i + 0.5) / numSpikes) * Math.PI * 2;
          const x1 = cx + Math.cos(a1) * rx;
          const y1 = cy + Math.sin(a1) * ry;
          const x2 = cx + Math.cos(a2) * (rx * 0.78);
          const y2 = cy + Math.sin(a2) * (ry * 0.78);
          if (i === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = c.border;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.strokeText(c.text, cx, cy);
        ctx.fillText(c.text, cx, cy);
      });
    });
  }
}
