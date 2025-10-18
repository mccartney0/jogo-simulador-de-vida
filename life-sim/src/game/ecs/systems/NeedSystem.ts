import { defineQuery } from 'bitecs';
import { Needs } from '../components';
import { GameWorld } from '../index';
import { clamp } from '../../core/math';

const needQuery = defineQuery([Needs]);

const baseDecay = {
  hunger: 0.8,
  energy: 0.6,
  bladder: 0.7,
  hygiene: 0.5,
  fun: 0.4,
  social: 0.2
};

export function NeedSystem(world: GameWorld, dt: number) {
  const entities = needQuery(world);
  for (const eid of entities) {
    Needs.hunger[eid] = clamp(Needs.hunger[eid] - baseDecay.hunger * dt, 0, 100);
    Needs.energy[eid] = clamp(Needs.energy[eid] - baseDecay.energy * dt, 0, 100);
    Needs.bladder[eid] = clamp(Needs.bladder[eid] - baseDecay.bladder * dt, 0, 100);
    Needs.hygiene[eid] = clamp(Needs.hygiene[eid] - baseDecay.hygiene * dt, 0, 100);
    Needs.fun[eid] = clamp(Needs.fun[eid] - baseDecay.fun * dt, 0, 100);
    Needs.social[eid] = clamp(Needs.social[eid] - baseDecay.social * dt, 0, 100);
  }
}
