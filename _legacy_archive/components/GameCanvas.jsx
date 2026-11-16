'use client';

import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, RotateCcw, Maximize2, Sparkles, HelpCircle } from 'lucide-react';
import { AchievementTracker } from '../lib/achievements';

export default function GameCanvas({ currentLevelId, onLevelChange }) {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadScriptSequential(src) {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          resolve();
          return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.async = false;
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.head.appendChild(s);
      });
    }

    async function bootstrap() {
      try {
        await loadScriptSequential('/phaser.min.js');
        await loadScriptSequential('/js/achievements.js');
        await loadScriptSequential('/js/audio.js');
        await loadScriptSequential('/js/textures.js');
        await loadScriptSequential('/js/levels.js');
        await loadScriptSequential('/js/uiScenes.js');
        await loadScriptSequential('/js/gameScene.js');

        if (!isCancelled) {
          initGame();
        }
      } catch (err) {
        console.error('Failed to load game scripts:', err);
      }
    }

    bootstrap();

    return () => {
      isCancelled = true;
      if (window.game) {
        window.game.destroy(true);
        window.game = null;
      }
    };
  }, []);

  const initGame = () => {
    if (window.game) {
      window.game.destroy(true);
    }

    const config = {
      type: window.Phaser.AUTO,
      width: 1280,
      height: 720,
      parent: 'phaser-game-container',
      backgroundColor: '#38bdf8',
      scale: {
        mode: window.Phaser.Scale.FIT,
        autoCenter: window.Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720
      },
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 1.1 },
          debug: false,
          enableSleeping: true
        }
      },
      scene: [window.BootScene, window.MenuScene, window.LevelSelectScene, window.GameScene]
    };

    window.AchievementTracker = AchievementTracker;
    window.game = new window.Phaser.Game(config);
    setIsReady(true);

    if (window.audioManager) {
      setIsMuted(window.audioManager.isMuted);
    }

    // Victory celebration confetti listener
    const handleVictory = () => {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    };

    window.addEventListener('angry_birds_victory', handleVictory);

    // Initial click audio resume
    const resumeAudio = () => {
      if (window.audioManager) {
        window.audioManager.resume();
      }
      window.removeEventListener('click', resumeAudio);
    };
    window.addEventListener('click', resumeAudio);
  };

  const handleRestart = () => {
    if (!window.game) return;
    const scene = window.game.scene.getScene('GameScene');
    if (scene && scene.scene.isActive()) {
      if (window.audioManager) window.audioManager.playButtonClick();
      scene.scene.restart();
    }
  };

  const handleToggleMute = () => {
    if (window.audioManager) {
      const next = window.audioManager.toggleMute();
      setIsMuted(next);
    }
  };

  const handleFullscreen = () => {
    const el = document.getElementById('phaser-game-container');
    if (!el) return;
    if (window.audioManager) window.audioManager.playButtonClick();
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto my-2 rounded-2xl overflow-hidden border-4 border-amber-950 bg-slate-950 shadow-[0_15px_35px_rgba(0,0,0,0.7)] ring-2 ring-amber-600/40">
      {/* Aspect Ratio Container (16:9) */}
      <div
        id="phaser-game-container"
        ref={containerRef}
        className="w-full aspect-video flex items-center justify-center bg-sky-400 overflow-hidden relative"
      >
        {!isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-sky-500 via-sky-600 to-blue-800 text-white z-20">
            <div className="text-6xl animate-bounce mb-3">🐦</div>
            <div className="w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mb-3 shadow-lg" />
            <div className="font-cartoon text-2xl text-yellow-300 tracking-wider drop-shadow-md">
              LOADING ANGRY BIRDS...
            </div>
            <div className="text-xs font-semibold text-sky-100 mt-1">
              Preparing physics engine and slingshots
            </div>
          </div>
        )}
      </div>

      {/* Floating Arcade Quick Action Controls Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-t-2 border-amber-950/60 text-xs">
        {/* Controls Pill Hint */}
        <div className="flex items-center space-x-2 py-1 text-slate-300">
          <span className="font-cartoon text-amber-400 text-xs tracking-wider bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
            CONTROLS
          </span>
          <span className="font-medium text-xs hidden sm:inline text-slate-300">
            🎯 Drag bird backward to aim &bull; ⚡ Click in flight for Special Power!
          </span>
          <span className="font-medium text-xs sm:hidden text-slate-300">
            🎯 Drag to launch &bull; ⚡ Tap for power
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 py-1">
          <button
            onClick={handleRestart}
            title="Restart Level [R]"
            className="arcade-btn arcade-btn-green px-3 py-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Restart</span>
          </button>

          <button
            onClick={handleToggleMute}
            title="Toggle Mute [M]"
            className={`arcade-btn px-3 py-1.5 text-xs ${
              isMuted ? 'arcade-btn-red' : 'arcade-btn-gold'
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 mr-1" />
                <span>Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 mr-1" />
                <span>Audio</span>
              </>
            )}
          </button>

          <button
            onClick={handleFullscreen}
            title="Toggle Fullscreen"
            className="arcade-btn arcade-btn-blue px-3 py-1.5 text-xs"
          >
            <Maximize2 className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
