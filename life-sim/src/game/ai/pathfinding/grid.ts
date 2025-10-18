export interface GridNode {
  x: number;
  y: number;
  walkable: boolean;
}

export class PathGrid {
  readonly width: number;
  readonly height: number;
  private nodes: GridNode[];

  constructor(width: number, height: number, walkables: boolean[][]) {
    this.width = width;
    this.height = height;
    this.nodes = new Array(width * height).fill(null).map((_, index) => {
      const x = index % width;
      const y = Math.floor(index / width);
      return { x, y, walkable: walkables[y][x] };
    });
  }

  get(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    return this.nodes[y * this.width + x];
  }
}
