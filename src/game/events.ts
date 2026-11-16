import { GameEventMap } from './types';

type Listener<T extends keyof GameEventMap> = GameEventMap[T];

class GameEventBus {
  private listeners: { [K in keyof GameEventMap]?: Array<GameEventMap[K]> } = {};

  public on<K extends keyof GameEventMap>(event: K, fn: Listener<K>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(fn);

    return () => {
      this.off(event, fn);
    };
  }

  public off<K extends keyof GameEventMap>(event: K, fn: Listener<K>): void {
    const list = this.listeners[event];
    if (!list) return;
    this.listeners[event] = list.filter((item) => item !== fn) as any;
  }

  public emit<K extends keyof GameEventMap>(event: K, ...args: Parameters<GameEventMap[K]>): void {
    const list = this.listeners[event];
    if (!list || list.length === 0) return;
    for (const fn of list) {
      try {
        (fn as any)(...args);
      } catch (err) {
        console.error(`Error in event listener for ${String(event)}:`, err);
      }
    }
  }

  public clear(): void {
    this.listeners = {};
  }
}

export const gameEvents = new GameEventBus();
