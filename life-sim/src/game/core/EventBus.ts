export type GameEventMap = {
  NEED_LOW: { type: string; value: number };
  OBJECT_PLACED: { id: string };
  SAVE_DONE: void;
  TIME_UPDATED: { hours: number; minutes: number };
  FUN_CHANGED: { value: number };
};

type Listener<T> = (payload: T) => void;

export class EventBus {
  private listeners = new Map<keyof GameEventMap, Set<Listener<unknown>>>();

  on<K extends keyof GameEventMap>(event: K, listener: Listener<GameEventMap[K]>) {
    const listeners = this.listeners.get(event) ?? new Set<Listener<unknown>>();
    listeners.add(listener as Listener<unknown>);
    this.listeners.set(event, listeners);
    return () => this.off(event, listener);
  }

  off<K extends keyof GameEventMap>(event: K, listener: Listener<GameEventMap[K]>) {
    this.listeners.get(event)?.delete(listener as Listener<unknown>);
  }

  emit<K extends keyof GameEventMap>(event: K, payload: GameEventMap[K]) {
    this.listeners.get(event)?.forEach((listener) => listener(payload));
  }
}
