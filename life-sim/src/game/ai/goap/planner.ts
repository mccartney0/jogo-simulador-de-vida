import { NeedsState, PlannerAction, PlannerGoal } from '../../core/types';

export interface PlanResult {
  action: PlannerAction;
}

export function plan(needs: NeedsState, goals: PlannerGoal[], actions: PlannerAction[]): PlanResult | null {
  const sortedGoals = [...goals].sort((a, b) => needs[a.target] - needs[b.target]);
  for (const goal of sortedGoals) {
    if (needs[goal.target] >= goal.threshold) continue;
    const candidates = actions.filter((action) =>
      action.effects.some((effect) => effect.need === goal.target && effect.amount > 0)
    );
    if (!candidates.length) continue;
    candidates.sort((a, b) => b.effects.reduce((sum, eff) => sum + eff.amount, 0) - a.effects.reduce((sum, eff) => sum + eff.amount, 0));
    const best = candidates[0];
    return { action: best };
  }
  return null;
}
