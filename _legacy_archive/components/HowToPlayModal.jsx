'use client';

import React from 'react';
import { HelpCircle, X, Crosshair, Zap, Award, Bomb, Sparkles } from 'lucide-react';

export default function HowToPlayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-4 border-sky-900/90 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-5 sm:p-6 overflow-hidden ring-2 ring-sky-500/40">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-400 flex items-center justify-center text-slate-950 shadow-md">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-cartoon text-2xl text-sky-300 tracking-wide drop-shadow-sm">
                HOW TO PLAY
              </h2>
              <p className="text-xs text-slate-400">Master slingshot trajectory & bird powers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-4 space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {/* Aim & Launch Step */}
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border-2 border-slate-800">
            <div className="flex items-center space-x-2.5 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-cartoon text-xs flex items-center justify-center font-black">
                1
              </span>
              <Crosshair className="w-4 h-4 text-amber-400" />
              <h3 className="font-cartoon text-sm text-white tracking-wide">
                PULL BACK & AIM SLINGSHOT
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-8">
              Click and drag the bird loaded in the slingshot backwards. The white trajectory dots show you the parabolic launch path. Release mouse or finger to launch!
            </p>
          </div>

          {/* Special Powers Step */}
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border-2 border-slate-800">
            <div className="flex items-center space-x-2.5 mb-2.5">
              <span className="w-6 h-6 rounded-full bg-sky-400 text-slate-950 font-cartoon text-xs flex items-center justify-center font-black">
                2
              </span>
              <Zap className="w-4 h-4 text-sky-400" />
              <h3 className="font-cartoon text-sm text-white tracking-wide">
                TRIGGER SPECIAL POWERS MID-FLIGHT
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pl-8">
              {/* Red */}
              <div className="p-2.5 bg-slate-900 rounded-xl border border-red-500/30">
                <div className="text-xl mb-1">🔴</div>
                <div className="font-cartoon text-xs text-red-400">RED BIRD</div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Heavy mass battering ram with maximum blunt impact. Smashes stone walls!
                </p>
              </div>

              {/* Yellow */}
              <div className="p-2.5 bg-slate-900 rounded-xl border border-amber-500/30">
                <div className="text-xl mb-1">🟡</div>
                <div className="font-cartoon text-xs text-amber-400">CHUCK (YELLOW)</div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Click/Tap in flight for <strong>Speed Boost</strong>! Slices straight through wooden beams!
                </p>
              </div>

              {/* Blue */}
              <div className="p-2.5 bg-slate-900 rounded-xl border border-sky-500/30">
                <div className="text-xl mb-1">🔵</div>
                <div className="font-cartoon text-xs text-sky-400">THE BLUES</div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Click/Tap in flight to <strong>Split into 3 Birds</strong>! Shatters glass structures instantly!
                </p>
              </div>
            </div>
          </div>

          {/* Objective & TNT Step */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-950/80 rounded-2xl border-2 border-slate-800">
              <div className="flex items-center space-x-2 text-rose-400 mb-1">
                <Bomb className="w-4 h-4" />
                <span className="font-cartoon text-xs text-white">TNT BARRELS</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Strike red TNT crates to unleash massive radial shockwaves, triggering explosive chain reactions!
              </p>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl border-2 border-slate-800">
              <div className="flex items-center space-x-2 text-amber-400 mb-1">
                <Award className="w-4 h-4" />
                <span className="font-cartoon text-xs text-white">3-STAR MASTERY</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Each unused bird gives a <strong>+10,000 point bonus</strong>! Clear levels with fewer birds to earn all 3 stars!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="arcade-btn arcade-btn-blue px-6 py-2 text-xs"
          >
            Ready to Launch!
          </button>
        </div>
      </div>
    </div>
  );
}
