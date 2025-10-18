export interface NeedEffect {
  need: keyof NeedsState;
  amount: number;
}

export interface InteractionDefinition {
  id: string;
  nameKey: string;
  duration: number;
  preconditions: Partial<NeedsState>;
  effects: NeedEffect[];
  targetNeed?: keyof NeedsState;
}

export interface ObjectDefinition {
  id: string;
  nameKey: string;
  category: string;
  cost: number;
  footprint: { width: number; height: number };
  entry: { x: number; y: number };
  interactions: string[];
  rotation?: number;
}

export interface NeedsState {
  hunger: number;
  energy: number;
  bladder: number;
  hygiene: number;
  fun: number;
  social: number;
}

export interface TraitDefinition {
  id: string;
  nameKey: string;
  modifiers: Partial<Record<keyof NeedsState, number>>;
}

export interface CareerDefinition {
  id: string;
  nameKey: string;
  descriptionKey: string;
}

export interface PlannerGoal {
  id: string;
  target: keyof NeedsState;
  threshold: number;
}

export interface PlannerAction {
  id: string;
  interaction: string;
  cost: number;
  effects: NeedEffect[];
  preconditions: Partial<NeedsState>;
  duration: number;
}
