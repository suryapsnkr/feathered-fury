/**
 * TextureGenerator - Generates all game sprites, blocks, characters,
 * backgrounds, and particles procedurally on HTML5 Canvases.
 * Completely standalone, no external image files required.
 */
class TextureGenerator {
  static generateAll(scene) {
    if (scene.textures.exists('bird_red')) {
      return; // Already generated
    }

    this.generateBirds(scene);
    this.generatePigs(scene);
    this.generateBlocks(scene);
    this.generateSlingshot(scene);
    this.generateEnvironment(scene);
    this.generateParticles(scene);
    this.generateUI(scene);
  }

  // Helper to create and register canvas texture
  static createCanvas(scene, key, width, height, drawFn) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    drawFn(ctx, width, height);
    scene.textures.addCanvas(key, canvas);
  }

  // --- BIRDS ---
  static generateBirds(scene) {
    // 1. Red Bird (Normal & Blink)
    [false, true].forEach(blink => {
      const key = blink ? 'bird_red_blink' : 'bird_red';
      this.createCanvas(scene, key, 52, 52, (ctx, w, h) => {
        const cx = 26, cy = 28;

        // Tail feathers (3 black spikes)
        ctx.fillStyle = '#222';
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

        // Head feathers (2 red crest feathers)
        ctx.fillStyle = '#d32f2f';
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
        grad.addColorStop(0, '#ff4d4d');
        grad.addColorStop(0.7, '#e52525');
        grad.addColorStop(1, '#ab1212');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#6a0a0a';
        ctx.stroke();

        // Belly (cream patch)
        ctx.fillStyle = '#fff4e0';
        ctx.beginPath();
        ctx.ellipse(cx + 3, cy + 9, 12, 8, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        const eyeY = cy - 4;
        if (blink) {
          ctx.strokeStyle = '#222';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(cx + 2, eyeY, 5, 0.2, Math.PI - 0.2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx + 12, eyeY, 5, 0.2, Math.PI - 0.2);
          ctx.stroke();
        } else {
          // Eye whites
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + 2, eyeY, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx + 12, eyeY, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Pupils looking right
          ctx.fillStyle = '#111111';
          ctx.beginPath();
          ctx.arc(cx + 4, eyeY, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx + 14, eyeY, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Highlights
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + 4.8, eyeY - 1, 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx + 14.8, eyeY - 1, 1, 0, Math.PI * 2);
          ctx.fill();
        }

        // Angry Eyebrows (thick black slanted V)
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.moveTo(cx - 4, eyeY - 9);
        ctx.lineTo(cx + 7, eyeY - 5);
        ctx.lineTo(cx + 18, eyeY - 9);
        ctx.lineTo(cx + 18, eyeY - 6);
        ctx.lineTo(cx + 7, eyeY - 3);
        ctx.lineTo(cx - 4, eyeY - 6);
        ctx.closePath();
        ctx.fill();

        // Beak (sharp orange triangle with top/bottom split)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(cx + 5, cy);
        ctx.lineTo(cx + 22, cy + 3);
        ctx.lineTo(cx + 6, cy + 8);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(cx + 6, cy + 1);
        ctx.lineTo(cx + 20, cy + 3);
        ctx.lineTo(cx + 6, cy + 4);
        ctx.closePath();
        ctx.fill();
      });
    });

    // 2. Yellow Bird (Chuck - Triangular Speedster)
    [false, true].forEach(blink => {
      const key = blink ? 'bird_yellow_blink' : 'bird_yellow';
      this.createCanvas(scene, key, 54, 54, (ctx, w, h) => {
        const cx = 26, cy = 30;

        // Tail feathers
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.moveTo(cx - 16, cy + 4);
        ctx.lineTo(cx - 28, cy);
        ctx.lineTo(cx - 22, cy + 6);
        ctx.lineTo(cx - 30, cy + 10);
        ctx.lineTo(cx - 16, cy + 10);
        ctx.closePath();
        ctx.fill();

        // Spiky black crest
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy - 14);
        ctx.lineTo(cx - 18, cy - 28);
        ctx.lineTo(cx - 8, cy - 20);
        ctx.lineTo(cx - 12, cy - 32);
        ctx.lineTo(cx - 4, cy - 18);
        ctx.closePath();
        ctx.fill();

        // Triangular body
        const grad = ctx.createLinearGradient(cx - 14, cy - 22, cx + 18, cy + 14);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.5, '#facc15');
        grad.addColorStop(1, '#ca8a04');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx + 18, cy - 4);
        ctx.lineTo(cx - 14, cy - 18);
        ctx.quadraticCurveTo(cx - 16, cy, cx - 14, cy + 16);
        ctx.lineTo(cx + 8, cy + 16);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#854d0e';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Belly
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(cx - 2, cy + 10, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        const eyeY = cy - 4;
        if (blink) {
          ctx.strokeStyle = '#222';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx + 2, eyeY, 4.5, 0.2, Math.PI - 0.2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx + 11, eyeY, 4.5, 0.2, Math.PI - 0.2);
          ctx.stroke();
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + 2, eyeY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx + 11, eyeY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#111';
          ctx.beginPath();
          ctx.arc(cx + 4, eyeY, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx + 13, eyeY, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Eyebrows
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.moveTo(cx - 2, eyeY - 7);
        ctx.lineTo(cx + 7, eyeY - 4);
        ctx.lineTo(cx + 16, eyeY - 7);
        ctx.lineTo(cx + 16, eyeY - 5);
        ctx.lineTo(cx - 2, eyeY - 5);
        ctx.closePath();
        ctx.fill();

        // Long Sharp Beak
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(cx + 6, cy - 2);
        ctx.lineTo(cx + 26, cy + 2);
        ctx.lineTo(cx + 6, cy + 7);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#9a3412';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });

    // 3. Blue Bird (The Blues - Cute Splitter)
    [false, true].forEach(blink => {
      const key = blink ? 'bird_blue_blink' : 'bird_blue';
      this.createCanvas(scene, key, 38, 38, (ctx, w, h) => {
        const cx = 19, cy = 20;

        // Small tail
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.moveTo(cx - 12, cy);
        ctx.lineTo(cx - 18, cy - 3);
        ctx.lineTo(cx - 14, cy + 2);
        ctx.lineTo(cx - 18, cy + 5);
        ctx.lineTo(cx - 11, cy + 4);
        ctx.closePath();
        ctx.fill();

        // Body gradient (vibrant cyan/blue)
        const grad = ctx.createRadialGradient(cx - 2, cy - 3, 2, cx, cy, 14);
        grad.addColorStop(0, '#67e8f9');
        grad.addColorStop(0.5, '#06b6d4');
        grad.addColorStop(1, '#0284c7');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0369a1';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Belly
        ctx.fillStyle = '#cffafe';
        ctx.beginPath();
        ctx.ellipse(cx + 1, cy + 6, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pink eye patches
        ctx.fillStyle = 'rgba(244, 114, 182, 0.5)';
        ctx.beginPath();
        ctx.arc(cx - 1, cy - 2, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + 7, cy - 2, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        const eyeY = cy - 2;
        if (blink) {
          ctx.strokeStyle = '#222';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(cx - 1, eyeY, 3.5, 0.2, Math.PI - 0.2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx + 7, eyeY, 3.5, 0.2, Math.PI - 0.2);
          ctx.stroke();
        } else {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(cx - 1, eyeY, 3.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx + 7, eyeY, 3.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#111';
          ctx.beginPath();
          ctx.arc(cx + 0.5, eyeY, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx + 8.5, eyeY, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Beak
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(cx + 3, cy);
        ctx.lineTo(cx + 14, cy + 2);
        ctx.lineTo(cx + 3, cy + 5);
        ctx.closePath();
        ctx.fill();
      });
    });
  }

  // --- PIGS ---
  static generatePigs(scene) {
    // 1. Basic Minion Pig
    this.createCanvas(scene, 'pig_basic', 50, 50, (ctx, w, h) => {
      this.drawPigBase(ctx, 25, 26, 20);
    });

    // Pig Hurt State
    this.createCanvas(scene, 'pig_hurt', 50, 50, (ctx, w, h) => {
      this.drawPigBase(ctx, 25, 26, 20, { hurt: true });
    });

    // 2. Helmet Pig (Corporal Pig)
    this.createCanvas(scene, 'pig_helmet', 52, 54, (ctx, w, h) => {
      const cx = 26, cy = 30;
      this.drawPigBase(ctx, cx, cy, 19);

      // Military Helmet
      const hGrad = ctx.createLinearGradient(cx - 20, cy - 26, cx + 20, cy - 8);
      hGrad.addColorStop(0, '#94a3b8');
      hGrad.addColorStop(0.5, '#64748b');
      hGrad.addColorStop(1, '#334155');
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.arc(cx, cy - 6, 20, Math.PI * 0.95, Math.PI * 2.05);
      ctx.lineTo(cx + 21, cy - 4);
      ctx.lineTo(cx - 21, cy - 4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Helmet Rim
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 4, 21, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rivets & Chin strap
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(cx - 14, cy - 10, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 14, cy - 10, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Chin strap
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy + 12, 14, 0.4, Math.PI - 0.4);
      ctx.stroke();
    });

    // 3. King Pig
    this.createCanvas(scene, 'pig_king', 64, 66, (ctx, w, h) => {
      const cx = 32, cy = 38;
      this.drawPigBase(ctx, cx, cy, 24, { king: true });

      // Golden Crown
      const cGrad = ctx.createLinearGradient(cx - 18, cy - 36, cx + 18, cy - 20);
      cGrad.addColorStop(0, '#fef08a');
      cGrad.addColorStop(0.5, '#eab308');
      cGrad.addColorStop(1, '#a16207');
      ctx.fillStyle = cGrad;

      ctx.beginPath();
      ctx.moveTo(cx - 16, cy - 20);
      ctx.lineTo(cx - 16, cy - 32);
      ctx.lineTo(cx - 8, cy - 25);
      ctx.lineTo(cx, cy - 36);
      ctx.lineTo(cx + 8, cy - 25);
      ctx.lineTo(cx + 16, cy - 32);
      ctx.lineTo(cx + 16, cy - 20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Crown Jewels
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy - 24, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(cx - 10, cy - 22, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 10, cy - 22, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  static drawPigBase(ctx, cx, cy, r, opts = {}) {
    // Ears
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(cx - r * 0.75, cy - r * 0.7, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + r * 0.75, cy - r * 0.7, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner ear
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(cx - r * 0.75, cy - r * 0.7, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + r * 0.75, cy - r * 0.7, r * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Body sphere with gradient
    const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.2, cx, cy, r);
    grad.addColorStop(0, '#86efac');
    grad.addColorStop(0.5, '#4ade80');
    grad.addColorStop(1, '#16a34a');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cheeks
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.beginPath();
    ctx.arc(cx - r * 0.6, cy + r * 0.2, r * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + r * 0.6, cy + r * 0.2, r * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    const eyeY = cy - r * 0.25;
    if (opts.hurt) {
      // Swirl / bruised eyes
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 10, eyeY - 4);
      ctx.lineTo(cx - 2, eyeY + 4);
      ctx.moveTo(cx - 2, eyeY - 4);
      ctx.lineTo(cx - 10, eyeY + 4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 2, eyeY - 4);
      ctx.lineTo(cx + 10, eyeY + 4);
      ctx.moveTo(cx + 10, eyeY - 4);
      ctx.lineTo(cx + 2, eyeY + 4);
      ctx.stroke();

      // Band-aid on head
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.rect(cx - 12, cy - r * 0.7, 10, 4);
      ctx.fill();
    } else {
      // Goofy mismatched eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - r * 0.35, eyeY, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx + r * 0.35, eyeY, r * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pupils looking at slingshot (left)
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(cx - r * 0.42, eyeY, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + r * 0.28, eyeY, r * 0.11, 0, Math.PI * 2);
      ctx.fill();
    }

    // Snout
    const sGrad = ctx.createLinearGradient(cx - r * 0.45, cy, cx + r * 0.45, cy + r * 0.5);
    sGrad.addColorStop(0, '#4ade80');
    sGrad.addColorStop(1, '#22c55e');
    ctx.fillStyle = sGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.18, r * 0.42, r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Nostrils
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.18, cy + r * 0.18, r * 0.12, r * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.18, cy + r * 0.18, r * 0.12, r * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Smile / smirk
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.55, r * 0.22, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  // --- BLOCKS & MATERIALS ---
  static generateBlocks(scene) {
    // 1. Wood Plank Horizontal (140 x 24)
    this.createCanvas(scene, 'wood_plank_h', 140, 24, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#d97706');
      grad.addColorStop(0.5, '#b45309');
      grad.addColorStop(1, '#92400e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Wood grain lines
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.4)';
      ctx.lineWidth = 1.2;
      for (let y = 5; y < h; y += 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(w * 0.3, y + 2, w * 0.7, y - 2, w, y + 1);
        ctx.stroke();
      }

      // Border & Screws
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

      // Screws on both ends
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(10, h / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w - 10, h / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Wood Plank Vertical (24 x 140)
    this.createCanvas(scene, 'wood_plank_v', 24, 140, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#d97706');
      grad.addColorStop(0.5, '#b45309');
      grad.addColorStop(1, '#92400e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(120, 53, 15, 0.4)';
      ctx.lineWidth = 1.2;
      for (let x = 5; x < w; x += 5) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x + 2, h * 0.3, x - 2, h * 0.7, x + 1, h);
        ctx.stroke();
      }

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(w / 2, 10, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w / 2, h - 10, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Wood Block (40 x 40)
    this.createCanvas(scene, 'wood_block', 40, 40, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(1, '#b45309');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Inner bevel square
      ctx.fillStyle = 'rgba(254, 243, 199, 0.2)';
      ctx.fillRect(4, 4, w - 8, 4);
      ctx.fillStyle = 'rgba(69, 26, 3, 0.3)';
      ctx.fillRect(4, h - 8, w - 8, 4);

      // Cross grain
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.3)';
      ctx.beginPath();
      ctx.moveTo(4, 4);
      ctx.lineTo(w - 4, h - 4);
      ctx.moveTo(w - 4, 4);
      ctx.lineTo(4, h - 4);
      ctx.stroke();

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);

      // 4 Corner bolts
      ctx.fillStyle = '#451a03';
      [ [6, 6], [w - 6, 6], [6, h - 6], [w - 6, h - 6] ].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // 4. Stone Plank Horizontal (140 x 26)
    this.createCanvas(scene, 'stone_plank_h', 140, 26, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.5, '#64748b');
      grad.addColorStop(1, '#475569');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Mottled stone flecks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let i = 0; i < 40; i++) {
        const rx = Math.random() * w, ry = Math.random() * h;
        ctx.fillRect(rx, ry, 2, 2);
      }
      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
      for (let i = 0; i < 40; i++) {
        const rx = Math.random() * w, ry = Math.random() * h;
        ctx.fillRect(rx, ry, 2, 2);
      }

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });

    // 5. Stone Plank Vertical (26 x 140)
    this.createCanvas(scene, 'stone_plank_v', 26, 140, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.5, '#64748b');
      grad.addColorStop(1, '#475569');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let i = 0; i < 40; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }
      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
      for (let i = 0; i < 40; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });

    // 6. Stone Block (40 x 40)
    this.createCanvas(scene, 'stone_block', 40, 40, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#cbd5e1');
      grad.addColorStop(0.5, '#94a3b8');
      grad.addColorStop(1, '#475569');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Chiseled border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(2, h - 2);
      ctx.lineTo(2, 2);
      ctx.lineTo(w - 2, 2);
      ctx.stroke();

      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(w - 2, 2);
      ctx.lineTo(w - 2, h - 2);
      ctx.lineTo(2, h - 2);
      ctx.stroke();

      // Stone noise
      ctx.fillStyle = 'rgba(30, 41, 59, 0.25)';
      ctx.fillRect(10, 12, 3, 3);
      ctx.fillRect(25, 28, 4, 2);
      ctx.fillRect(18, 22, 2, 4);
    });

    // 7. Glass Plank Horizontal (140 x 20)
    this.createCanvas(scene, 'glass_plank_h', 140, 20, (ctx, w, h) => {
      ctx.fillStyle = 'rgba(165, 243, 252, 0.45)';
      ctx.fillRect(0, 0, w, h);

      // Diagonal shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(35, 0);
      ctx.lineTo(15, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(80, 0);
      ctx.lineTo(100, 0);
      ctx.lineTo(80, h);
      ctx.lineTo(60, h);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });

    // 8. Glass Plank Vertical (20 x 140)
    this.createCanvas(scene, 'glass_plank_v', 20, 140, (ctx, w, h) => {
      ctx.fillStyle = 'rgba(165, 243, 252, 0.45)';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(w, 40);
      ctx.lineTo(w, 55);
      ctx.lineTo(0, 35);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });

    // 9. Glass Block (40 x 40)
    this.createCanvas(scene, 'glass_block', 40, 40, (ctx, w, h) => {
      ctx.fillStyle = 'rgba(186, 230, 253, 0.5)';
      ctx.fillRect(0, 0, w, h);

      // Ice/glass reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.moveTo(6, 4);
      ctx.lineTo(24, 4);
      ctx.lineTo(4, 24);
      ctx.lineTo(4, 6);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(14, 165, 233, 0.8)';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(1, 1, w - 2, h - 2);
    });

    // 10. TNT Box (44 x 44)
    this.createCanvas(scene, 'tnt_box', 44, 44, (ctx, w, h) => {
      // Red wood crate
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#ef4444');
      grad.addColorStop(1, '#b91c1c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Yellow hazard band
      ctx.fillStyle = '#facc15';
      ctx.fillRect(0, 14, w, 16);

      // "TNT" bold text
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 15px Arial Black, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TNT', w / 2, h / 2);

      // Border and metal corners
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);

      // Screws
      ctx.fillStyle = '#fef08a';
      [ [4, 4], [w - 4, 4], [4, h - 4], [w - 4, h - 4] ].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // 11. Cracks Overlay 1 & 2
    this.createCanvas(scene, 'crack_1', 40, 40, (ctx, w, h) => {
      ctx.strokeStyle = 'rgba(30, 20, 10, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(8, 6);
      ctx.lineTo(20, 18);
      ctx.lineTo(16, 28);
      ctx.moveTo(20, 18);
      ctx.lineTo(32, 22);
      ctx.stroke();
    });

    this.createCanvas(scene, 'crack_2', 40, 40, (ctx, w, h) => {
      ctx.strokeStyle = 'rgba(20, 10, 5, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(4, 10);
      ctx.lineTo(18, 16);
      ctx.lineTo(14, 34);
      ctx.moveTo(18, 16);
      ctx.lineTo(28, 12);
      ctx.lineTo(36, 26);
      ctx.moveTo(18, 16);
      ctx.lineTo(24, 28);
      ctx.lineTo(34, 36);
      ctx.stroke();
    });
  }

  // --- SLINGSHOT ---
  static generateSlingshot(scene) {
    // Slingshot Base & Back Fork
    this.createCanvas(scene, 'slingshot_base', 70, 150, (ctx, w, h) => {
      const cx = 35;
      // Sturdy wooden post
      const grad = ctx.createLinearGradient(cx - 20, 0, cx + 20, 0);
      grad.addColorStop(0, '#92400e');
      grad.addColorStop(0.4, '#b45309');
      grad.addColorStop(1, '#78350f');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(cx - 14, h);
      ctx.lineTo(cx - 10, h - 70);
      ctx.lineTo(cx - 24, 18); // Left prong
      ctx.arc(cx - 20, 14, 5, Math.PI, 0);
      ctx.lineTo(cx - 8, h - 85);
      ctx.lineTo(cx + 8, h - 85);
      ctx.lineTo(cx + 20, 14); // Right prong
      ctx.arc(cx + 24, 18, 5, Math.PI, 0);
      ctx.lineTo(cx + 10, h - 70);
      ctx.lineTo(cx + 14, h);
      ctx.closePath();
      ctx.fill();

      // Wood bark grooves
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.strokeStyle = 'rgba(69, 26, 3, 0.4)';
      ctx.lineWidth = 1.2;
      for (let y = h - 60; y > 30; y -= 16) {
        ctx.beginPath();
        ctx.arc(cx, y, 8, 0, Math.PI);
        ctx.stroke();
      }
    });

    // Slingshot Front Fork (for 3D layering over the bird)
    this.createCanvas(scene, 'slingshot_front', 70, 150, (ctx, w, h) => {
      const cx = 35;
      const grad = ctx.createLinearGradient(cx, 0, cx + 25, 0);
      grad.addColorStop(0, '#b45309');
      grad.addColorStop(1, '#78350f');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(cx + 8, h - 85);
      ctx.lineTo(cx + 20, 14);
      ctx.arc(cx + 24, 18, 5, Math.PI, 0);
      ctx.lineTo(cx + 10, h - 70);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.8;
      ctx.stroke();
    });
  }

  // --- ENVIRONMENT & BACKGROUNDS ---
  static generateEnvironment(scene) {
    // 1. Sky Gradient (1280 x 720)
    this.createCanvas(scene, 'bg_sky', 1280, 720, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#38bdf8');   // Vivid Sky Blue
      grad.addColorStop(0.55, '#7dd3fc');
      grad.addColorStop(0.85, '#bae6fd');
      grad.addColorStop(1, '#fef08a');   // Warm sunny horizon
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle Sun glow top right
      const sGrad = ctx.createRadialGradient(980, 140, 10, 980, 140, 160);
      sGrad.addColorStop(0, 'rgba(254, 240, 138, 0.8)');
      sGrad.addColorStop(0.4, 'rgba(253, 224, 71, 0.35)');
      sGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(980, 140, 160, 0, Math.PI * 2);
      ctx.fill();

      // Golden Sun disc
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(980, 140, 42, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Cartoon Fluffy Cloud (160 x 80)
    this.createCanvas(scene, 'bg_cloud', 160, 80, (ctx, w, h) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(45, 50, 26, 0, Math.PI * 2);
      ctx.arc(80, 36, 32, 0, Math.PI * 2);
      ctx.arc(115, 48, 24, 0, Math.PI * 2);
      ctx.arc(60, 56, 20, 0, Math.PI * 2);
      ctx.arc(100, 56, 20, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    });

    // 3. Distant Mountains (1280 x 260)
    this.createCanvas(scene, 'bg_mountains', 1280, 260, (ctx, w, h) => {
      ctx.fillStyle = '#93c5fd';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, 140);
      ctx.lineTo(160, 40);
      ctx.lineTo(340, 180);
      ctx.lineTo(520, 60);
      ctx.lineTo(720, 160);
      ctx.lineTo(920, 30);
      ctx.lineTo(1120, 150);
      ctx.lineTo(1280, 80);
      ctx.lineTo(1280, h);
      ctx.closePath();
      ctx.fill();

      // Snow peaks
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.moveTo(160, 40);
      ctx.lineTo(190, 75);
      ctx.lineTo(130, 75);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(520, 60);
      ctx.lineTo(550, 95);
      ctx.lineTo(490, 95);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(920, 30);
      ctx.lineTo(955, 70);
      ctx.lineTo(885, 70);
      ctx.closePath();
      ctx.fill();
    });

    // 4. Rolling Green Hills (1280 x 200)
    this.createCanvas(scene, 'bg_hills', 1280, 200, (ctx, w, h) => {
      // Back darker hill
      ctx.fillStyle = '#65a30d';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.quadraticCurveTo(300, 40, 650, 110);
      ctx.quadraticCurveTo(950, 160, 1280, 80);
      ctx.lineTo(1280, h);
      ctx.closePath();
      ctx.fill();

      // Front vibrant hill
      ctx.fillStyle = '#84cc16';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.quadraticCurveTo(380, 80, 780, 120);
      ctx.quadraticCurveTo(1050, 60, 1280, 140);
      ctx.lineTo(1280, h);
      ctx.closePath();
      ctx.fill();

      // Cute little trees on hills
      const drawTree = (tx, ty, scale = 1) => {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(tx - 3 * scale, ty, 6 * scale, 16 * scale);
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(tx, ty - 6 * scale, 14 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(tx - 3 * scale, ty - 9 * scale, 9 * scale, 0, Math.PI * 2);
        ctx.fill();
      };

      drawTree(220, 115, 0.9);
      drawTree(480, 130, 0.8);
      drawTree(880, 120, 1.1);
      drawTree(1140, 135, 0.85);
    });

    // 5. Ground Slab (1280 x 140)
    this.createCanvas(scene, 'ground', 1280, 140, (ctx, w, h) => {
      // Dirt soil gradient
      const dGrad = ctx.createLinearGradient(0, 24, 0, h);
      dGrad.addColorStop(0, '#78350f');
      dGrad.addColorStop(0.3, '#58240c');
      dGrad.addColorStop(1, '#3b1606');
      ctx.fillStyle = dGrad;
      ctx.fillRect(0, 20, w, h - 20);

      // Embedded rocks in soil
      ctx.fillStyle = '#713f12';
      for (let i = 0; i < 60; i++) {
        const rx = (i * 37) % w;
        const ry = 40 + (i * 23) % (h - 55);
        ctx.beginPath();
        ctx.ellipse(rx, ry, 6 + (i % 5), 4 + (i % 3), 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Top Lush Grass Layer
      ctx.fillStyle = '#65a30d';
      ctx.fillRect(0, 8, w, 14);

      ctx.fillStyle = '#84cc16';
      ctx.beginPath();
      ctx.moveTo(0, 16);
      for (let x = 0; x < w; x += 12) {
        ctx.lineTo(x + 6, 0);
        ctx.lineTo(x + 12, 16);
      }
      ctx.lineTo(w, 20);
      ctx.lineTo(0, 20);
      ctx.closePath();
      ctx.fill();

      // Highlight grass tips
      ctx.fillStyle = '#bef264';
      for (let x = 0; x < w; x += 12) {
        ctx.fillRect(x + 5, 0, 2, 6);
      }
    });
  }

  // --- PARTICLES & VFX ---
  static generateParticles(scene) {
    // 1. Wood Splinter
    this.createCanvas(scene, 'particle_wood', 12, 12, (ctx, w, h) => {
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(1, 6);
      ctx.lineTo(6, 1);
      ctx.lineTo(11, 6);
      ctx.lineTo(6, 11);
      ctx.closePath();
      ctx.fill();
    });

    // 2. Stone Chip
    this.createCanvas(scene, 'particle_stone', 12, 12, (ctx, w, h) => {
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(2, 2);
      ctx.lineTo(10, 3);
      ctx.lineTo(8, 10);
      ctx.lineTo(1, 8);
      ctx.closePath();
      ctx.fill();
    });

    // 3. Glass Shard
    this.createCanvas(scene, 'particle_glass', 12, 12, (ctx, w, h) => {
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(12, 6);
      ctx.lineTo(6, 12);
      ctx.lineTo(0, 6);
      ctx.closePath();
      ctx.fill();
    });

    // 4. Smoke Puff
    this.createCanvas(scene, 'particle_smoke', 24, 24, (ctx, w, h) => {
      const grad = ctx.createRadialGradient(12, 12, 2, 12, 12, 11);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      grad.addColorStop(0.7, 'rgba(241, 245, 249, 0.7)');
      grad.addColorStop(1, 'rgba(226, 232, 240, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(12, 12, 11, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Feathers
    ['red', 'yellow', 'blue'].forEach(color => {
      const colMap = { red: '#ef4444', yellow: '#facc15', blue: '#06b6d4' };
      this.createCanvas(scene, `particle_feather_${color}`, 14, 18, (ctx, w, h) => {
        ctx.fillStyle = colMap[color];
        ctx.beginPath();
        ctx.ellipse(7, 9, 4, 8, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(7, 2);
        ctx.lineTo(7, 16);
        ctx.stroke();
      });
    });

    // 6. Golden Star
    this.createCanvas(scene, 'particle_star', 28, 28, (ctx, w, h) => {
      this.drawStar(ctx, 14, 14, 5, 12, 5.5, '#facc15', '#ca8a04');
    });

    // 7. Trajectory Dots
    this.createCanvas(scene, 'trajectory_dot', 12, 12, (ctx, w, h) => {
      const grad = ctx.createRadialGradient(6, 6, 1, 6, 6, 5);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.8, '#fef08a');
      grad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(6, 6, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    this.createCanvas(scene, 'past_trajectory_dot', 8, 8, (ctx, w, h) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(4, 4, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // --- UI ICONS & STARS ---
  static generateUI(scene) {
    // Empty Star (for UI score dialogs)
    this.createCanvas(scene, 'ui_star_empty', 56, 56, (ctx, w, h) => {
      this.drawStar(ctx, 28, 28, 5, 24, 11, '#475569', '#1e293b');
    });

    // Filled Golden Star
    this.createCanvas(scene, 'ui_star_filled', 56, 56, (ctx, w, h) => {
      this.drawStar(ctx, 28, 28, 5, 24, 11, '#facc15', '#ca8a04');
      // Sparkle highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(22, 18, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Pause Icon
    this.createCanvas(scene, 'ui_icon_pause', 36, 36, (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(10, 8, 5, 20, 2);
        ctx.roundRect(21, 8, 5, 20, 2);
        ctx.fill();
      } else {
        ctx.fillRect(10, 8, 5, 20);
        ctx.fillRect(21, 8, 5, 20);
      }
    });

    // Restart Icon
    this.createCanvas(scene, 'ui_icon_restart', 36, 36, (ctx, w, h) => {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(18, 18, 9, 0.4, Math.PI * 1.7);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(17, 7);
      ctx.lineTo(24, 8);
      ctx.lineTo(20, 14);
      ctx.closePath();
      ctx.fill();
    });

    // Sound On Icon
    this.createCanvas(scene, 'ui_icon_sound_on', 36, 36, (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(8, 13);
      ctx.lineTo(13, 13);
      ctx.lineTo(19, 8);
      ctx.lineTo(19, 28);
      ctx.lineTo(13, 23);
      ctx.lineTo(8, 23);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(19, 18, 6, -0.6, 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(19, 18, 11, -0.7, 0.7);
      ctx.stroke();
    });

    // Sound Off Icon
    this.createCanvas(scene, 'ui_icon_sound_off', 36, 36, (ctx, w, h) => {
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(8, 13);
      ctx.lineTo(13, 13);
      ctx.lineTo(19, 8);
      ctx.lineTo(19, 28);
      ctx.lineTo(13, 23);
      ctx.lineTo(8, 23);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(22, 12);
      ctx.lineTo(30, 24);
      ctx.moveTo(30, 12);
      ctx.lineTo(22, 24);
      ctx.stroke();
    });

    // 3D Circle Button Backing
    this.createCanvas(scene, 'ui_btn_circle', 48, 48, (ctx, w, h) => {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(24, 25, 22, 0, Math.PI * 2);
      ctx.fill();
      const grad = ctx.createLinearGradient(0, 4, 0, 44);
      grad.addColorStop(0, '#334155');
      grad.addColorStop(0.5, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(24, 23, 21, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(24, 23, 20, Math.PI * 0.8, Math.PI * 2.2);
      ctx.stroke();
    });
  }

  static drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, fill, stroke) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}

if (typeof window !== 'undefined') { window.TextureGenerator = TextureGenerator; }
