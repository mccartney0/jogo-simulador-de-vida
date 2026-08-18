import { addComponent, addEntity, defineComponent, defineQuery, Types, IWorld, removeComponent } from 'bitecs';

export const Transform = defineComponent({
  x: Types.f32,
  y: Types.f32
});

export const Iso = defineComponent({
  zIndex: Types.i16
});

export const Velocity = defineComponent({
  x: Types.f32,
  y: Types.f32
});

export const Needs = defineComponent({
  hunger: Types.f32,
  energy: Types.f32,
  bladder: Types.f32,
  hygiene: Types.f32,
  fun: Types.f32,
  social: Types.f32
});

export const Agent = defineComponent({
  speed: Types.f32
});

export const Selected = defineComponent();

export const Interactable = defineComponent({
  interactionId: Types.ui8
});

export const SpriteRef = defineComponent({
  spriteId: Types.ui16
});

export const Animation = defineComponent({
  frame: Types.ui8,
  totalFrames: Types.ui8,
  timer: Types.f32,
  speed: Types.f32
});

export const TaskQueue = defineComponent({
  current: Types.ui16,
  timer: Types.f32
});

export const Traits = defineComponent({
  trait0: Types.ui8,
  trait1: Types.ui8,
  trait2: Types.ui8
});

export const RoomId = defineComponent({
  id: Types.i16
});

export const agentQuery = defineQuery([Agent, Transform, Needs]);

export function clampNeeds(world: IWorld) {
  const ents = agentQuery(world);
  for (const eid of ents) {
    Needs.hunger[eid] = Math.min(100, Math.max(0, Needs.hunger[eid]));
    Needs.energy[eid] = Math.min(100, Math.max(0, Needs.energy[eid]));
    Needs.bladder[eid] = Math.min(100, Math.max(0, Needs.bladder[eid]));
    Needs.hygiene[eid] = Math.min(100, Math.max(0, Needs.hygiene[eid]));
    Needs.fun[eid] = Math.min(100, Math.max(0, Needs.fun[eid]));
    Needs.social[eid] = Math.min(100, Math.max(0, Needs.social[eid]));
  }
}

export function createAgent(world: IWorld, x: number, y: number) {
  const eid = addEntity(world);
  addComponent(world, Transform, eid);
  addComponent(world, Iso, eid);
  addComponent(world, Velocity, eid);
  addComponent(world, Needs, eid);
  addComponent(world, Agent, eid);
  addComponent(world, SpriteRef, eid);
  addComponent(world, Animation, eid);
  addComponent(world, TaskQueue, eid);
  addComponent(world, Traits, eid);
  addComponent(world, RoomId, eid);
  Transform.x[eid] = x;
  Transform.y[eid] = y;
  Iso.zIndex[eid] = 0;
  Velocity.x[eid] = 0;
  Velocity.y[eid] = 0;
  Needs.hunger[eid] = 70;
  Needs.energy[eid] = 70;
  Needs.bladder[eid] = 70;
  Needs.hygiene[eid] = 70;
  Needs.fun[eid] = 70;
  Needs.social[eid] = 70;
  Agent.speed[eid] = 2.4;
  SpriteRef.spriteId[eid] = 0;
  Animation.frame[eid] = 0;
  Animation.totalFrames[eid] = 4;
  Animation.speed[eid] = 6;
  Animation.timer[eid] = 0;
  TaskQueue.current[eid] = 0;
  TaskQueue.timer[eid] = 0;
  Traits.trait0[eid] = 1;
  Traits.trait1[eid] = 2;
  Traits.trait2[eid] = 3;
  RoomId.id[eid] = -1;
  return eid;
}

export function markSelected(world: IWorld, eid: number) {
  addComponent(world, Selected, eid);
}

export function clearSelected(world: IWorld, eid: number) {
  removeComponent(world, Selected, eid);
}
