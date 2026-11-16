import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { LevelScene } from './scenes/LevelScene';

export function createGameConfig(containerId: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: containerId,
    width: 1280,
    height: 720,
    backgroundColor: '#38bdf8',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 720
    },
    physics: {
      default: 'matter',
      matter: {
        gravity: { y: 1.1, x: 0 },
        debug: false,
        enableSleeping: true
      }
    },
    scene: [BootScene, LevelScene]
  };
}
