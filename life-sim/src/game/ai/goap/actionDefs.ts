import interactions from '../../data/interactions.json';
import { PlannerAction } from '../../core/types';

export const actions = interactions as PlannerAction[];

export function getAction(id: string) {
  return actions.find((action) => action.id === id);
}
