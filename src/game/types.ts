export type BirdType = 'red' | 'yellow' | 'blue';

export type PigType = 'basic' | 'helmet' | 'king';

export type BlockMaterial = 'wood' | 'glass' | 'stone' | 'tnt';

export type BlockShape = 'plank_h' | 'plank_v' | 'block' | 'tnt';

export interface PigConfig {
  type: PigType;
  x: number;
  y: number;
  radius?: number;
}

export interface BlockConfig {
  type: string; // e.g. 'wood_plank_h', 'glass_block', 'stone_plank_v', 'tnt_block'
  x: number;
  y: number;
  angle?: number;
}

export interface LevelData {
  id: number;
  name: string;
  subtitle: string;
  hint: string;
  birds: BirdType[];
  starThresholds: [number, number, number];
  pigs: PigConfig[];
  blocks: BlockConfig[];
}

export interface GameScoreUpdate {
  score: number;
  delta: number;
  x?: number;
  y?: number;
  reason?: string;
}

export interface GameEventMap {
  'SCORE_UPDATED': (data: GameScoreUpdate) => void;
  'LEVEL_LOADED': (level: LevelData) => void;
  'BIRD_LAUNCHED': (birdType: BirdType, remainingCount: number) => void;
  'BIRD_ABILITY_READY': (birdType: BirdType, ready: boolean) => void;
  'BIRD_ABILITY_USED': (birdType: BirdType) => void;
  'BIRD_SETTLED': () => void;
  'PIG_DEFEATED': (pigType: PigType, remaining: number, score: number) => void;
  'BLOCK_DESTROYED': (material: BlockMaterial, score: number) => void;
  'LEVEL_VICTORY': (result: {
    levelId: number;
    score: number;
    stars: number;
    birdsUnused: number;
    birdBonus: number;
    isHighScore: boolean;
  }) => void;
  'LEVEL_DEFEAT': (result: {
    levelId: number;
    score: number;
    reason: string;
  }) => void;
  'CAMERA_PAN_START': () => void;
  'AUDIO_TOGGLE_REQUEST': () => void;
  'TOGGLE_PAUSE': () => void;
}
