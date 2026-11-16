/**
 * main.js - Phaser 3 game initialization and configuration.
 */

window.addEventListener('DOMContentLoaded', () => {
  const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
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
        gravity: { y: 1.1 },
        debug: false,
        enableSleeping: true,
        runner: {
          isFixed: true,
          fps: 60
        }
      }
    },
    scene: [BootScene, MenuScene, LevelSelectScene, GameScene]
  };

  window.game = new Phaser.Game(config);

  // Resume AudioContext on first user interaction anywhere
  const resumeAudio = () => {
    if (window.audioManager) {
      window.audioManager.resume();
    }
    window.removeEventListener('click', resumeAudio);
    window.removeEventListener('touchstart', resumeAudio);
    window.removeEventListener('keydown', resumeAudio);
  };

  window.addEventListener('click', resumeAudio);
  window.addEventListener('touchstart', resumeAudio);
  window.addEventListener('keydown', resumeAudio);
});
