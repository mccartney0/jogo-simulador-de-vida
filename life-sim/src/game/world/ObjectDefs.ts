import objects from '../data/objects.json';
import { ObjectDefinition } from '../core/types';

const objectMap = new Map<string, ObjectDefinition>();
objects.forEach((def) => objectMap.set(def.id, def));

export function getObjectDefinitions() {
  return objects as ObjectDefinition[];
}

export function getObjectDefinition(id: string) {
  return objectMap.get(id);
}
