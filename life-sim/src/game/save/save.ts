import { openDB } from 'idb';
import { applyMigrations } from './migrations';

const DB_NAME = 'life-sim-save';
const STORE_NAME = 'slot';

interface SaveState {
  version: number;
  timestamp: number;
  needs: Record<string, number>;
  funds: number;
}

export async function loadGame() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(database) {
      database.createObjectStore(STORE_NAME);
    }
  });
  const raw = await db.get(STORE_NAME, 'primary');
  if (!raw) return null;
  return applyMigrations(raw as SaveState);
}

export async function saveGame(state: SaveState) {
  const db = await openDB(DB_NAME, 1, {
    upgrade(database) {
      database.createObjectStore(STORE_NAME);
    }
  });
  await db.put(STORE_NAME, state, 'primary');
}

export function createSaveSnapshot(needs: Record<string, number>, funds: number): SaveState {
  return {
    version: 2,
    timestamp: Date.now(),
    needs,
    funds
  };
}
