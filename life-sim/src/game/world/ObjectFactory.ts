import { IsoRenderer, SpriteHandle } from './IsoRenderer';
import { Tilemap } from './Tilemap';
import { ObjectDefinition } from '../core/types';

export interface PlacedObject {
  id: string;
  def: ObjectDefinition;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  sprite: SpriteHandle;
}

export class ObjectFactory {
  private readonly renderer: IsoRenderer;
  private readonly tilemap: Tilemap;
  private readonly objects: PlacedObject[] = [];

  constructor(renderer: IsoRenderer, tilemap: Tilemap) {
    this.renderer = renderer;
    this.tilemap = tilemap;
  }

  place(def: ObjectDefinition, x: number, y: number, rotation = 0) {
    const width = rotation % 2 === 0 ? def.footprint.width : def.footprint.height;
    const height = rotation % 2 === 0 ? def.footprint.height : def.footprint.width;
    const sprite = this.renderer.createObjectSprite(def, rotation);
    this.renderer.updateSpritePosition(sprite, x, y);
    this.tilemap.markFootprint(x, y, width, height, true);
    const placed: PlacedObject = { id: def.id, def, x, y, rotation, width, height, sprite };
    this.objects.push(placed);
    return placed;
  }

  canPlace(def: ObjectDefinition, x: number, y: number, rotation = 0) {
    const width = rotation % 2 === 0 ? def.footprint.width : def.footprint.height;
    const height = rotation % 2 === 0 ? def.footprint.height : def.footprint.width;
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        const tile = this.tilemap.get(x + dx, y + dy);
        if (!tile || tile.occupied) return false;
      }
    }
    return true;
  }

  getObjects() {
    return this.objects;
  }

  removeAt(x: number, y: number) {
    const index = this.objects.findIndex(
      (obj) => x >= obj.x && x < obj.x + obj.width && y >= obj.y && y < obj.y + obj.height
    );
    if (index === -1) return null;
    const [object] = this.objects.splice(index, 1);
    this.tilemap.markFootprint(object.x, object.y, object.width, object.height, false);
    object.sprite.container.destroy();
    return object;
  }
}
