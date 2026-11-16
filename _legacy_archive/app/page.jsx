'use client';

import React, { useState, useEffect } from 'react';
import GameCanvas from '../components/GameCanvas';
import LevelBar from '../components/LevelBar';
import BirdRoster from '../components/BirdRoster';
import AchievementsModal from '../components/AchievementsModal';
import SettingsModal from '../components/SettingsModal';
import HowToPlayModal from '../components/HowToPlayModal';
import { Trophy, Settings, HelpCircle, Star, Sparkles, Volume2 } from 'lucide-react';
import { ACHIEVEMENTS, AchievementTracker } from '../lib/achievements';

const LEVELS = [
  { id: 1, name: 'First Flight', subtitle: 'Wooden tower with 1 pig' },
  { id: 2, name: 'Double Trouble', subtitle: 'Pigs behind wooden barriers' },
  { id: 3, name: 'Glass Castle', subtitle: 'Glass dome with stone roof' },
  { id: 4, name: 'Bunker Buster', subtitle: 'Fortified stone & TNT crates' },
  { id: 5, name: "King Pig's Citadel", subtitle: 'Epic 3-tier boss fortress' }
];

export default function Home() {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [totalStars, setTotalStars] = useState(0);

  // Modals state
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Load progress on mount
  useEffect(() => {
    refreshProgress();
    const interval = setInterval(refreshProgress, 2000);
    return () => clearInterval(interval);
  }, []);

  const refreshProgress = () => {
    if (typeof window === 'undefined') return;
    const unlocked = parseInt(localStorage.getItem('angry_birds_unlocked') || '1', 10);
    setUnlockedLevel(unlocked);

    let stars = 0;
    for (let i = 1; i <= 5; i++) {
      stars += parseInt(localStorage.getItem(`angry_birds_stars_${i}`) || '0', 10);
    }
    setTotalStars(stars);

    if (stars >= 15) {
      AchievementTracker.unlock('grand_master');
    }
  };

  const playClickSound = () => {
    if (typeof window !== 'undefined' && window.audioManager) {
      window.audioManager.playButtonClick();
      window.audioManager.resume();
    }
  };

  const handleSelectLevel = (levelId) => {
    setCurrentLevelId(levelId);
    playClickSound();
    if (window.game) {
      const activeScenes = window.game.scene.getScenes(true);
      if (activeScenes.length > 0) {
        activeScenes[0].scene.start('GameScene', { levelId });
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between py-3 px-2 sm:px-4 md:px-6 relative selection:bg-amber-400 selection:text-slate-950">
      {/* Background Subtle Floating Cartoon Clouds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute top-10 left-10 w-64 h-24 bg-white/40 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-80 h-32 bg-sky-300/30 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-28 bg-blue-400/20 rounded-full blur-2xl" />
      </div>

      {/* Top Arcade Navigation & Brand Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between py-2.5 px-4 sm:px-6 rounded-2xl bg-slate-900/90 border-2 border-slate-700/80 shadow-2xl backdrop-blur-md mb-2">
        {/* Brand Title with Feathered Badge */}
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          <div className="relative group cursor-pointer" onClick={playClickSound}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-3xl shadow-lg shadow-red-500/40 border-2 border-amber-300 transform -rotate-3 transition-transform group-hover:rotate-6 group-hover:scale-110">
              🐦
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center text-[10px]">
              ⭐
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-cartoon text-2xl sm:text-3xl tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                ANGRY BIRDS
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Next Edition
              </span>
            </div>
            <p className="text-[11px] font-bold text-sky-400 uppercase tracking-widest -mt-0.5 flex items-center space-x-1">
              <span>FEATHERED FURY</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-amber-300">PHYSICS SLINGSHOT</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Star Chest */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Golden Star Chest */}
          <div className="shimmer-badge flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-b from-amber-950/70 to-slate-900 border-2 border-amber-400/60 text-amber-300 font-cartoon text-sm shadow-md shadow-amber-500/10">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 filter drop-shadow(0 0 4px #facc15)" />
            <span className="tracking-wide">{totalStars} / 15</span>
          </div>

          {/* Badges Button */}
          <button
            onClick={() => { playClickSound(); setShowAchievements(true); }}
            className="arcade-btn arcade-btn-gold px-3.5 py-1.5 text-xs font-bold"
            title="Achievements and Stats"
          >
            <Trophy className="w-3.5 h-3.5 mr-1.5 inline" />
            <span>Badges</span>
          </button>

          {/* How to Play Button */}
          <button
            onClick={() => { playClickSound(); setShowHowToPlay(true); }}
            className="arcade-btn arcade-btn-blue px-3.5 py-1.5 text-xs font-bold"
            title="How to Play"
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1.5 inline" />
            <span>Guide</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => { playClickSound(); setShowSettings(true); }}
            className="arcade-btn arcade-btn-slate p-2 text-xs"
            title="Game Settings"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </header>

      {/* Main Game Viewport */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <GameCanvas
          currentLevelId={currentLevelId}
          onLevelChange={setCurrentLevelId}
        />

        {/* Mission Select Bar */}
        <LevelBar
          levels={LEVELS}
          currentLevelId={currentLevelId}
          unlockedLevel={unlockedLevel}
          onSelectLevel={handleSelectLevel}
        />

        {/* Feathered Squadron & Powers Guide */}
        <BirdRoster />
      </section>

      {/* Modals */}
      <AchievementsModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto pt-4 pb-2 text-center text-xs text-slate-400 border-t border-slate-800/80 mt-2 font-medium">
        <p className="flex items-center justify-center space-x-2">
          <span>🎮 <strong>HTML5 & Matter.js Physics Engine</strong> &bull; Complete with 5 Levels, Special Powers & Sound FX</span>
        </p>
      </footer>
    </main>
  );
}
