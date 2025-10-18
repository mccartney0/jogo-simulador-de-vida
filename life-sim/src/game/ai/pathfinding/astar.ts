import { PathGrid } from './grid';

interface NodeRecord {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent?: NodeRecord;
}

function heuristic(ax: number, ay: number, bx: number, by: number) {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

export function findPath(grid: PathGrid, start: { x: number; y: number }, goal: { x: number; y: number }) {
  const open: NodeRecord[] = [];
  const closed = new Set<string>();
  const startNode: NodeRecord = { x: start.x, y: start.y, g: 0, h: heuristic(start.x, start.y, goal.x, goal.y), f: 0 };
  startNode.f = startNode.g + startNode.h;
  open.push(startNode);

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const key = `${current.x},${current.y}`;
    if (closed.has(key)) continue;
    closed.add(key);
    if (current.x === goal.x && current.y === goal.y) {
      const path: Array<{ x: number; y: number }> = [];
      let node: NodeRecord | undefined = current;
      while (node) {
        path.push({ x: node.x, y: node.y });
        node = node.parent;
      }
      return path.reverse();
    }
    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 }
    ];
    for (const neighbor of neighbors) {
      const tile = grid.get(neighbor.x, neighbor.y);
      if (!tile || !tile.walkable) continue;
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (closed.has(neighborKey)) continue;
      const g = current.g + 1;
      const h = heuristic(neighbor.x, neighbor.y, goal.x, goal.y);
      const existing = open.find((node) => node.x === neighbor.x && node.y === neighbor.y);
      if (existing && existing.g <= g) continue;
      open.push({ x: neighbor.x, y: neighbor.y, g, h, f: g + h, parent: current });
    }
  }
  return null;
}
