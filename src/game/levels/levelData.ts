import { LevelData } from '../types';

export const GAME_LEVELS: LevelData[] = [
  {
    id: 1,
    name: "First Flight",
    subtitle: "Aim, pull back, and launch!",
    hint: "Drag the bird back from the slingshot. Release to launch!",
    birds: ['red', 'red', 'red'],
    starThresholds: [10000, 18000, 26000],
    pigs: [
      { type: 'basic', x: 940, y: 580 }
    ],
    blocks: [
      // Left and right wooden columns
      { type: 'wood_plank_v', x: 890, y: 540 },
      { type: 'wood_plank_v', x: 990, y: 540 },
      // Horizontal crossbeam
      { type: 'wood_plank_h', x: 940, y: 468 },
      // Top decorative crate blocks
      { type: 'wood_block', x: 915, y: 432 },
      { type: 'wood_block', x: 965, y: 432 }
    ]
  },
  {
    id: 2,
    name: "Double Trouble",
    subtitle: "Use Chuck's Speed Boost in mid-air!",
    hint: "Yellow Bird: Tap or click while in flight to activate supersonic Speed Boost!",
    birds: ['red', 'yellow', 'yellow'],
    starThresholds: [16000, 26000, 36000],
    pigs: [
      { type: 'basic', x: 880, y: 580 },
      { type: 'basic', x: 1040, y: 580 }
    ],
    blocks: [
      // Front wooden defensive barrier
      { type: 'wood_block', x: 790, y: 580 },
      { type: 'wood_block', x: 790, y: 532 },
      { type: 'wood_block', x: 790, y: 484 },

      // Tower 1
      { type: 'wood_plank_v', x: 845, y: 540 },
      { type: 'wood_plank_v', x: 915, y: 540 },
      { type: 'wood_plank_h', x: 880, y: 468 },
      { type: 'wood_block', x: 880, y: 432 },

      // Tower 2
      { type: 'wood_plank_v', x: 1005, y: 540 },
      { type: 'wood_plank_v', x: 1075, y: 540 },
      { type: 'wood_plank_h', x: 1040, y: 468 },
      { type: 'wood_block', x: 1040, y: 432 }
    ]
  },
  {
    id: 3,
    name: "Glass Menagerie",
    subtitle: "Shatter fragile glass with The Blues!",
    hint: "Blue Bird: Tap in flight to split into 3 birds! Extremely effective against glass.",
    birds: ['red', 'blue', 'blue'],
    starThresholds: [22000, 34000, 48000],
    pigs: [
      { type: 'basic', x: 910, y: 520 },
      { type: 'basic', x: 990, y: 520 },
      { type: 'helmet', x: 950, y: 350 }
    ],
    blocks: [
      // Sturdy Stone foundation
      { type: 'stone_block', x: 860, y: 580 },
      { type: 'stone_block', x: 920, y: 580 },
      { type: 'stone_block', x: 980, y: 580 },
      { type: 'stone_block', x: 1040, y: 580 },
      { type: 'stone_plank_h', x: 950, y: 546 },

      // Brittle Glass columns
      { type: 'glass_plank_v', x: 875, y: 476 },
      { type: 'glass_plank_v', x: 950, y: 476 },
      { type: 'glass_plank_v', x: 1025, y: 476 },

      // Glass floor
      { type: 'glass_plank_h', x: 950, y: 406 },

      // Upper floor with Helmet Pig
      { type: 'wood_block', x: 900, y: 370 },
      { type: 'wood_block', x: 1000, y: 370 },
      { type: 'stone_plank_h', x: 950, y: 334 }
    ]
  },
  {
    id: 4,
    name: "Bunker Buster",
    subtitle: "Detonate TNT beneath stone defenses!",
    hint: "TNT crates explode with extreme force! Trigger a structural collapse.",
    birds: ['red', 'yellow', 'blue', 'yellow'],
    starThresholds: [26000, 42000, 60000],
    pigs: [
      { type: 'helmet', x: 870, y: 535 },
      { type: 'basic', x: 975, y: 410 },
      { type: 'helmet', x: 1080, y: 535 }
    ],
    blocks: [
      // Heavy Stone outer pillars
      { type: 'stone_plank_v', x: 820, y: 540 },
      { type: 'stone_plank_v', x: 920, y: 540 },
      { type: 'stone_plank_v', x: 1030, y: 540 },
      { type: 'stone_plank_v', x: 1130, y: 540 },

      // Strategic central TNT crate between rooms!
      { type: 'tnt_block', x: 975, y: 580 },
      { type: 'stone_block', x: 975, y: 532 },

      // Stone Roof deck
      { type: 'stone_plank_h', x: 870, y: 466 },
      { type: 'stone_plank_h', x: 1080, y: 466 },
      { type: 'wood_plank_h', x: 975, y: 466 },

      // Watchtower top
      { type: 'glass_plank_v', x: 945, y: 400 },
      { type: 'glass_plank_v', x: 1005, y: 400 },
      { type: 'stone_plank_h', x: 975, y: 330 }
    ]
  },
  {
    id: 5,
    name: "Citadel of the King",
    subtitle: "Epic 3-tier grand boss fortress!",
    hint: "Use all bird abilities strategically to topple the royal throne!",
    birds: ['red', 'yellow', 'blue', 'yellow'],
    starThresholds: [35000, 55000, 75000],
    pigs: [
      { type: 'helmet', x: 860, y: 535 },
      { type: 'helmet', x: 1080, y: 535 },
      { type: 'king', x: 970, y: 345 }
    ],
    blocks: [
      // Base Floor Fortifications
      { type: 'stone_plank_v', x: 810, y: 540 },
      { type: 'stone_plank_v', x: 910, y: 540 },
      { type: 'tnt_block', x: 970, y: 580 },
      { type: 'stone_plank_v', x: 1030, y: 540 },
      { type: 'stone_plank_v', x: 1130, y: 540 },

      // Mid deck
      { type: 'stone_plank_h', x: 860, y: 466 },
      { type: 'wood_plank_h', x: 970, y: 466 },
      { type: 'stone_plank_h', x: 1080, y: 466 },

      // Tier 2 Columns (Wood & Glass)
      { type: 'wood_plank_v', x: 920, y: 406 },
      { type: 'glass_plank_v', x: 970, y: 406 },
      { type: 'wood_plank_v', x: 1020, y: 406 },

      // Throne platform
      { type: 'stone_plank_h', x: 970, y: 370 },

      // King's Canopy
      { type: 'wood_block', x: 920, y: 320 },
      { type: 'wood_block', x: 1020, y: 320 },
      { type: 'stone_plank_h', x: 970, y: 284 }
    ]
  }
];
