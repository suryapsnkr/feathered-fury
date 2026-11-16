'use client';

import React, { useEffect, useState } from 'react';
import { X, Lock, Star, Play } from 'lucide-react';
import { GAME_LEVELS } from '../game/levels/levelData';

interface LevelSelectorProps {
  isOpen: boolean;
  currentLevelId: number;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export default function LevelSelector({
  isOpen,
  currentLevelId,
  onSelectLevel,
  onClose
}: LevelSelectorProps) {
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [levelStars, setLevelStars] = useState<{ [id: number]: number }>({});
  const [highScores, setHighScores] = useState<{ [id: number]: number }>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const unlocked = parseInt(localStorage.getItem('angry_birds_unlocked') || '1', 10);
    setUnlockedLevel(unlocked);

    const starsMap: { [id: number]: number } = {};
    const scoresMap: { [id: number]: number } = {};

    GAME_LEVELS.forEach((lvl) => {
      starsMap[lvl.id] = parseInt(localStorage.getItem(`angry_birds_stars_${lvl.id}`) || '0', 10);
      scoresMap[lvl.id] = parseInt(localStorage.getItem(`angry_birds_highscore_${lvl.id}`) || '0', 10);
    });

    setLevelStars(starsMap);
    setHighScores(scoresMap);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-cartoon text-2xl sm:text-3xl text-yellow-300 drop-shadow">
              Select Mission
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Choose your battlefield and defeat the invading pigs!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {GAME_LEVELS.map((lvl) => {
            const isUnlocked = lvl.id <= unlockedLevel;
            const isCurrent = lvl.id === currentLevelId;
            const stars = levelStars[lvl.id] || 0;
            const highScore = highScores[lvl.id] || 0;

            return (
              <div
                key={lvl.id}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectLevel(lvl.id);
                    onClose();
                  }
                }}
                className={`relative rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between border-2 ${
                  !isUnlocked
                    ? 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
                    : isCurrent
                    ? 'bg-amber-950/40 border-amber-400 shadow-lg shadow-amber-500/20 cursor-pointer hover:scale-105'
                    : 'bg-slate-800/80 border-slate-700 hover:border-amber-400/60 cursor-pointer hover:scale-105'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                      #{lvl.id}
                    </span>
                    {!isUnlocked ? (
                      <Lock className="w-4 h-4 text-slate-500" />
                    ) : (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="font-cartoon text-base text-white truncate">{lvl.name}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{lvl.subtitle}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Best:</span>
                  <span className="font-bold text-amber-300">
                    {highScore > 0 ? highScore.toLocaleString() : '-'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
