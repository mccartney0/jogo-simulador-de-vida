interface SaveV1 {
  version: 1;
  timestamp: number;
  needs: Record<string, number>;
}

interface SaveV2 {
  version: 2;
  timestamp: number;
  needs: Record<string, number>;
  funds: number;
}

type AnySave = SaveV1 | SaveV2;

export function applyMigrations(save: AnySave): SaveV2 {
  if (save.version === 2) {
    return save as SaveV2;
  }
  const migrated: SaveV2 = {
    version: 2,
    timestamp: save.timestamp,
    needs: save.needs,
    funds: 2000
  };
  return migrated;
}
