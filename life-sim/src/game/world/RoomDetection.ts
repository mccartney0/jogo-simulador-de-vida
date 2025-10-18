import { Tilemap } from './Tilemap';

export interface RoomInfo {
  id: number;
  tiles: Array<{ x: number; y: number }>;
}

export class RoomDetection {
  constructor(private tilemap: Tilemap) {}

  detect(): RoomInfo[] {
    const visited = new Set<string>();
    const rooms: RoomInfo[] = [];
    let id = 0;
    for (let y = 0; y < this.tilemap.height; y++) {
      for (let x = 0; x < this.tilemap.width; x++) {
        const key = `${x},${y}`;
        if (visited.has(key)) continue;
        const tile = this.tilemap.get(x, y);
        if (!tile || tile.type !== 'floor') continue;
        const roomTiles: Array<{ x: number; y: number }> = [];
        const stack = [{ x, y }];
        while (stack.length) {
          const node = stack.pop()!;
          const nodeKey = `${node.x},${node.y}`;
          if (visited.has(nodeKey)) continue;
          visited.add(nodeKey);
          const nodeTile = this.tilemap.get(node.x, node.y);
          if (!nodeTile || nodeTile.type !== 'floor') continue;
          roomTiles.push(node);
          const neighbors = [
            { x: node.x + 1, y: node.y },
            { x: node.x - 1, y: node.y },
            { x: node.x, y: node.y + 1 },
            { x: node.x, y: node.y - 1 }
          ];
          for (const neighbor of neighbors) {
            if (!this.tilemap.inBounds(neighbor.x, neighbor.y)) continue;
            stack.push(neighbor);
          }
        }
        if (roomTiles.length) {
          rooms.push({ id: id++, tiles: roomTiles });
        }
      }
    }
    return rooms;
  }
}
