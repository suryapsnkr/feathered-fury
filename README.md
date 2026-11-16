# 🐦 Angry Birds: Feathered Fury (Next.js + TypeScript Edition)

A complete, polished, playable 2D physics-based slingshot game inspired by Angry Birds, engineered with **Next.js 14 (App Router), TypeScript, React 18, Tailwind CSS, Phaser 3, and Matter.js**.

---

## 🌟 Highlights & Architecture

- **Modern Architecture**:
  - `src/app/` App Router pages (`layout.tsx`, `page.tsx`, `globals.css`).
  - `src/components/` Modular React components (`GameCanvas.tsx`, `GameHUD.tsx`, `LevelSelector.tsx`, `ResultModal.tsx`, `HowToPlayModal.tsx`, `SettingsModal.tsx`).
  - `src/game/` Phaser 3 & Matter.js game loop:
    - `scenes/` `BootScene.ts`, `LevelScene.ts`
    - `entities/` `Bird.ts`, `Pig.ts`, `DestructibleBlock.ts`, `Slingshot.ts`
    - `systems/` `PhysicsSystem.ts`, `ScoringSystem.ts`, `AudioSystem.ts`, `TextureGenerator.ts`
    - `levels/` Typed `levelData.ts` with 5 balanced stages
    - `events.ts` Typed cross-boundary `GameEventBus` connecting Phaser and React
- **Matter.js Rigid Body Physics**:
  - Full impulse and momentum calculations ($p = mv$, kinetic energy impacts).
  - Material-dependent mass, density, friction, restitution, and air drag.
  - Realistic structural collapse: tipping beams, tumbling boulders, chain reaction collapses.
  - Stable ground and resting friction filters to eliminate tower jitter.
- **Procedural Graphics & Audio (100% Offline)**:
  - High-DPI procedural HTML5 Canvas textures for all characters, blocks, slingshot, and parallax backdrops.
  - Procedural Web Audio API sound synthesizer: slingshot rubber stretch/release, bird whoosh, yellow speed sonic boom, blue tri-split chime, wood snap, glass crystalline shatter, stone heavy thud, TNT explosion, pig defeat squeal, and victory fanfare.
  - Zero external image/sound assets required — zero 404s, CORS issues, or broken links.

---

## 🎮 Slingshot Mechanics & Bird Abilities

| Bird | Color / Shape | Mass / Durability | Special Superpower |
| :--- | :--- | :--- | :--- |
| **Red Bird** | Crimson sphere | Balanced projectile | **War Cry**: High-impact direct strikes. Tap in flight for slight downward shockwave. |
| **Yellow (Chuck)** | Golden triangle | Aerodynamic penetrator | **Supersonic Speed Boost**: Tap or click screen while in air to accelerate $2.2\times$, piercing wooden fortifications. |
| **Blue (The Blues)** | Azure roundling | Fast & agile cluster | **Tri-Split**: Tap or click mid-air to clone into 3 birds with angular spread, shattering brittle glass blocks. |

---

## 🧱 Destructible Materials

- **🪵 Wood Planks & Blocks**: Medium weight and durability. Vulnerable to Yellow Bird's Speed Boost.
- **🧊 Glass / Ice**: Light, brittle, and fragile. Easily shattered by Blue Bird's Tri-Split.
- **🪨 Stone Planks & Masonry Blocks**: Dense, heavy, and sturdy. Smashed by high-momentum impacts and falling blocks.
- **💣 TNT Crates**: Explodes on impact with force $> 3$, creating radial blast impulses, screenshake, and massive damage to surrounding structures and pigs.

---

## 🎯 5 Playable Levels

1. **Level 1 — "First Flight"**: Basic wooden tower with 1 Pig and 3 Red birds. Introduces slingshot trajectory and aiming.
2. **Level 2 — "Double Trouble"**: Multiple pigs behind protective wooden barriers. Features Chuck's Speed Boost.
3. **Level 3 — "Glass Menagerie"**: Multi-story palace with brittle glass pillars under a heavy stone roof. Features The Blues' Tri-Split.
4. **Level 4 — "Bunker Buster"**: Fortified stone pillars with a strategic TNT crate tucked beneath support columns and armored Helmet Pigs.
5. **Level 5 — "Citadel of the King"**: Grand 3-tier boss citadel with stone battlements, glass skylights, guard pigs, and the King Pig on his royal throne.

---

## 🚀 Installation & Running

### Requirements
- **Node.js** (v18+ recommended)
- **npm** (v9+)

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Launch
```bash
npm run build
npm start
```
The optimized production server will be running at [http://localhost:3000](http://localhost:3000).

### Type Checking
```bash
npx tsc --noEmit
```

---

## 🕹️ Controls Guide

| Action | Desktop | Mobile / Touch |
| :--- | :--- | :--- |
| **Aim Slingshot** | Click & drag bird backward | Touch & drag bird backward |
| **Launch Bird** | Release mouse button | Lift finger from screen |
| **Trigger Ability** | Tap / click anywhere on screen during flight | Tap anywhere on screen during flight |
| **Restart Level** | Click 🔄 Restart button | Tap 🔄 Restart button |
| **Select Level** | Click "Levels" button | Tap "Levels" button |
| **Toggle Mute** | Click 🔊 / 🔇 button | Tap 🔊 / 🔇 button |
| **Instructions** | Click ❓ button | Tap ❓ button |

---

## 🧪 Testing Instructions

1. **Aiming & Trajectory**: Drag the bird backward from the slingshot fork. Verify the dotted parabolic trajectory updates dynamically and respects drag boundaries.
2. **Launch & Physics**: Release pointer. Verify the bird launches with velocity proportional to pull distance.
3. **Yellow Bird Ability**: On Level 2, launch Chuck and click/tap anywhere mid-flight. Verify supersonic acceleration and flame particles.
4. **Blue Bird Ability**: On Level 3, launch The Blues and tap in flight. Verify it divides cleanly into 3 projectiles that hit separate glass columns.
5. **Pig Defeat**: Hit enemy pigs directly or drop blocks on them. Verify comic smoke burst, floating "+5,000" score popup, and pop audio.
6. **TNT Detonation**: In Level 4 or 5, hit the red TNT crate. Verify radial force explosion, screen shake, and chain reaction collapse.
7. **Victory & Stars**: Defeat all pigs in a level. Verify unused birds award +10,000 points each, victory fanfare plays, stars are calculated, and next level unlocks.
8. **Level Persistence**: Refresh browser. Open Level Selector and verify unlocked levels and high scores are preserved from `localStorage`.
