'use client';

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, List, Home, Volume2, VolumeX, Pause } from 'lucide-react';
import { AudioSystem } from '../game/systems/AudioSystem';
import { LevelData } from '../game/types';

interface PauseModalProps {
  isOpen: boolean;
  currentLevel: LevelData | null;
  score: number;
  onResume: () => void;
  onRestart: () => void;
  onOpenLevelSelector: () => void;
  onOpenMainMenu: () => void;
}

export default function PauseModal({
  isOpen,
  currentLevel,
  score,
  onResume,
  onRestart,
  onOpenLevelSelector,
  onOpenMainMenu
}: PauseModalProps) {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = AudioSystem.getInstance();
    setIsMuted(audio.isMuted);
  }, [isOpen]);

  const handleToggleSound = () => {
    const audio = AudioSystem.getInstance();
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-center space-y-4">
        
        {/* Header Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-amber-300">
          <Pause className="w-7 h-7" />
        </div>

        <div>
          <h2 className="font-cartoon text-3xl text-yellow-300 drop-shadow">
            GAME PAUSED
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {currentLevel ? `Level ${currentLevel.id}: ${currentLevel.name}` : 'Paused'}
          </p>
        </div>

        {/* Score Tally */}
        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex justify-between items-center px-5">
          <span className="text-xs uppercase font-bold text-slate-400">Current Score</span>
          <span className="font-cartoon text-2xl text-amber-300">{score.toLocaleString()}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          {/* Resume */}
          <button
            onClick={onResume}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 border border-emerald-300 active:scale-95 transition-transform cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" /> Resume Game
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-transform cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" /> Restart Level
          </button>

          {/* Level Selector */}
          <button
            onClick={onOpenLevelSelector}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-transform cursor-pointer"
          >
            <List className="w-4 h-4 text-amber-400" /> Select Level
          </button>

          {/* Main Menu */}
          <button
            onClick={onOpenMainMenu}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-transform cursor-pointer"
          >
            <Home className="w-4 h-4 text-sky-400" /> Main Menu
          </button>
        </div>

        {/* Bottom Sound Toggle */}
        <div className="pt-2 border-t border-slate-800 flex justify-center">
          <button
            onClick={handleToggleSound}
            className="px-4 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-2 border border-slate-700"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'Sound: Muted' : 'Sound: Enabled'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
