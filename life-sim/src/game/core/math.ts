export interface IsoPoint {
  x: number;
  y: number;
}

export function cartToIso(x: number, y: number, tileWidth = 64, tileHeight = 32): IsoPoint {
  return {
    x: (x - y) * (tileWidth / 2),
    y: (x + y) * (tileHeight / 2)
  };
}

export function isoToCart(x: number, y: number, tileWidth = 64, tileHeight = 32): IsoPoint {
  return {
    x: (x / (tileWidth / 2) + y / (tileHeight / 2)) / 2,
    y: (y / (tileHeight / 2) - x / (tileWidth / 2)) / 2
  };
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
