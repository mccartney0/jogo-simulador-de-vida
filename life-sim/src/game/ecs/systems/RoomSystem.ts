import { defineQuery } from 'bitecs';
import { RoomDetection } from '../../world/RoomDetection';
import { Transform, RoomId } from '../components';
import { GameWorld } from '../index';

const roomQuery = defineQuery([Transform, RoomId]);

export class RoomSystem {
  constructor(private detection: RoomDetection) {}

  update(world: GameWorld) {
    const rooms = this.detection.detect();
    const entities = roomQuery(world);
    for (const eid of entities) {
      RoomId.id[eid] = -1;
      const x = Math.round(Transform.x[eid]);
      const y = Math.round(Transform.y[eid]);
      for (const room of rooms) {
        if (room.tiles.some((tile) => tile.x === x && tile.y === y)) {
          RoomId.id[eid] = room.id;
          break;
        }
      }
    }
  }
}
