import { LevelData } from '../types';
import { gameEvents } from '../events';

export class ScoringSystem {
  public currentScore: number = 0;
  public levelData: LevelData;

  constructor(levelData: LevelData) {
    this.levelData = levelData;
    this.currentScore = 0;
  }

  public addScore(points: number): number {
    this.currentScore += points;
    return this.currentScore;
  }

  public calculateStars(finalScore: number): number {
    const thresholds = this.levelData.starThresholds;
    if (finalScore >= thresholds[2]) return 3;
    if (finalScore >= thresholds[1]) return 2;
    if (finalScore >= thresholds[0]) return 1;
    return 1; // Any cleared level gives at least 1 star
  }

  public getHighScore(): number {
    if (typeof window === 'undefined') return 0;
    const key = `angry_birds_highscore_${this.levelData.id}`;
    return parseInt(localStorage.getItem(key) || '0', 10);
  }

  public saveLevelProgress(finalScore: number, stars: number): boolean {
    if (typeof window === 'undefined') return false;

    // Check high score
    const oldHigh = this.getHighScore();
    const isNewHigh = finalScore > oldHigh;
    if (isNewHigh) {
      localStorage.setItem(`angry_birds_highscore_${this.levelData.id}`, String(finalScore));
    }

    // Save stars if higher
    const oldStars = parseInt(localStorage.getItem(`angry_birds_stars_${this.levelData.id}`) || '0', 10);
    if (stars > oldStars) {
      localStorage.setItem(`angry_birds_stars_${this.levelData.id}`, String(stars));
    }

    // Unlock next level
    const currentUnlocked = parseInt(localStorage.getItem('angry_birds_unlocked') || '1', 10);
    if (this.levelData.id >= currentUnlocked && this.levelData.id < 5) {
      localStorage.setItem('angry_birds_unlocked', String(this.levelData.id + 1));
    }

    return isNewHigh;
  }

  public reset(): void {
    this.currentScore = 0;
  }
}
