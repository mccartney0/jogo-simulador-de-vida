import { Container, Graphics } from 'pixi.js';
import { ObjectDefinition } from '../core/types';
import { cartToIso } from '../core/math';

interface Dimensions {
  width: number;
  height: number;
}

interface ObjectStyle {
  height: number;
  baseColor: number;
  accentColor?: number;
  accentSecondary?: number;
  detail?: (container: Container, dims: Dimensions, rotation: number, style: ObjectStyle) => void;
}

const defaultStyle: ObjectStyle = {
  height: 28,
  baseColor: 0x64748b,
  accentColor: 0x94a3b8
};

const categoryStyles: Record<string, ObjectStyle> = {
  furniture: {
    height: 26,
    baseColor: 0x7c3aed,
    accentColor: 0xa855f7
  },
  plumbing: {
    height: 30,
    baseColor: 0xe2e8f0,
    accentColor: 0x94a3b8
  },
  entertainment: {
    height: 28,
    baseColor: 0x0f172a,
    accentColor: 0x1e293b
  },
  appliances: {
    height: 30,
    baseColor: 0xe5e7eb,
    accentColor: 0xcbd5f5
  }
};

const objectStyles: Record<string, ObjectStyle> = {
  bed_basic: {
    height: 32,
    baseColor: 0x7c3aed,
    accentColor: 0xfef3c7,
    accentSecondary: 0x6366f1,
    detail: drawBed
  },
  fridge_basic: {
    height: 70,
    baseColor: 0xe2e8f0,
    accentColor: 0x94a3b8,
    detail: drawFridge
  },
  toilet_basic: {
    height: 30,
    baseColor: 0xf8fafc,
    accentColor: 0xcbd5f5,
    detail: drawToilet
  },
  shower_basic: {
    height: 46,
    baseColor: 0xdbeafe,
    accentColor: 0x38bdf8,
    detail: drawShower
  },
  tv_basic: {
    height: 34,
    baseColor: 0x111827,
    accentColor: 0x0f172a,
    accentSecondary: 0x38bdf8,
    detail: drawTv
  },
  sofa_basic: {
    height: 28,
    baseColor: 0xf97316,
    accentColor: 0xfcd34d,
    accentSecondary: 0xea580c,
    detail: drawSofa
  },
  table_basic: {
    height: 24,
    baseColor: 0xfbbf24,
    accentColor: 0x92400e,
    detail: drawTable
  },
  door_basic: {
    height: 72,
    baseColor: 0x8b5a2b,
    accentColor: 0xf1dec9,
    accentSecondary: 0xc2410c,
    detail: drawDoor
  },
  counter_basic: {
    height: 32,
    baseColor: 0x94a3b8,
    accentColor: 0xe2e8f0,
    accentSecondary: 0x475569,
    detail: drawCounter
  },
  stove_basic: {
    height: 30,
    baseColor: 0xd6d3d1,
    accentColor: 0x0f172a,
    accentSecondary: 0xf8fafc,
    detail: drawStove
  }
};

export function createObjectVisual(def: ObjectDefinition, rotation = 0) {
  const dims = getDimensions(def, rotation);
  const style = objectStyles[def.id] ?? categoryStyles[def.category] ?? defaultStyle;
  const outer = new Container();
  const visual = new Container();
  visual.position.y = -style.height;
  outer.addChild(visual);

  const base = drawBasePrism(dims, style.height, style.baseColor);
  visual.addChild(base);

  if (style.detail) {
    style.detail(visual, dims, rotation, style);
  }

  return outer;
}

function getDimensions(def: ObjectDefinition, rotation: number): Dimensions {
  if (rotation % 2 === 0) {
    return { width: def.footprint.width, height: def.footprint.height };
  }
  return { width: def.footprint.height, height: def.footprint.width };
}

function drawBasePrism(dims: Dimensions, height: number, color: number) {
  const container = new Graphics();
  const corners = getIsoCorners(dims);
  const [tl, tr, br, bl] = corners;
  const frontColor = adjustColor(color, -0.25);
  const sideColor = adjustColor(color, -0.18);
  const topColor = adjustColor(color, 0.1);

  container.beginFill(sideColor, 0.95);
  container.drawPolygon([
    tr.x,
    tr.y,
    br.x,
    br.y,
    br.x,
    br.y + height,
    tr.x,
    tr.y + height
  ]);
  container.endFill();

  container.beginFill(frontColor, 0.95);
  container.drawPolygon([
    bl.x,
    bl.y,
    br.x,
    br.y,
    br.x,
    br.y + height,
    bl.x,
    bl.y + height
  ]);
  container.endFill();

  container.beginFill(topColor, 0.98);
  container.drawPolygon([
    tl.x,
    tl.y,
    tr.x,
    tr.y,
    br.x,
    br.y,
    bl.x,
    bl.y
  ]);
  container.endFill();

  return container;
}

function getIsoCorners(dims: Dimensions) {
  const corners = [
    { x: 0, y: 0 },
    { x: dims.width, y: 0 },
    { x: dims.width, y: dims.height },
    { x: 0, y: dims.height }
  ];
  const center = cartToIso(dims.width / 2, dims.height / 2);
  return corners.map((corner) => {
    const iso = cartToIso(corner.x, corner.y);
    return { x: iso.x - center.x, y: iso.y - center.y };
  });
}

function projectTopPoint(dims: Dimensions, x: number, y: number) {
  const center = cartToIso(dims.width / 2, dims.height / 2);
  const iso = cartToIso(x, y);
  return { x: iso.x - center.x, y: iso.y - center.y };
}

function projectFrontPoint(dims: Dimensions, height: number, xRatio: number, yRatio: number) {
  const corners = getIsoCorners(dims);
  const bl = corners[3];
  const br = corners[2];
  const topPoint = {
    x: bl.x + (br.x - bl.x) * xRatio,
    y: bl.y + (br.y - bl.y) * xRatio
  };
  return {
    x: topPoint.x,
    y: topPoint.y + height * yRatio
  };
}

function drawTopRect(
  container: Container,
  dims: Dimensions,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number,
  alpha = 0.95
) {
  const graphic = new Graphics();
  const p0 = projectTopPoint(dims, x, y);
  const p1 = projectTopPoint(dims, x + width, y);
  const p2 = projectTopPoint(dims, x + width, y + height);
  const p3 = projectTopPoint(dims, x, y + height);
  graphic.beginFill(color, alpha);
  graphic.drawPolygon([p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y]);
  graphic.endFill();
  container.addChild(graphic);
}

function drawFrontPanel(
  container: Container,
  dims: Dimensions,
  height: number,
  xStart: number,
  xEnd: number,
  yStart: number,
  yEnd: number,
  color: number,
  alpha = 0.9
) {
  const graphic = new Graphics();
  const p0 = projectFrontPoint(dims, height, xStart, yStart);
  const p1 = projectFrontPoint(dims, height, xEnd, yStart);
  const p2 = projectFrontPoint(dims, height, xEnd, yEnd);
  const p3 = projectFrontPoint(dims, height, xStart, yEnd);
  graphic.beginFill(color, alpha);
  graphic.drawPolygon([p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y]);
  graphic.endFill();
  container.addChild(graphic);
}

function drawFrontLine(
  container: Container,
  dims: Dimensions,
  height: number,
  x: number,
  yStart: number,
  yEnd: number,
  color: number,
  thickness = 2,
  alpha = 0.9
) {
  const graphic = new Graphics();
  const p0 = projectFrontPoint(dims, height, x, yStart);
  const p1 = projectFrontPoint(dims, height, x, yEnd);
  graphic.lineStyle(thickness, color, alpha);
  graphic.moveTo(p0.x, p0.y);
  graphic.lineTo(p1.x, p1.y);
  container.addChild(graphic);
}

function drawBed(container: Container, dims: Dimensions, rotation: number, style: ObjectStyle) {
  const pillowDepth = Math.min(0.6, dims.height * 0.35);
  const blanketStart = pillowDepth + 0.1;
  const blanketHeight = Math.max(0.6, dims.height - blanketStart - 0.2);
  if (style.accentSecondary) {
    drawTopRect(container, dims, 0.1, blanketStart, dims.width - 0.2, blanketHeight, style.accentSecondary, 0.92);
  }
  if (style.accentColor) {
    drawTopRect(container, dims, 0.2, 0.15, dims.width - 0.4, pillowDepth, style.accentColor, 0.96);
  }
}

function drawFridge(container: Container, dims: Dimensions, rotation: number, style: ObjectStyle) {
  if (style.accentColor) {
    drawFrontPanel(container, dims, style.height, 0.08, 0.92, 0.05, 0.55, adjustColor(style.accentColor, 0.1), 0.85);
    drawFrontPanel(container, dims, style.height, 0.08, 0.92, 0.6, 0.96, style.accentColor, 0.85);
    drawFrontLine(container, dims, style.height, 0.5, 0.05, 0.96, adjustColor(style.baseColor, -0.25), 2, 0.6);
  }
  drawFrontLine(container, dims, style.height, 0.78, 0.3, 0.7, adjustColor(style.baseColor, -0.45), 3, 0.9);
}

function drawToilet(container: Container, dims: Dimensions, rotation: number, style: ObjectStyle) {
  const seatWidth = Math.max(0.6, dims.width - 0.4);
  drawTopRect(container, dims, (dims.width - seatWidth) / 2, dims.height * 0.35, seatWidth, Math.min(0.9, dims.height * 0.45), style.accentColor ?? adjustColor(style.baseColor, -0.2), 0.92);
  drawTopRect(container, dims, 0.25, 0.1, dims.width - 0.5, dims.height * 0.25, adjustColor(style.baseColor, 0.15), 0.94);
}

function drawShower(container: Container, dims: Dimensions, rotation: number, style: ObjectStyle) {
  drawTopRect(container, dims, 0.1, 0.1, dims.width - 0.2, dims.height - 0.2, adjustColor(style.baseColor, 0.08), 0.7);
  const drain = new Graphics();
  const center = projectTopPoint(dims, dims.width / 2, dims.height / 2);
  drain.beginFill(style.accentColor ?? 0x38bdf8, 0.9);
  drain.drawCircle(center.x, center.y, 4);
  drain.endFill();
  container.addChild(drain);
}

function drawTv(container: Container, dims: Dimensions, rotation: number, style: ObjectStyle) {
  const screenColor = style.accentSecondary ?? 0x38bdf8;
  drawFrontPanel(container, dims, style.height, 0.05, 0.95, 0.05, 0.7, screenColor, 0.9);
  drawFrontPanel(container, dims, style.height, 0.3, 0.7, 0.72, 0.92, adjustColor(style.baseColor, -0.2), 0.9);
  drawFrontLine(container, dims, style.height, 0.5, 0.7, 0.9, adjustColor(screenColor, -0.4), 2, 0.7);
}

function drawSofa(container: Container, dims: Dimensions, rotation: number, style: ObjectStyle) {
  if (style.accentColor) {
    drawTopRect(container, dims, 0.2, 0.2, dims.width - 0.4, dims.height * 0.45, style.accentColor, 0.9);
  }
  if (style.accentSecondary) {
    drawTopRect(container, dims, 0.2, dims.height * 0.68, dims.width - 0.4, Math.max(0.4, dims.height * 0.22), style.accentSecondary, 0.95);
  }
  drawFrontPanel(container, dims, style.height, 0.1, 0.9, 0.65, 0.95, adjustColor(style.baseColor, -0.2), 0.85);
}

function drawTable(container: Container, dims: Dimensions, rotation: number, style: ObjectStyle) {
  drawTopRect(container, dims, 0.12, 0.12, dims.width - 0.24, dims.height - 0.24, adjustColor(style.baseColor, 0.1), 0.95);
  drawFrontPanel(container, dims, style.height, 0.15, 0.85, 0.7, 0.95, style.accentColor ?? adjustColor(style.baseColor, -0.2), 0.8);
}

function drawDoor(container: Container, dims: Dimensions, rotation: number, style: ObjectStyle) {
  drawFrontPanel(container, dims, style.height, 0.05, 0.95, 0.05, 0.95, adjustColor(style.baseColor, 0.08), 0.9);
  drawFrontPanel(container, dims, style.height, 0.12, 0.88, 0.1, 0.4, style.accentColor ?? adjustColor(style.baseColor, -0.1), 0.85);
  drawFrontLine(container, dims, style.height, 0.7, 0.45, 0.6, style.accentSecondary ?? 0xfacc15, 3, 0.9);
}

function drawCounter(container: Container, dims: Dimensions, rotation: number, style: ObjectStyle) {
  drawTopRect(container, dims, 0.05, 0.05, dims.width - 0.1, dims.height - 0.1, style.accentColor ?? adjustColor(style.baseColor, 0.12), 0.96);
  drawFrontPanel(container, dims, style.height, 0.05, 0.95, 0.55, 0.95, style.accentSecondary ?? adjustColor(style.baseColor, -0.25), 0.75);
}

function drawStove(container: Container, dims: Dimensions, rotation: number, style: ObjectStyle) {
  drawTopRect(container, dims, 0.05, 0.05, dims.width - 0.1, dims.height - 0.55, adjustColor(style.baseColor, 0.1), 0.94);
  const burnerSize = Math.min(0.4, Math.max(0.3, dims.width * 0.35));
  const offsets: Array<[number, number]> = [
    [0.2, 0.2],
    [dims.width - burnerSize - 0.2, 0.2],
    [0.2, dims.height - burnerSize - 0.75],
    [dims.width - burnerSize - 0.2, dims.height - burnerSize - 0.75]
  ];
  for (const [x, y] of offsets) {
    drawTopRect(container, dims, x, y, burnerSize, burnerSize, style.accentSecondary ?? 0xf1f5f9, 0.92);
  }
  drawFrontPanel(container, dims, style.height, 0.08, 0.92, 0.55, 0.95, style.accentColor ?? adjustColor(style.baseColor, -0.3), 0.8);
}

function adjustColor(color: number, factor: number) {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  const clamp = (value: number) => Math.max(0, Math.min(255, value));
  const adjust = (value: number) => clamp(value + value * factor);
  return (
    (adjust(r) << 16) |
    (adjust(g) << 8) |
    adjust(b)
  );
}
