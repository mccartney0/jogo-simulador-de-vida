import { defineQuery } from 'bitecs';
import { IsoRenderer, SpriteHandle } from '../../world/IsoRenderer';
import { Transform, SpriteRef } from '../components';
import { GameWorld } from '../index';

const renderQuery = defineQuery([Transform, SpriteRef]);

export class RenderSystem {
  private readonly renderer: IsoRenderer;
  private readonly spriteRegistry = new Map<number, SpriteHandle>();

  constructor(renderer: IsoRenderer) {
    this.renderer = renderer;
  }

  registerHandle(entity: number, handle: SpriteHandle) {
    this.spriteRegistry.set(entity, handle);
  }

  update(world: GameWorld) {
    const entities = renderQuery(world);
    for (const eid of entities) {
      const handle = this.spriteRegistry.get(eid);
      if (!handle) continue;
      this.renderer.updateSpritePosition(handle, Transform.x[eid], Transform.y[eid]);
    }
    this.renderer.depthSort();
  }
}
