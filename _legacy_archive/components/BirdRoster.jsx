'use client';

import React from 'react';
import { Shield, Zap, Sparkles, Crosshair, Target } from 'lucide-react';

export default function BirdRoster() {
  const birds = [
    {
      name: 'Red Bird',
      subtitle: 'The Battering Ram',
      colorBadge: 'bg-red-500/20 text-red-300 border-red-500/40',
      borderCol: 'border-red-600/50 hover:border-red-500',
      bgGrad: 'from-red-950/40 via-slate-900 to-slate-950',
      icon: '🔴',
      barColor: 'bg-red-500',
      mass: 85,
      speed: 65,
      ability: 'High-Impact Kinetic Force',
      effectiveAgainst: '🪨 Stone & Base Columns',
      description: 'Standard high-mass projectile with devastating knockback force. Ideal for punching through base supports and heavy stone walls.'
    },
    {
      name: 'Chuck (Yellow)',
      subtitle: 'Supersonic Speedster',
      colorBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      borderCol: 'border-amber-500/50 hover:border-amber-400',
      bgGrad: 'from-amber-950/40 via-slate-900 to-slate-950',
      icon: '🟡',
      barColor: 'bg-amber-400',
      mass: 50,
      speed: 100,
      ability: 'Mid-Flight Speed Boost',
      effectiveAgainst: '🪵 Wood Planks & Beams',
      description: 'Tap screen or click while in flight to trigger a supersonic dash that slices cleanly through tough wooden barriers.'
    },
    {
      name: 'The Blues',
      subtitle: 'Triple Cluster Bomb',
      colorBadge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      borderCol: 'border-sky-500/50 hover:border-sky-400',
      bgGrad: 'from-sky-950/40 via-slate-900 to-slate-950',
      icon: '🔵',
      barColor: 'bg-sky-400',
      mass: 40,
      speed: 75,
      ability: 'Mid-Flight 3-Way Split',
      effectiveAgainst: '🧊 Fragile Glass & Ice',
      description: 'Tap screen or click while in flight to split into 3 birds in a wide fan spread. Devastating against multi-tier glass towers.'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto my-3 px-1 sm:px-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 px-2">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🐦</span>
          <h3 className="font-cartoon text-base sm:text-lg tracking-wider text-amber-300 drop-shadow-sm">
            FEATHERED SQUADRON & POWERS
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
          Tap or press Space mid-flight to trigger special abilities
        </span>
      </div>

      {/* 3 Character Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {birds.map((b) => (
          <div
            key={b.name}
            className={`p-4 rounded-2xl border-2 ${b.borderCol} bg-gradient-to-b ${b.bgGrad} shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between`}
          >
            <div>
              {/* Card Header: Bird Icon & Title */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
                  {b.icon}
                </div>
                <div>
                  <h4 className="font-cartoon text-base text-white tracking-wide">
                    {b.name}
                  </h4>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${b.colorBadge}`}>
                    {b.subtitle}
                  </span>
                </div>
              </div>

              {/* Stats Meters */}
              <div className="space-y-1.5 my-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-0.5">
                    <span>MASS / WEIGHT</span>
                    <span className="text-white font-mono">{b.mass}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${b.barColor} rounded-full`} style={{ width: `${b.mass}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-0.5">
                    <span>FLIGHT SPEED</span>
                    <span className="text-white font-mono">{b.speed}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${b.barColor} rounded-full`} style={{ width: `${b.speed}%` }} />
                  </div>
                </div>
              </div>

              {/* Ability Description */}
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {b.description}
              </p>
            </div>

            {/* Target Affinity Tag */}
            <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-amber-400 inline" />
                <span>Weakness:</span>
              </span>
              <span className="font-bold text-amber-300 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
                {b.effectiveAgainst}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
