import { describe, it, expect } from 'vitest';
import { NeedSystem } from '../../src/game/ecs/systems/NeedSystem';
import { createWorld } from '../../src/game/ecs';
import { createAgent, Needs } from '../../src/game/ecs/components';

describe('NeedSystem', () => {
  it('decays needs over time and stays within range', () => {
    const world = createWorld();
    const agent = createAgent(world, 0, 0);
    const hungerBefore = Needs.hunger[agent];
    NeedSystem(world, 1);
    expect(Needs.hunger[agent]).toBeLessThan(hungerBefore);
    expect(Needs.hunger[agent]).toBeGreaterThanOrEqual(0);
  });
});
