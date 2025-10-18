export type GameEventMap = {
  NEED_LOW: { type: string; value: number };
  OBJECT_PLACED: { id: string };
  SAVE_DONE: void;
  TIME_UPDATED: { hours: number; minutes: number };
  FUN_CHANGED: { value: number };
};

type Listener<T> = (payload: T) => void;

export class EventBus {
  private listeners = new Map<keyof GameEventMap, Set<Listener<any>>>();

  on<K extends keyof GameEventMap>(event: K, listener: Listener<GameEventMap[K]>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return () => this.off(event, listener);
  }

  off<K extends keyof GameEventMap>(event: K, listener: Listener<GameEventMap[K]>) {
    this.listeners.get(event)?.delete(listener);
  }

  emit<K extends keyof GameEventMap>(event: K, payload: GameEventMap[K]) {
    this.listeners.get(event)?.forEach((listener) => listener(payload));
  }
}
