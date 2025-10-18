import { defineQuery } from 'bitecs';
import { Agent, Needs, TaskQueue } from '../components';
import { GameWorld } from '../index';
import { InteractionSystem } from './InteractionSystem';
import { actions } from '../../ai/goap/actionDefs';
import { goals } from '../../ai/goap/goals';
import { plan } from '../../ai/goap/planner';
import { EventBus } from '../../core/EventBus';
import { NeedsState } from '../../core/types';

const aiQuery = defineQuery([Agent, Needs, TaskQueue]);

export class AISystem {
  constructor(private interactionSystem: InteractionSystem, private eventBus: EventBus, private isAutonomous: () => boolean) {}

  update(world: GameWorld) {
    if (!this.isAutonomous()) return;
    const entities = aiQuery(world);
    for (const eid of entities) {
      if (TaskQueue.current[eid]) continue;
      const needs: NeedsState = {
        hunger: Needs.hunger[eid],
        energy: Needs.energy[eid],
        bladder: Needs.bladder[eid],
        hygiene: Needs.hygiene[eid],
        fun: Needs.fun[eid],
        social: Needs.social[eid]
      };
      const planResult = plan(needs, goals, actions);
      if (planResult) {
        this.interactionSystem.queueTask(eid, planResult.action.effects, planResult.action.duration);
      }
      if (needs.fun < 30) {
        this.eventBus.emit('NEED_LOW', { type: 'fun', value: needs.fun });
      }
    }
  }
}
