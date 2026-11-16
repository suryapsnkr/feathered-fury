'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Volume2, VolumeX, RotateCcw, X, Sliders, AlertTriangle } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [isMuted, setIsMuted] = useState(false);
  const [screenShake, setScreenShake] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMuted(localStorage.getItem('angry_birds_muted') === 'true');
      setScreenShake(localStorage.getItem('angry_birds_shake') !== 'false');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    if (window.audioManager) {
      const nextMuted = window.audioManager.toggleMute();
      setIsMuted(nextMuted);
    } else {
      const next = !isMuted;
      setIsMuted(next);
      localStorage.setItem('angry_birds_muted', next);
    }
  };

  const handleToggleShake = () => {
    const next = !screenShake;
    setScreenShake(next);
    localStorage.setItem('angry_birds_shake', next);
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all unlocked levels, stars, and high scores?')) {
      localStorage.removeItem('angry_birds_unlocked');
      localStorage.removeItem('angry_birds_achievements');
      localStorage.removeItem('angry_birds_stats');
      for (let i = 1; i <= 5; i++) {
        localStorage.removeItem(`angry_birds_stars_${i}`);
        localStorage.removeItem(`angry_birds_score_${i}`);
      }
      alert('Progress has been reset.');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-4 border-slate-700 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-5 sm:p-6 ring-2 ring-slate-500/30">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white shadow-md">
              <Settings className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-cartoon text-2xl text-white tracking-wide drop-shadow-sm">
                SETTINGS
              </h2>
              <p className="text-xs text-slate-400">Audio and gameplay preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="my-5 space-y-3.5">
          {/* Audio Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-950/80 rounded-2xl border-2 border-slate-800">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isMuted ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-cartoon text-sm text-white">GAME AUDIO & BGM</div>
                <div className="text-xs text-slate-400">Web Audio API procedural sound & music</div>
              </div>
            </div>

            <button
              onClick={handleToggleMute}
              className={`arcade-btn px-4 py-1.5 text-xs ${
                isMuted ? 'arcade-btn-red' : 'arcade-btn-green'
              }`}
            >
              {isMuted ? 'MUTED' : 'ENABLED'}
            </button>
          </div>

          {/* Screen Shake */}
          <div className="flex items-center justify-between p-4 bg-slate-950/80 rounded-2xl border-2 border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="font-cartoon text-sm text-white">SCREEN SHAKE FX</div>
                <div className="text-xs text-slate-400">Camera rumble on heavy impacts & TNT</div>
              </div>
            </div>

            <button
              onClick={handleToggleShake}
              className={`arcade-btn px-4 py-1.5 text-xs ${
                screenShake ? 'arcade-btn-gold' : 'arcade-btn-slate'
              }`}
            >
              {screenShake ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Reset Progress Danger Zone */}
          <div className="flex items-center justify-between p-4 bg-rose-950/20 rounded-2xl border-2 border-rose-900/40">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-cartoon text-sm text-rose-300">RESET PROGRESS</div>
                <div className="text-xs text-slate-400">Clear all unlocked levels and stars</div>
              </div>
            </div>

            <button
              onClick={handleResetProgress}
              className="arcade-btn arcade-btn-red px-3 py-1.5 text-xs"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="arcade-btn arcade-btn-slate px-6 py-2 text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
