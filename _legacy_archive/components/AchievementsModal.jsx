'use client';

import React, { useEffect, useState } from 'react';
import { ACHIEVEMENTS, AchievementTracker } from '../lib/achievements';
import { Trophy, X, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export default function AchievementsModal({ isOpen, onClose }) {
  const [unlocked, setUnlocked] = useState([]);
  const [stats, setStats] = useState({ pigsDefeated: 0, blocksDestroyed: 0, birdsLaunched: 0, tntDetonated: 0 });

  useEffect(() => {
    if (isOpen) {
      setUnlocked(AchievementTracker.getUnlocked());
      setStats(AchievementTracker.getStats());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const unlockedCount = unlocked.length;
  const totalCount = ACHIEVEMENTS.length;
  const percent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-4 border-amber-900/90 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-5 sm:p-6 overflow-hidden ring-2 ring-amber-500/40">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-md">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-cartoon text-2xl text-amber-300 tracking-wide drop-shadow-sm">
                ACHIEVEMENTS & BADGES
              </h2>
              <p className="text-xs text-slate-400">Track your feathered destruction milestones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Completion Progress */}
        <div className="my-4 p-4 rounded-2xl bg-slate-950/80 border-2 border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="font-cartoon text-xs text-slate-300 tracking-wider">
              TOTAL UNLOCKED: {unlockedCount} / {totalCount}
            </span>
            <span className="font-cartoon text-sm text-amber-400">{percent}%</span>
          </div>

          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-500 rounded-full shadow-sm"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Mini Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-center">
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Pigs Popped</div>
              <div className="font-cartoon text-xl text-emerald-400">{stats.pigsDefeated || 0}</div>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Blocks Smashed</div>
              <div className="font-cartoon text-xl text-amber-400">{stats.blocksDestroyed || 0}</div>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Birds Fired</div>
              <div className="font-cartoon text-xl text-sky-400">{stats.birdsLaunched || 0}</div>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">TNT Booms</div>
              <div className="font-cartoon text-xl text-rose-400">{stats.tntDetonated || 0}</div>
            </div>
          </div>
        </div>

        {/* Achievement Badges List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {ACHIEVEMENTS.map((ach) => {
            const isAchUnlocked = unlocked.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`flex items-center space-x-3.5 p-3 rounded-2xl border-2 transition ${
                  isAchUnlocked
                    ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/50 shadow-md'
                    : 'bg-slate-950/50 border-slate-800/80 opacity-55'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                  isAchUnlocked ? 'bg-amber-500/20 border border-amber-400/40' : 'bg-slate-800 border border-slate-700'
                }`}>
                  {ach.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-cartoon text-sm text-white tracking-wide">{ach.title}</h3>
                    {isAchUnlocked ? (
                      <span className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3 mr-1 inline" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="arcade-btn arcade-btn-gold px-6 py-2 text-xs"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}
