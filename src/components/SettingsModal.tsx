'use client';

import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Music, Trash2, CheckCircle2 } from 'lucide-react';
import { AudioSystem } from '../game/systems/AudioSystem';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgressReset: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onProgressReset
}: SettingsModalProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const audio = AudioSystem.getInstance();
    setIsMuted(audio.isMuted);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    const audio = AudioSystem.getInstance();
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const handleClearProgress = () => {
    if (typeof window === 'undefined') return;
    if (confirm('Are you sure you want to reset all game progress and high scores?')) {
      for (let i = 1; i <= 5; i++) {
        localStorage.removeItem(`angry_birds_highscore_${i}`);
        localStorage.removeItem(`angry_birds_stars_${i}`);
      }
      localStorage.setItem('angry_birds_unlocked', '1');
      setResetSuccess(true);
      onProgressReset();
      setTimeout(() => setResetSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
          <h2 className="font-cartoon text-2xl text-yellow-300 drop-shadow">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4 text-slate-200">
          {/* Audio Master Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div className="flex items-center gap-3">
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-rose-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              )}
              <div>
                <span className="font-bold text-sm block">Sound & Audio</span>
                <span className="text-xs text-slate-400">Sound effects & background music</span>
              </div>
            </div>
            <button
              onClick={handleToggleMute}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
                isMuted
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500/50'
                  : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
              }`}
            >
              {isMuted ? 'Muted' : 'Active'}
            </button>
          </div>

          {/* Reset Game Progress */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-rose-400" />
              <div>
                <span className="font-bold text-sm text-rose-200 block">Reset Progress</span>
                <span className="text-xs text-slate-400">Clear stars and lock levels 2–5</span>
              </div>
            </div>
            <button
              onClick={handleClearProgress}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
            >
              Reset
            </button>
          </div>

          {resetSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" /> Progress successfully reset!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
