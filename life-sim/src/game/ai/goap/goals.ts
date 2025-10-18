import { PlannerGoal } from '../../core/types';

export const goals: PlannerGoal[] = [
  { id: 'stay-fed', target: 'hunger', threshold: 60 },
  { id: 'stay-rested', target: 'energy', threshold: 60 },
  { id: 'stay-clean', target: 'hygiene', threshold: 55 },
  { id: 'stay-entertained', target: 'fun', threshold: 55 },
  { id: 'stay-social', target: 'social', threshold: 50 },
  { id: 'stay-comfortable', target: 'bladder', threshold: 55 }
];
