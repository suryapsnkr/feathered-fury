'use client';

import React, { useState, useEffect } from 'react';
import { Play, List, HelpCircle, Settings, Volume2, VolumeX, Star, Trophy, Zap, Shield, Sparkles } from 'lucide-react';
import { AudioSystem } from '../game/systems/AudioSystem';

interface MainMenuProps {
  isOpen: boolean;
  onPlay: () => void;
  onOpenLevelSelector: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  totalStars: number;
}

export default function MainMenu({
  isOpen,
  onPlay,
  onOpenLevelSelector,
  onOpenHowToPlay,
  onOpenSettings,
  totalStars
}: MainMenuProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'mission' | 'flock'>('mission');

  useEffect(() => {
    const audio = AudioSystem.getInstance();
    setIsMuted(audio.isMuted);
  }, []);

  const handleToggleSound = () => {
    const audio = AudioSystem.getInstance();
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const handleStartGame = () => {
    const audio = AudioSystem.getInstance();
    audio.resume();
    audio.playButtonClick();
    if (!audio.isMuted) {
      audio.startBGM();
    }
    onPlay();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-lg select-none animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-4 border-amber-400 rounded-3xl p-5 sm:p-8 shadow-2xl text-center flex flex-col justify-between max-h-[95vh] overflow-y-auto">
        
        {/* Top Sound and Stars Bar */}
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-cartoon text-xs sm:text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{totalStars} / 15 Stars</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Branding Header */}
        <div className="my-2 flex flex-col items-center">
          {/* Animated Cast Characters Banner */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 my-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 border-2 border-yellow-300 flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform -rotate-6 hover:scale-110 transition-transform">
              🐦
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-300 border-2 border-yellow-100 flex items-center justify-center text-2xl shadow-lg transform rotate-6 hover:scale-110 transition-transform">
              🐤
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-sky-400 to-cyan-300 border-2 border-cyan-100 flex items-center justify-center text-xl shadow-lg transform -rotate-12 hover:scale-110 transition-transform">
              🐣
            </div>
            <div className="text-xl sm:text-2xl text-amber-400 font-black px-1">VS</div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 border-2 border-emerald-200 flex items-center justify-center text-2xl shadow-lg transform rotate-3 hover:scale-110 transition-transform">
              🐷
            </div>
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-lime-400 border-2 border-amber-300 flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform -rotate-3 hover:scale-110 transition-transform">
              👑
            </div>
          </div>

          <h1 className="font-cartoon text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 drop-shadow-[0_4px_16px_rgba(245,158,11,0.5)] tracking-wider">
            FEATHERED FURY
          </h1>
          <p className="text-xs sm:text-sm text-amber-300 font-bold uppercase tracking-widest mt-1">
            2D Slingshot Physics • Revenge of the Golden Eggs
          </p>
        </div>

        {/* Tab Selector: Mission vs Flock Roster */}
        <div className="flex justify-center gap-2 my-3">
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-4 py-1.5 rounded-xl font-cartoon text-xs transition-colors cursor-pointer ${
              activeTab === 'mission'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Mission Briefing
          </button>
          <button
            onClick={() => setActiveTab('flock')}
            className={`px-4 py-1.5 rounded-xl font-cartoon text-xs transition-colors cursor-pointer ${
              activeTab === 'flock'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Flock Superpowers
          </button>
        </div>

        {/* Center Panel Content */}
        {activeTab === 'mission' ? (
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs sm:text-sm leading-relaxed text-left space-y-2 mb-4">
            <p>
              👑 <strong className="text-yellow-300">King Pig</strong> and his minions have invaded the valley and barricaded your precious golden eggs behind fortified towers of wood, glass, and stone!
            </p>
            <p>
              🎯 Pull back on the slingshot, adjust your angle and launch velocity, and trigger your birds' special abilities mid-flight to bring down their structures!
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] font-bold">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700">
                🪵 <span className="text-amber-200">Wood:</span> Medium
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700">
                🧊 <span className="text-cyan-200">Glass:</span> Fragile
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700">
                🪨 <span className="text-slate-200">Stone:</span> Heavy
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 text-left">
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-red-300 mb-1">
                <span>🔴</span> Red Brawler
              </div>
              <p className="text-[11px] text-slate-300">
                Heavy kinetic momentum. Tap mid-flight for a dive-bomb war cry to crash downwards!
              </p>
            </div>

            <div className="p-3 rounded-xl bg-yellow-950/40 border border-yellow-500/40 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-yellow-300 mb-1">
                <span>⚡</span> Chuck (Yellow)
              </div>
              <p className="text-[11px] text-slate-300">
                Tap mid-flight for supersonic boost! Pierces cleanly through wooden planks.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/40 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-sky-300 mb-1">
                <span>❄️</span> The Blues (Blue)
              </div>
              <p className="text-[11px] text-slate-300">
                Tap in flight to split into 3 projectile birds! Shatters fragile glass obstacles.
              </p>
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {/* Big Bouncy PLAY Button */}
          <button
            onClick={handleStartGame}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-cartoon text-2xl tracking-wide shadow-[0_0_25px_rgba(16,185,129,0.5)] border-2 border-emerald-300 flex items-center justify-center gap-3 active:scale-98 transition-transform cursor-pointer animate-pulse"
          >
            <Play className="w-7 h-7 fill-slate-950" />
            <span>PLAY GAME</span>
          </button>

          {/* Secondary Buttons Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                const audio = AudioSystem.getInstance();
                audio.playButtonClick();
                onOpenLevelSelector();
              }}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-transform cursor-pointer"
            >
              <List className="w-4 h-4 text-amber-400" />
              <span>Select Level</span>
            </button>

            <button
              onClick={() => {
                const audio = AudioSystem.getInstance();
                audio.playButtonClick();
                onOpenHowToPlay();
              }}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-transform cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>How To Play</span>
            </button>
          </div>
        </div>

        {/* Footer Hotkey Guide */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span>[Drag + Release] Aim & Launch</span>
          <span>[Space / Tap] Special Ability</span>
          <span>[R] Restart</span>
          <span>[Esc] Pause</span>
        </div>
      </div>
    </div>
  );
}
