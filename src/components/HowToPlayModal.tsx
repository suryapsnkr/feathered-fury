'use client';

import React from 'react';
import { X, Target, Zap, Shield, Sparkles, Flame } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-cartoon text-2xl sm:text-3xl text-yellow-300 drop-shadow flex items-center gap-2">
              <Target className="w-7 h-7 text-amber-400" /> How to Play
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Master the slingshot physics and defeat all enemy pigs!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-slate-200 text-sm">
          {/* 1. Slingshot Mechanics */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-3xl shrink-0">
              🎯
            </div>
            <div>
              <h3 className="font-cartoon text-lg text-yellow-400">Aim & Launch</h3>
              <p className="text-xs text-slate-300 mt-1">
                Click or touch the bird loaded on the wooden slingshot. Pull backward to set your launch power and trajectory angle. Release the pointer to fling the bird towards the pig fortress!
              </p>
            </div>
          </div>

          {/* 2. Feathered Heroes */}
          <div>
            <h3 className="font-cartoon text-lg text-yellow-300 mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> Birds & Superpowers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Red */}
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/50">
                <div className="text-2xl mb-1">🐦</div>
                <h4 className="font-cartoon text-sm text-rose-300">Red Bird</h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  The classic hero! Well-balanced projectile with solid direct impact damage. Tap mid-air for a small downward war-cry shockwave.
                </p>
              </div>

              {/* Yellow */}
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/50">
                <div className="text-2xl mb-1">⚡</div>
                <h4 className="font-cartoon text-sm text-yellow-300">Yellow (Chuck)</h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  <strong>Speed Boost:</strong> Tap the screen while flying to trigger supersonic acceleration! Obliterates wooden structures.
                </p>
              </div>

              {/* Blue */}
              <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/50">
                <div className="text-2xl mb-1">❄️</div>
                <h4 className="font-cartoon text-sm text-sky-300">Blue (The Blues)</h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  <strong>Tri-Split:</strong> Tap the screen mid-air to split into 3 birds! Unstoppable against brittle glass blocks.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Materials & Destruction */}
          <div>
            <h3 className="font-cartoon text-lg text-yellow-300 mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" /> Materials & Fortresses
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-amber-700">
                <span className="font-bold text-amber-400 block mb-1">🪵 Wood</span>
                <span className="text-[10px] text-slate-300">Medium strength. Vulnerable to Yellow bird.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-sky-600">
                <span className="font-bold text-sky-300 block mb-1">🧊 Glass</span>
                <span className="text-[10px] text-slate-300">Fragile and brittle. Shattered by Blue birds.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-500">
                <span className="font-bold text-slate-300 block mb-1">🪨 Stone</span>
                <span className="text-[10px] text-slate-300">Heavy and resilient. Requires high kinetic force.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-rose-600">
                <span className="font-bold text-rose-400 block mb-1">💣 TNT</span>
                <span className="text-[10px] text-slate-300">Explodes on impact, causing massive destruction!</span>
              </div>
            </div>
          </div>

          {/* 4. Scoring Tips */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
            <strong>Pro Tip:</strong> Every unused bird saved in your queue awards a huge <strong>+10,000 points</strong> bonus at the end of the level! Defeat all pigs with minimal shots to earn 3 Stars!
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-sm shadow-md border border-yellow-200 hover:brightness-110 active:scale-95 transition-all"
          >
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
}
