import { describe, it, expect, vi } from 'vitest';
import { TimeSystem } from '../../src/game/core/TimeSystem';
import { EventBus } from '../../src/game/core/EventBus';
import { createWorld } from '../../src/game/ecs';

describe('TimeSystem', () => {
  it('advances minutes according to scale', () => {
    const bus = new EventBus();
    const timeSystem = new TimeSystem(bus);
    const world = createWorld();
    const spy = vi.fn();
    bus.on('TIME_UPDATED', spy);
    timeSystem.update(world, 1);
    expect(spy).toHaveBeenCalled();
  });
});
