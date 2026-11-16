'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import GameHUD from '../components/GameHUD';
import ResultModal from '../components/ResultModal';
import LevelSelector from '../components/LevelSelector';
import HowToPlayModal from '../components/HowToPlayModal';
import SettingsModal from '../components/SettingsModal';
import MainMenu from '../components/MainMenu';
import PauseModal from '../components/PauseModal';
import GrandVictoryModal from '../components/GrandVictoryModal';
import { gameEvents } from '../game/events';
import { LevelData } from '../game/types';
import { GAME_LEVELS } from '../game/levels/levelData';
import { AudioSystem } from '../game/systems/AudioSystem';
import { Settings, Star, Home as HomeIcon } from 'lucide-react';

// Client-only dynamic import of Phaser canvas to avoid SSR errors
const GameCanvas = dynamic(() => import('../components/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/9] max-h-[78vh] rounded-2xl bg-slate-900 border-4 border-amber-400/80 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
      <span className="font-cartoon text-xl text-yellow-300">Loading Game Canvas...</span>
    </div>
  )
});

export default function Home() {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [currentLevelData, setCurrentLevelData] = useState<LevelData | null>(GAME_LEVELS[0]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  // Screen & Modal States
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isGrandVictoryOpen, setIsGrandVictoryOpen] = useState(false);
  const [isLevelSelectorOpen, setIsLevelSelectorOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [resultState, setResultState] = useState<{
    type: 'victory' | 'defeat' | null;
    score: number;
    stars?: number;
    birdsUnused?: number;
    birdBonus?: number;
    isHighScore?: boolean;
    reason?: string;
  }>({ type: null, score: 0 });

  // Load Stars & High Scores from localStorage
  useEffect(() => {
    refreshProgress();

    const unsubScore = gameEvents.on('SCORE_UPDATED', (data) => {
      setScore((prev) => prev + data.delta);
    });

    const unsubLevelLoaded = gameEvents.on('LEVEL_LOADED', (lvl) => {
      setCurrentLevelId(lvl.id);
      setCurrentLevelData(lvl);
      setScore(0);
      setResultState({ type: null, score: 0 });
      setIsPaused(false);
      setIsGrandVictoryOpen(false);
      if (typeof window !== 'undefined') {
        const best = parseInt(localStorage.getItem(`angry_birds_highscore_${lvl.id}`) || '0', 10);
        setHighScore(best);
      }
    });

    const unsubVictory = gameEvents.on('LEVEL_VICTORY', (result) => {
      if (result.levelId === 5) {
        setIsGrandVictoryOpen(true);
      } else {
        setResultState({
          type: 'victory',
          score: result.score,
          stars: result.stars,
          birdsUnused: result.birdsUnused,
          birdBonus: result.birdBonus,
          isHighScore: result.isHighScore
        });
      }
      refreshProgress();
    });

    const unsubDefeat = gameEvents.on('LEVEL_DEFEAT', (result) => {
      setResultState({
        type: 'defeat',
        score: result.score,
        reason: result.reason
      });
    });

    const unsubPause = gameEvents.on('TOGGLE_PAUSE', () => {
      handleTogglePause();
    });

    return () => {
      unsubScore();
      unsubLevelLoaded();
      unsubVictory();
      unsubDefeat();
      unsubPause();
    };
  }, []);

  const refreshProgress = () => {
    if (typeof window === 'undefined') return;
    let stars = 0;
    for (let i = 1; i <= 5; i++) {
      stars += parseInt(localStorage.getItem(`angry_birds_stars_${i}`) || '0', 10);
    }
    setTotalStars(stars);
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => {
      const next = !prev;
      const audio = AudioSystem.getInstance();
      if (next) {
        audio.playPause();
      } else {
        audio.playUnpause();
      }
      const phaserGame = (window as any).__PHASER_GAME__;
      if (phaserGame) {
        const activeScenes = phaserGame.scene.getScenes(true);
        if (activeScenes.length > 0) {
          if (next) {
            activeScenes[0].scene.pause();
          } else {
            activeScenes[0].scene.resume();
          }
        }
      }
      return next;
    });
  };

  const handleResume = () => {
    setIsPaused(false);
    const audio = AudioSystem.getInstance();
    audio.playUnpause();
    const phaserGame = (window as any).__PHASER_GAME__;
    if (phaserGame) {
      const activeScenes = phaserGame.scene.getScenes(true);
      if (activeScenes.length > 0) {
        activeScenes[0].scene.resume();
      }
    }
  };

  const handleRestart = () => {
    setResultState({ type: null, score: 0 });
    setIsPaused(false);
    setIsGrandVictoryOpen(false);
    setScore(0);
    const phaserGame = (window as any).__PHASER_GAME__;
    if (phaserGame) {
      const activeScenes = phaserGame.scene.getScenes(true);
      if (activeScenes.length > 0) {
        activeScenes[0].scene.restart({ levelId: currentLevelId });
      }
    }
  };

  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    setResultState({ type: null, score: 0 });
    setIsPaused(false);
    setIsGrandVictoryOpen(false);
    setIsMainMenuOpen(false);
    setScore(0);
    const phaserGame = (window as any).__PHASER_GAME__;
    if (phaserGame) {
      const activeScenes = phaserGame.scene.getScenes(true);
      if (activeScenes.length > 0) {
        activeScenes[0].scene.start('LevelScene', { levelId });
      }
    }
  };

  const handleNextLevel = () => {
    const nextId = Math.min(5, currentLevelId + 1);
    handleSelectLevel(nextId);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between p-2 sm:p-4 md:p-6 max-w-7xl mx-auto w-full relative">
      {/* Top Arcade Brand Header */}
      <header className="w-full flex items-center justify-between py-2 px-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-lg backdrop-blur-md mb-3 select-none">
        <div 
          onClick={() => setIsMainMenuOpen(true)}
          className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-2xl shadow-md border border-amber-300 transform -rotate-3 hover:rotate-0 transition-transform">
            🐦
          </div>
          <div>
            <h1 className="font-cartoon text-xl sm:text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 drop-shadow">
              FEATHERED FURY
            </h1>
            <p className="text-[10px] text-amber-200 uppercase tracking-widest font-black">
              2D Slingshot Physics
            </p>
          </div>
        </div>

        {/* Global Stars and Quick Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-cartoon text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{totalStars} / 15</span>
          </div>

          <button
            onClick={() => setIsMainMenuOpen(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Main Menu"
          >
            <HomeIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main HUD & Game Arena */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-3 w-full">
        <GameHUD
          currentLevel={currentLevelData}
          score={score}
          highScore={highScore}
          onRestart={handleRestart}
          onOpenLevelSelector={() => setIsLevelSelectorOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onTogglePause={handleTogglePause}
          onOpenMainMenu={() => setIsMainMenuOpen(true)}
        />

        {/* Client-Only Phaser Game Canvas */}
        <GameCanvas onLevelLoaded={(id) => setCurrentLevelId(id)} />
      </div>

      {/* Bottom Footer Controls Hint */}
      <footer className="mt-3 text-center text-xs text-slate-400 select-none">
        <p>
          Drag bird back from slingshot to aim • Release to launch • Tap in flight for Special Abilities • [Esc] Pause
        </p>
      </footer>

      {/* Main Menu / Title Screen */}
      <MainMenu
        isOpen={isMainMenuOpen}
        onPlay={() => setIsMainMenuOpen(false)}
        onOpenLevelSelector={() => {
          setIsMainMenuOpen(false);
          setIsLevelSelectorOpen(true);
        }}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalStars={totalStars}
      />

      {/* Pause Modal */}
      <PauseModal
        isOpen={isPaused}
        currentLevel={currentLevelData}
        score={score}
        onResume={handleResume}
        onRestart={handleRestart}
        onOpenLevelSelector={() => {
          setIsPaused(false);
          setIsLevelSelectorOpen(true);
        }}
        onOpenMainMenu={() => {
          setIsPaused(false);
          setIsMainMenuOpen(true);
        }}
      />

      {/* Level Result Modal (Levels 1-4 Victory & All Defeats) */}
      <ResultModal
        type={resultState.type}
        levelId={currentLevelId}
        score={resultState.score}
        stars={resultState.stars}
        birdsUnused={resultState.birdsUnused}
        birdBonus={resultState.birdBonus}
        isHighScore={resultState.isHighScore}
        reason={resultState.reason}
        onNextLevel={handleNextLevel}
        onRestart={handleRestart}
        onOpenLevelSelector={() => {
          setResultState({ type: null, score: 0 });
          setIsLevelSelectorOpen(true);
        }}
      />

      {/* Grand Campaign Finale Victory Modal (Level 5 Boss Complete) */}
      <GrandVictoryModal
        isOpen={isGrandVictoryOpen}
        score={score}
        stars={3}
        onPlayAgain={() => handleSelectLevel(1)}
        onOpenLevelSelector={() => {
          setIsGrandVictoryOpen(false);
          setIsLevelSelectorOpen(true);
        }}
      />

      {/* Level Selector Modal */}
      <LevelSelector
        isOpen={isLevelSelectorOpen}
        currentLevelId={currentLevelId}
        onSelectLevel={handleSelectLevel}
        onClose={() => setIsLevelSelectorOpen(false)}
      />

      {/* How to Play Tutorial Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onProgressReset={() => {
          refreshProgress();
          setHighScore(0);
        }}
      />
    </main>
  );
}
