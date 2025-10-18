import { defineQuery } from 'bitecs';
import { Animation } from '../components';
import { GameWorld } from '../index';

const animationQuery = defineQuery([Animation]);

export function AnimationSystem(world: GameWorld, dt: number) {
  const entities = animationQuery(world);
  for (const eid of entities) {
    Animation.timer[eid] += dt * Animation.speed[eid];
    if (Animation.timer[eid] >= 1) {
      Animation.frame[eid] = (Animation.frame[eid] + 1) % Animation.totalFrames[eid];
      Animation.timer[eid] = 0;
    }
  }
}
