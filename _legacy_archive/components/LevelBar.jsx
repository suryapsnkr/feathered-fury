'use client';

import React from 'react';
import { Star, Lock, Trophy, Play } from 'lucide-react';

export default function LevelBar({ levels, currentLevelId, onSelectLevel, unlockedLevel }) {
  return (
    <div className="w-full max-w-6xl mx-auto my-3 px-1 sm:px-2">
      {/* Bar Header */}
      <div className="flex items-center justify-between mb-2.5 px-2">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🗺️</span>
          <h3 className="font-cartoon text-base sm:text-lg tracking-wider text-amber-300 drop-shadow-sm">
            MISSION SELECT
          </h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
            5 CHAPTERS
          </span>
        </div>
        <span className="text-xs text-sky-400 font-semibold hidden sm:inline">
          Tap any unlocked card to launch mission
        </span>
      </div>

      {/* Grid of 5 3D Level Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
        {levels.map((lvl) => {
          const isUnlocked = lvl.id <= unlockedLevel;
          const isActive = lvl.id === currentLevelId;

          let stars = 0;
          let highScore = 0;
          if (typeof window !== 'undefined') {
            stars = parseInt(localStorage.getItem(`angry_birds_stars_${lvl.id}`) || '0', 10);
            highScore = parseInt(localStorage.getItem(`angry_birds_score_${lvl.id}`) || '0', 10);
          }

          return (
            <button
              key={lvl.id}
              onClick={() => isUnlocked && onSelectLevel(lvl.id)}
              disabled={!isUnlocked}
              className={`relative flex flex-col justify-between p-3 rounded-2xl text-left transition-all duration-200 select-none ${
                isActive
                  ? 'bg-gradient-to-b from-amber-900/90 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-[0_0_20px_rgba(250,204,21,0.35)] scale-102 ring-2 ring-amber-300/40'
                  : isUnlocked
                  ? 'bg-gradient-to-b from-slate-800/90 via-slate-900 to-slate-950 border-2 border-slate-700 hover:border-amber-400/80 hover:scale-102 hover:shadow-lg shadow-md cursor-pointer'
                  : 'bg-slate-950/70 border-2 border-slate-800/80 opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute -top-2.5 right-3 bg-amber-400 text-slate-950 font-cartoon text-[10px] px-2 py-0.5 rounded-full shadow-md tracking-wider">
                  ACTIVE
                </div>
              )}

              {/* Level Number Pill & Stars / Lock */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-cartoon text-xs px-2.5 py-1 rounded-xl shadow-sm ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black'
                      : isUnlocked
                      ? 'bg-slate-700/80 text-amber-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    LVL {lvl.id}
                  </span>

                  {isUnlocked ? (
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 transition-transform ${
                            s < stars
                              ? 'text-amber-400 fill-amber-400 filter drop-shadow(0 0 3px #facc15)'
                              : 'text-slate-700 fill-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  )}
                </div>

                {/* Level Title & Subtitle */}
                <div className="font-cartoon text-sm text-white truncate drop-shadow-sm">
                  {lvl.name}
                </div>
                <div className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                  {lvl.subtitle}
                </div>
              </div>

              {/* High Score Footer */}
              {isUnlocked && (
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold flex items-center space-x-1">
                    <Trophy className="w-3 h-3 text-amber-400/80 inline" />
                    <span>Best:</span>
                  </span>
                  <span className="font-mono font-bold text-amber-300">
                    {highScore > 0 ? highScore.toLocaleString() : '---'}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
