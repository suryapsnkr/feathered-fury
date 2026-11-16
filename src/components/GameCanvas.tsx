'use client';

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../game/config';
import { LevelScene } from '../game/scenes/LevelScene';

interface GameCanvasProps {
  onLevelLoaded?: (levelId: number) => void;
}

export default function GameCanvas({ onLevelLoaded }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const containerId = 'phaser-game-canvas';
    containerRef.current.id = containerId;

    const config = createGameConfig(containerId);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Attach global reference for easy level switching and debugging
    (window as any).__PHASER_GAME__ = game;

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        (window as any).__PHASER_GAME__ = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full aspect-[16/9] max-h-[78vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400/80 bg-sky-400 select-none">
      <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
    </div>
  );
}
