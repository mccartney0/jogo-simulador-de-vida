import { GameWorld } from '../ecs';
import { EventBus } from './EventBus';

const MINUTES_PER_SECOND = 1;

export class TimeSystem {
  private minutes = 8 * 60;
  private readonly eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  update(world: GameWorld, dt: number) {
    const deltaMinutes = dt * (60 * MINUTES_PER_SECOND);
    this.minutes = (this.minutes + deltaMinutes) % (24 * 60);
    const hours = Math.floor(this.minutes / 60);
    const minutes = Math.floor(this.minutes % 60);
    this.eventBus.emit('TIME_UPDATED', { hours, minutes });
  }

  getTime() {
    return this.minutes;
  }
}
