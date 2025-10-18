import { defineQuery } from 'bitecs';
import { Needs, TaskQueue } from '../components';
import { GameWorld } from '../index';
import { NeedEffect } from '../../core/types';

const taskQuery = defineQuery([TaskQueue, Needs]);

export interface ActiveTask {
  id: number;
  effects: NeedEffect[];
  duration: number;
  elapsed: number;
}

export class InteractionSystem {
  private readonly activeTasks = new Map<number, ActiveTask>();
  private nextTaskId = 1;

  queueTask(entity: number, effects: NeedEffect[], duration: number) {
    const task: ActiveTask = {
      id: this.nextTaskId++,
      effects,
      duration,
      elapsed: 0
    };
    this.activeTasks.set(task.id, task);
    TaskQueue.current[entity] = task.id;
    TaskQueue.timer[entity] = 0;
  }

  clearTask(entity: number) {
    const current = TaskQueue.current[entity];
    if (current) {
      this.activeTasks.delete(current);
    }
    TaskQueue.current[entity] = 0;
    TaskQueue.timer[entity] = 0;
  }

  update(world: GameWorld, dt: number) {
    const entities = taskQuery(world);
    for (const eid of entities) {
      const taskId = TaskQueue.current[eid];
      if (!taskId) continue;
      const task = this.activeTasks.get(taskId);
      if (!task) continue;
      task.elapsed += dt;
      TaskQueue.timer[eid] = task.elapsed;
      if (task.elapsed >= task.duration) {
        this.applyEffects(eid, task.effects);
        this.activeTasks.delete(taskId);
        TaskQueue.current[eid] = 0;
        TaskQueue.timer[eid] = 0;
      }
    }
  }

  private applyEffects(entity: number, effects: NeedEffect[]) {
    for (const effect of effects) {
      switch (effect.need) {
        case 'hunger':
          Needs.hunger[entity] = Math.min(100, Needs.hunger[entity] + effect.amount);
          break;
        case 'energy':
          Needs.energy[entity] = Math.min(100, Needs.energy[entity] + effect.amount);
          break;
        case 'bladder':
          Needs.bladder[entity] = Math.min(100, Needs.bladder[entity] + effect.amount);
          break;
        case 'hygiene':
          Needs.hygiene[entity] = Math.min(100, Needs.hygiene[entity] + effect.amount);
          break;
        case 'fun':
          Needs.fun[entity] = Math.min(100, Needs.fun[entity] + effect.amount);
          break;
        case 'social':
          Needs.social[entity] = Math.min(100, Needs.social[entity] + effect.amount);
          break;
        default:
          break;
      }
    }
  }
}
