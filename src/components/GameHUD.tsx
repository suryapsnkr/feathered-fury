'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, List, HelpCircle, Trophy, Sparkles, Zap, Pause, Home } from 'lucide-react';
import { gameEvents } from '../game/events';
import { BirdType, LevelData } from '../game/types';
import { AudioSystem } from '../game/systems/AudioSystem';

interface GameHUDProps {
  currentLevel: LevelData | null;
  score: number;
  highScore: number;
  onRestart: () => void;
  onOpenLevelSelector: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onTogglePause?: () => void;
  onOpenMainMenu?: () => void;
}

export default function GameHUD({
  currentLevel,
  score,
  highScore,
  onRestart,
  onOpenLevelSelector,
  onOpenHowToPlay,
  onOpenSettings,
  onTogglePause,
  onOpenMainMenu
}: GameHUDProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [abilityReadyBird, setAbilityReadyBird] = useState<BirdType | null>(null);
  const [remainingBirds, setRemainingBirds] = useState<BirdType[]>([]);
  const [displayedScore, setDisplayedScore] = useState(0);

  // Smooth rolling score number animation
  useEffect(() => {
    if (displayedScore === score) return;
    const diff = score - displayedScore;
    const step = Math.max(1, Math.ceil(Math.abs(diff) / 10));
    const timer = setTimeout(() => {
      setDisplayedScore((prev) => (prev < score ? Math.min(score, prev + step) : score));
    }, 20);
    return () => clearTimeout(timer);
  }, [score, displayedScore]);

  useEffect(() => {
    const audio = AudioSystem.getInstance();
    setIsMuted(audio.isMuted);

    const unsubLevel = gameEvents.on('LEVEL_LOADED', (lvl) => {
      setRemainingBirds([...lvl.birds]);
      setAbilityReadyBird(null);
    });

    const unsubAbility = gameEvents.on('BIRD_ABILITY_READY', (type, ready) => {
      setAbilityReadyBird(ready ? type : null);
    });

    const unsubAbilityUsed = gameEvents.on('BIRD_ABILITY_USED', () => {
      setAbilityReadyBird(null);
    });

    return () => {
      unsubLevel();
      unsubAbility();
      unsubAbilityUsed();
    };
  }, []);

  const handleToggleSound = () => {
    const audio = AudioSystem.getInstance();
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const handleTriggerAbility = () => {
    if (typeof window !== 'undefined') {
      const phaserGame = (window as any).__PHASER_GAME__;
      if (phaserGame) {
        const scenes = phaserGame.scene.getScenes(true);
        if (scenes.length > 0 && scenes[0].activeBird) {
          scenes[0].activeBird.activateAbility();
          scenes[0].activeSplitBirds?.forEach((b: any) => b.activateAbility());
        }
      }
    }
  };

  return (
    <div className="w-full flex flex-col space-y-2 select-none">
      {/* Top Arcade Status Bar */}
      <div className="w-full bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-white">
        {/* Left: Level Details & Bird Queue Mini Badges */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-md border border-amber-300">
            {currentLevel ? currentLevel.id : 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cartoon text-lg sm:text-xl text-yellow-300 drop-shadow">
                {currentLevel ? currentLevel.name : 'Loading...'}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Ammunition:</span>
              <div className="flex items-center gap-1">
                {remainingBirds.map((b, i) => (
                  <span
                    key={i}
                    title={`${b.toUpperCase()} BIRD`}
                    className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-black ${
                      b === 'yellow'
                        ? 'bg-yellow-400 text-slate-950 border border-yellow-200'
                        : b === 'blue'
                        ? 'bg-sky-400 text-white border border-sky-200'
                        : 'bg-red-500 text-white border border-red-300'
                    }`}
                  >
                    {b === 'yellow' ? '⚡' : b === 'blue' ? '❄' : '●'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Rolling Score & High Score */}
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400">Score</span>
            <span className="font-cartoon text-2xl sm:text-3xl text-white tracking-wide drop-shadow-md">
              {displayedScore.toLocaleString()}
            </span>
          </div>

          <div className="hidden sm:flex flex-col items-center border-l border-slate-700 pl-6">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Best
            </span>
            <span className="font-cartoon text-xl text-amber-200">
              {highScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right: Arcade Control Buttons with Hotkeys */}
        <div className="flex items-center space-x-2">
          {/* Pause */}
          {onTogglePause && (
            <button
              onClick={onTogglePause}
              title="Pause Game [Key: Esc]"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-md border border-slate-600 active:scale-95 transition-transform cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span className="hidden lg:inline text-[9px] opacity-70 bg-slate-900/60 px-1 py-0.2 rounded">[Esc]</span>
            </button>
          )}

          {/* Restart */}
          <button
            onClick={onRestart}
            title="Restart Level [Key: R]"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md border border-rose-400 active:scale-95 transition-transform cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Restart</span>
            <span className="hidden lg:inline text-[9px] opacity-70 bg-rose-800/60 px-1 py-0.2 rounded">[R]</span>
          </button>

          {/* Level Select */}
          <button
            onClick={onOpenLevelSelector}
            title="Select Level"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md border border-amber-300 active:scale-95 transition-transform cursor-pointer"
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">Levels</span>
          </button>

          {/* Main Menu Button */}
          {onOpenMainMenu && (
            <button
              onClick={onOpenMainMenu}
              title="Main Menu"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shadow-md border border-slate-600 active:scale-95 transition-transform cursor-pointer"
            >
              <Home className="w-4 h-4 text-sky-400" />
            </button>
          )}

          {/* How to Play */}
          <button
            onClick={onOpenHowToPlay}
            title="Instructions"
            className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-md border border-sky-400 active:scale-95 transition-transform cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Sound [Key: M]' : 'Mute Sound [Key: M]'}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white shadow-md border border-slate-600 active:scale-95 transition-transform cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Floating Active Ability Banner with Clickable Button */}
      {abilityReadyBird && (
        <div className="w-full flex justify-center animate-bounce z-20">
          <button
            onClick={handleTriggerAbility}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 hover:brightness-110 text-white font-black text-sm tracking-wide shadow-2xl border-2 border-yellow-200 flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
            <span>
              {abilityReadyBird === 'yellow'
                ? '⚡ TAP HERE OR SCREEN FOR CHUCK SPEED BOOST! [SPACE]'
                : '⚡ TAP HERE OR SCREEN TO SPLIT INTO 3 BIRDS! [SPACE]'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
