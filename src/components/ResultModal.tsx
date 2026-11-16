'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Star, RotateCcw, ArrowRight, List, Sparkles, AlertCircle } from 'lucide-react';
import { AudioSystem } from '../game/systems/AudioSystem';

interface ResultModalProps {
  type: 'victory' | 'defeat' | null;
  levelId: number;
  score: number;
  stars?: number;
  birdsUnused?: number;
  birdBonus?: number;
  isHighScore?: boolean;
  reason?: string;
  onNextLevel: () => void;
  onRestart: () => void;
  onOpenLevelSelector: () => void;
}

export default function ResultModal({
  type,
  levelId,
  score,
  stars = 1,
  birdsUnused = 0,
  birdBonus = 0,
  isHighScore = false,
  reason = 'Out of Birds!',
  onNextLevel,
  onRestart,
  onOpenLevelSelector
}: ResultModalProps) {
  const [revealedStars, setRevealedStars] = useState(0);

  useEffect(() => {
    if (type === 'victory') {
      setRevealedStars(0);

      // Staggered star animation
      const audio = AudioSystem.getInstance();
      const timers: NodeJS.Timeout[] = [];

      for (let i = 1; i <= stars; i++) {
        const timer = setTimeout(() => {
          setRevealedStars(i);
          audio.playScorePopup();
        }, i * 320);
        timers.push(timer);
      }

      // Confetti burst
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      return () => {
        timers.forEach((t) => clearTimeout(t));
      };
    } else {
      setRevealedStars(0);
    }
  }, [type, stars]);

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-center transform scale-100 transition-all">
        {type === 'victory' ? (
          <div>
            {/* Victory Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Level Cleared!
            </div>

            <h2 className="font-cartoon text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 drop-shadow-lg mb-4">
              VICTORY!
            </h2>

            {/* Star Rating Display with Staggered Reveal */}
            <div className="flex justify-center items-center gap-3 my-4">
              {[1, 2, 3].map((starIdx) => {
                const isEarned = starIdx <= stars;
                const isShown = starIdx <= revealedStars;

                return (
                  <div
                    key={starIdx}
                    className={`relative transform transition-all duration-300 ${
                      isShown
                        ? 'scale-110 rotate-0'
                        : isEarned
                        ? 'scale-50 opacity-0 -rotate-12'
                        : 'opacity-25 scale-80'
                    } ${starIdx === 2 ? '-translate-y-2' : ''}`}
                  >
                    <Star
                      className={`w-12 h-12 sm:w-14 sm:h-14 ${
                        isShown
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_14px_rgba(250,204,21,0.7)] animate-in zoom-in-50 duration-200'
                          : 'text-slate-600 fill-slate-700'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Score Breakdown Box */}
            <div className="my-5 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left space-y-2">
              <div className="flex justify-between items-center text-sm text-slate-300">
                <span>Unused Birds Bonus ({birdsUnused} × 10,000):</span>
                <span className="font-bold text-amber-300">+{birdBonus.toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-700 my-1" />
              <div className="flex justify-between items-center text-base">
                <span className="font-bold text-white">Final Score:</span>
                <span className="font-cartoon text-2xl text-yellow-400">{score.toLocaleString()}</span>
              </div>
              {isHighScore && (
                <div className="text-center pt-1 font-bold text-xs text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1 animate-pulse">
                  ⭐ NEW PERSONAL BEST! ⭐
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                onClick={onRestart}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-600 active:scale-95 transition-transform cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Replay
              </button>

              {levelId < 5 ? (
                <button
                  onClick={onNextLevel}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 border border-yellow-200 active:scale-95 transition-transform cursor-pointer"
                >
                  Next Level <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onOpenLevelSelector}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 border border-yellow-200 active:scale-95 transition-transform cursor-pointer"
                >
                  <List className="w-4 h-4" /> All Levels
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Defeat Banner */}
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-black text-xs uppercase tracking-wider mb-2">
              <AlertCircle className="w-3.5 h-3.5" /> Defeat
            </div>

            <h2 className="font-cartoon text-3xl sm:text-4xl text-rose-500 drop-shadow-lg mb-2">
              LEVEL FAILED!
            </h2>
            <p className="text-sm text-slate-300 mb-6">{reason}</p>

            {/* Score Box */}
            <div className="my-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="text-xs uppercase text-slate-400 font-bold mb-1">Score Achieved</div>
              <div className="font-cartoon text-3xl text-yellow-400">{score.toLocaleString()}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                onClick={onOpenLevelSelector}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-600 active:scale-95 transition-transform cursor-pointer"
              >
                <List className="w-4 h-4" /> Levels
              </button>

              <button
                onClick={onRestart}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 border border-red-400 active:scale-95 transition-transform cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
