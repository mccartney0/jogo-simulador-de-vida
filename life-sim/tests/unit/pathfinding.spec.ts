import { describe, it, expect } from 'vitest';
import { PathGrid } from '../../src/game/ai/pathfinding/grid';
import { findPath } from '../../src/game/ai/pathfinding/astar';

describe('Pathfinding', () => {
  it('finds a path avoiding obstacles', () => {
    const walkables = [
      [true, true, true, true],
      [true, false, false, true],
      [true, true, true, true]
    ];
    const grid = new PathGrid(4, 3, walkables);
    const path = findPath(grid, { x: 0, y: 0 }, { x: 3, y: 2 });
    expect(path).not.toBeNull();
    expect(path![path!.length - 1]).toEqual({ x: 3, y: 2 });
  });
});
