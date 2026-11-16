/**
 * Level definitions: Bird rosters, destructible blocks, pigs, and star thresholds.
 */
const GAME_LEVELS = [
  {
    id: 1,
    name: "First Flight",
    subtitle: "Aim, pull back, and launch!",
    birds: ['red', 'red', 'red'],
    hint: "Drag the bird back to aim. Watch the trajectory line!",
    starThresholds: [10000, 18000, 26000],
    pigs: [
      { type: 'basic', x: 930, y: 575 }
    ],
    blocks: [
      // Left and right wooden columns
      { type: 'wood_plank_v', x: 880, y: 530 },
      { type: 'wood_plank_v', x: 980, y: 530 },
      // Horizontal crossbeam
      { type: 'wood_plank_h', x: 930, y: 448 },
      // Top blocks
      { type: 'wood_block', x: 910, y: 416 },
      { type: 'wood_block', x: 950, y: 416 }
    ]
  },
  {
    id: 2,
    name: "Double Trouble",
    subtitle: "Use Chuck's Speed Boost mid-flight!",
    birds: ['red', 'yellow', 'yellow'],
    hint: "Yellow Bird: Tap or click while in flight to activate Speed Boost!",
    starThresholds: [15000, 25000, 36000],
    pigs: [
      { type: 'basic', x: 875, y: 575 },
      { type: 'basic', x: 1025, y: 575 }
    ],
    blocks: [
      // Front protective barrier
      { type: 'wood_block', x: 770, y: 580 },
      { type: 'wood_block', x: 770, y: 540 },
      { type: 'wood_block', x: 770, y: 500 },

      // Tower 1
      { type: 'wood_plank_v', x: 840, y: 530 },
      { type: 'wood_plank_v', x: 910, y: 530 },
      { type: 'wood_plank_h', x: 875, y: 448 },
      { type: 'wood_block', x: 875, y: 416 },

      // Tower 2
      { type: 'wood_plank_v', x: 990, y: 530 },
      { type: 'wood_plank_v', x: 1060, y: 530 },
      { type: 'wood_plank_h', x: 1025, y: 448 },
      { type: 'wood_block', x: 1025, y: 416 }
    ]
  },
  {
    id: 3,
    name: "Glass Castle",
    subtitle: "Shatter brittle glass with The Blues!",
    birds: ['red', 'blue', 'blue'],
    hint: "Blue Bird: Tap in flight to split into 3 birds! Very effective on glass.",
    starThresholds: [22000, 35000, 48000],
    pigs: [
      { type: 'basic', x: 920, y: 515 },
      { type: 'basic', x: 980, y: 515 },
      { type: 'helmet', x: 950, y: 355 }
    ],
    blocks: [
      // Sturdy Stone base
      { type: 'stone_block', x: 860, y: 580 },
      { type: 'stone_block', x: 920, y: 580 },
      { type: 'stone_block', x: 980, y: 580 },
      { type: 'stone_block', x: 1040, y: 580 },
      { type: 'stone_plank_h', x: 950, y: 547 },

      // Brittle Glass columns
      { type: 'glass_plank_v', x: 890, y: 467 },
      { type: 'glass_plank_v', x: 950, y: 467 },
      { type: 'glass_plank_v', x: 1010, y: 467 },

      // Glass floor
      { type: 'glass_plank_h', x: 950, y: 387 },

      // Upper floor
      { type: 'wood_block', x: 910, y: 357 },
      { type: 'wood_block', x: 990, y: 357 },
      { type: 'stone_plank_h', x: 950, y: 324 }
    ]
  },
  {
    id: 4,
    name: "Bunker Buster",
    subtitle: "Detonate TNT and trigger collapses!",
    birds: ['red', 'yellow', 'blue', 'yellow'],
    hint: "TNT barrels explode violently when struck! Aim for structural weak spots.",
    starThresholds: [26000, 42000, 60000],
    pigs: [
      { type: 'helmet', x: 880, y: 535 },
      { type: 'basic', x: 980, y: 420 },
      { type: 'helmet', x: 1080, y: 535 }
    ],
    blocks: [
      // Left Bunker
      { type: 'stone_plank_v', x: 830, y: 530 },
      { type: 'tnt_box', x: 880, y: 578 },
      { type: 'stone_plank_v', x: 930, y: 530 },
      { type: 'stone_plank_h', x: 880, y: 447 },

      // Connecting Bridge
      { type: 'wood_plank_h', x: 980, y: 447 },

      // Right Bunker
      { type: 'stone_plank_v', x: 1030, y: 530 },
      { type: 'tnt_box', x: 1080, y: 578 },
      { type: 'stone_plank_v', x: 1130, y: 530 },
      { type: 'stone_plank_h', x: 1080, y: 447 },

      // Top Pyramid on right bunker
      { type: 'stone_block', x: 1060, y: 414 },
      { type: 'stone_block', x: 1100, y: 414 },
      { type: 'stone_block', x: 1080, y: 374 }
    ]
  },
  {
    id: 5,
    name: "King Pig's Citadel",
    subtitle: "Dethrone the King with all your might!",
    birds: ['red', 'yellow', 'blue', 'red'],
    hint: "Combine abilities: Yellow cuts wood, Blue shatters glass, Red smashes stone!",
    starThresholds: [32000, 52000, 75000],
    pigs: [
      { type: 'basic', x: 895, y: 575 },
      { type: 'helmet', x: 1005, y: 536 },
      { type: 'basic', x: 950, y: 377 },
      { type: 'king', x: 950, y: 236 }
    ],
    blocks: [
      // Lower Floor: 3 Heavy Stone Pillars
      { type: 'stone_plank_v', x: 840, y: 530 },
      { type: 'stone_plank_v', x: 950, y: 530 },
      { type: 'stone_plank_v', x: 1060, y: 530 },
      { type: 'tnt_box', x: 1005, y: 578 },

      // Floor 1 Ceilings
      { type: 'stone_plank_h', x: 895, y: 447 },
      { type: 'stone_plank_h', x: 1005, y: 447 },

      // Mid Floor: Glass & Wood supports
      { type: 'glass_plank_v', x: 870, y: 367 },
      { type: 'wood_block', x: 950, y: 417 },
      { type: 'glass_plank_v', x: 1030, y: 367 },
      { type: 'wood_plank_h', x: 950, y: 287 },

      // Top Floor (Throne Room)
      { type: 'wood_block', x: 900, y: 257 },
      { type: 'wood_block', x: 1000, y: 257 },
      { type: 'stone_block', x: 928, y: 195 },
      { type: 'stone_block', x: 972, y: 195 }
    ]
  }
];

// Helper to access level progress from localStorage
const LevelProgress = {
  getUnlockedLevel() {
    return parseInt(localStorage.getItem('angry_birds_unlocked') || '1', 10);
  },
  setUnlockedLevel(levelId) {
    const current = this.getUnlockedLevel();
    if (levelId > current) {
      localStorage.setItem('angry_birds_unlocked', levelId.toString());
    }
  },
  getLevelStars(levelId) {
    return parseInt(localStorage.getItem(`angry_birds_stars_${levelId}`) || '0', 10);
  },
  setLevelStars(levelId, stars) {
    const current = this.getLevelStars(levelId);
    if (stars > current) {
      localStorage.setItem(`angry_birds_stars_${levelId}`, stars.toString());
    }
  },
  getHighScore(levelId) {
    return parseInt(localStorage.getItem(`angry_birds_score_${levelId}`) || '0', 10);
  },
  setHighScore(levelId, score) {
    const current = this.getHighScore(levelId);
    if (score > current) {
      localStorage.setItem(`angry_birds_score_${levelId}`, score.toString());
    }
  },
  resetProgress() {
    localStorage.removeItem('angry_birds_unlocked');
    for (let i = 1; i <= GAME_LEVELS.length; i++) {
      localStorage.removeItem(`angry_birds_stars_${i}`);
      localStorage.removeItem(`angry_birds_score_${i}`);
    }
  }
};
