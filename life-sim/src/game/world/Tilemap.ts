export type TileType = 'floor' | 'wall';

export interface Tile {
  type: TileType;
  occupied: boolean;
}

export class Tilemap {
  readonly width: number;
  readonly height: number;
  private tiles: Tile[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = new Array(width * height).fill(null).map(() => ({ type: 'floor', occupied: false }));
  }

  index(x: number, y: number) {
    return y * this.width + x;
  }

  inBounds(x: number, y: number) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  get(x: number, y: number) {
    if (!this.inBounds(x, y)) return null;
    return this.tiles[this.index(x, y)];
  }

  setOccupancy(x: number, y: number, occupied: boolean) {
    const tile = this.get(x, y);
    if (tile) tile.occupied = occupied;
  }

  isWalkable(x: number, y: number) {
    const tile = this.get(x, y);
    if (!tile) return false;
    return tile.type === 'floor' && !tile.occupied;
  }

  markFootprint(x: number, y: number, width: number, height: number, occupied: boolean) {
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        this.setOccupancy(x + dx, y + dy, occupied);
      }
    }
  }
}
