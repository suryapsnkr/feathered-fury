'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles, RotateCcw, List, Crown, Award } from 'lucide-react';
import { AudioSystem } from '../game/systems/AudioSystem';

interface GrandVictoryModalProps {
  isOpen: boolean;
  score: number;
  stars: number;
  onPlayAgain: () => void;
  onOpenLevelSelector: () => void;
}

export default function GrandVictoryModal({
  isOpen,
  score,
  stars,
  onPlayAgain,
  onOpenLevelSelector
}: GrandVictoryModalProps) {
  const [totalStars, setTotalStars] = useState(0);
  const [totalCampaignScore, setTotalCampaignScore] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const audio = AudioSystem.getInstance();
    audio.playGrandVictoryFanfare();

    // Calculate total stats from localStorage
    if (typeof window !== 'undefined') {
      let starsSum = 0;
      let scoreSum = 0;
      for (let i = 1; i <= 5; i++) {
        starsSum += parseInt(localStorage.getItem(`angry_birds_stars_${i}`) || '0', 10);
        scoreSum += parseInt(localStorage.getItem(`angry_birds_highscore_${i}`) || '0', 10);
      }
      setTotalStars(starsSum);
      setTotalCampaignScore(scoreSum);
    }

    // Extended celebration confetti cannon
    const end = Date.now() + 2500;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl select-none animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-950 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
        
        {/* Golden Trophy Hero Icon */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl animate-pulse" />
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 flex items-center justify-center shadow-2xl border-4 border-yellow-200 transform hover:scale-105 transition-transform">
            <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-slate-950 fill-slate-950" />
          </div>
          <Crown className="absolute -top-3 w-8 h-8 text-yellow-300 fill-yellow-400 animate-bounce" />
        </div>

        {/* Triumphant Headlines */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Campaign Completed!
          </div>

          <h2 className="font-cartoon text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-500 drop-shadow-[0_4px_16px_rgba(250,204,21,0.5)]">
            CITADEL DESTROYED!
          </h2>

          <p className="text-xs sm:text-sm text-amber-200/90 mt-1">
            King Pig is defeated and the Golden Eggs are restored to safety!
          </p>
        </div>

        {/* Campaign Stats Card */}
        <div className="p-4 rounded-2xl bg-slate-800/90 border border-amber-500/40 text-left space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300 font-medium">Final Level Score:</span>
            <span className="font-cartoon text-xl text-yellow-300">{score.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300 font-medium">Total Campaign Score:</span>
            <span className="font-cartoon text-2xl text-amber-400">{totalCampaignScore.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300 font-medium">Campaign Stars:</span>
            <div className="flex items-center gap-1 font-cartoon text-lg text-yellow-300">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{totalStars} / 15</span>
            </div>
          </div>

          {/* Badges Ribbon */}
          <div className="pt-2 border-t border-slate-700/80 grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
            <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
              👑 Pig King Defeated
            </div>
            <div className="p-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300">
              🥚 Eggs Rescued
            </div>
            <div className="p-1.5 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-300">
              {totalStars >= 12 ? '⭐ Flock Legend' : '🎯 Master Shooter'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-600 active:scale-95 transition-transform cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>

          <button
            onClick={onOpenLevelSelector}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 border border-yellow-200 active:scale-95 transition-transform cursor-pointer"
          >
            <List className="w-4 h-4" /> All Levels
          </button>
        </div>

      </div>
    </div>
  );
}
