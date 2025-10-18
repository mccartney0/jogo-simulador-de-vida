import { createWorld as bitecsCreateWorld, IWorld } from 'bitecs';

export interface GameWorld extends IWorld {
  time: number;
  delta: number;
  accumulator: number;
}

export function createWorld(): GameWorld {
  const world = bitecsCreateWorld() as GameWorld;
  world.time = 0;
  world.delta = 0;
  world.accumulator = 0;
  return world;
}
