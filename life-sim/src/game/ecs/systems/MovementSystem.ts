import { defineQuery } from 'bitecs';
import { Transform, Velocity } from '../components';
import { GameWorld } from '../index';

const moveQuery = defineQuery([Transform, Velocity]);

export function MovementSystem(world: GameWorld, dt: number) {
  const entities = moveQuery(world);
  for (const eid of entities) {
    Transform.x[eid] += Velocity.x[eid] * dt;
    Transform.y[eid] += Velocity.y[eid] * dt;
  }
}
