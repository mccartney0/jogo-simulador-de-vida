import { findPath } from './astar';
import { PathGrid } from './grid';

interface RequestMessage {
  id: number;
  type: 'path';
  start: { x: number; y: number };
  goal: { x: number; y: number };
  walkables: boolean[][];
}

interface ResponseMessage {
  id: number;
  path: Array<{ x: number; y: number }> | null;
}

self.onmessage = (event: MessageEvent<RequestMessage>) => {
  const data = event.data;
  if (data.type === 'path') {
    const grid = new PathGrid(data.walkables[0].length, data.walkables.length, data.walkables);
    const path = findPath(grid, data.start, data.goal);
    const response: ResponseMessage = { id: data.id, path };
    (self as any).postMessage(response);
  }
};

export {};
