import { ObjectDefinition } from '../core/types';
import { Tilemap } from './Tilemap';

export function validatePlacement(
  tilemap: Tilemap,
  def: ObjectDefinition,
  x: number,
  y: number,
  rotation = 0
) {
  const width = rotation % 2 === 0 ? def.footprint.width : def.footprint.height;
  const height = rotation % 2 === 0 ? def.footprint.height : def.footprint.width;
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      if (!tilemap.inBounds(x + dx, y + dy)) return false;
      const tile = tilemap.get(x + dx, y + dy);
      if (!tile || tile.occupied) return false;
    }
  }
  return true;
}
