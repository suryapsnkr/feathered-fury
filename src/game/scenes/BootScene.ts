import Phaser from 'phaser';
import { TextureGenerator } from '../systems/TextureGenerator';
import { AudioSystem } from '../systems/AudioSystem';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Generate all procedural canvas textures
    TextureGenerator.generateAll(this);
  }

  create(): void {
    // Pre-initialize audio system
    AudioSystem.getInstance();

    // Transition into first level
    this.scene.start('LevelScene', { levelId: 1 });
  }
}
