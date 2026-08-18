import { Application, Container, Graphics } from 'pixi.js';
import { cartToIso } from '../core/math';
import { Tilemap } from './Tilemap';
import { ObjectDefinition } from '../core/types';
import { createObjectVisual } from './ObjectSprites';

export interface SpriteHandle {
  id: number;
  container: Container;
}

export class IsoRenderer {
  readonly app: Application;
  readonly worldContainer: Container;
  private readonly tilemap: Tilemap;
  private spriteIdCounter = 1;

  camera = { zoom: 1 };

  constructor(host: HTMLElement, tilemap: Tilemap) {
    this.tilemap = tilemap;
    this.app = new Application({
      width: host.clientWidth,
      height: host.clientHeight,
      backgroundAlpha: 0,
      antialias: true
    });
    host.appendChild(this.app.view as HTMLCanvasElement);
    this.worldContainer = new Container();
    this.worldContainer.sortableChildren = true;
    this.app.stage.addChild(this.worldContainer);
    this.drawFloor();
    this.worldContainer.position.set(this.app.renderer.width / 2, 160);
    window.addEventListener('resize', () => this.onResize());
  }

  private drawFloor() {
    const base = new Graphics();
    const lot = { minX: 5, maxX: 19, minY: 7, maxY: 22 };

    for (let y = 0; y < this.tilemap.height; y++) {
      for (let x = 0; x < this.tilemap.width; x++) {
        const pos = cartToIso(x, y);
        const insideLot = x >= lot.minX && x <= lot.maxX && y >= lot.minY && y <= lot.maxY;
        const isPath = this.isStarterPath(x, y);
        const tileColor = isPath
          ? 0x9a805e
          : insideLot
            ? (x + y) % 2 === 0
              ? 0x2e746f
              : 0x347f72
            : (x + y) % 2 === 0
              ? 0x1c3042
              : 0x22384b;
        const tileAlpha = insideLot ? 0.96 : 0.84;

        base.beginFill(tileColor, tileAlpha);
        base.drawPolygon([
          pos.x,
          pos.y + 16,
          pos.x + 32,
          pos.y,
          pos.x + 64,
          pos.y + 16,
          pos.x + 32,
          pos.y + 32
        ]);
        base.endFill();

        if (insideLot) {
          base.lineStyle(1, isPath ? 0xd6b37a : 0x63b3a6, 0.18);
          base.moveTo(pos.x, pos.y + 16);
          base.lineTo(pos.x + 32, pos.y);
          base.lineTo(pos.x + 64, pos.y + 16);
          base.lineTo(pos.x + 32, pos.y + 32);
          base.closePath();
        }
      }
    }

    this.worldContainer.addChild(base);
    this.drawStarterDecorations();
  }

  private isStarterPath(x: number, y: number) {
    return (
      (x === 10 && y >= 18 && y <= 22) ||
      (y === 17 && x >= 10 && x <= 13) ||
      (x === 13 && y >= 13 && y <= 17)
    );
  }

  private drawStarterDecorations() {
    this.addTree(7, 10, 1.1);
    this.addTree(18, 10, 0.85);
    this.addFlowerPatch(6, 19, 0xf97316);
    this.addFlowerPatch(17, 20, 0xfbbf24);
    this.addPlanter(8, 21, 0x5eead4);
    this.addPlanter(18, 16, 0xfb7185);
    this.addMailbox(11, 22);
  }

  private addTree(x: number, y: number, scale: number) {
    const container = new Container();
    const shadow = new Graphics();
    shadow.beginFill(0x06111f, 0.25);
    shadow.drawEllipse(0, 8, 23 * scale, 8 * scale);
    shadow.endFill();

    const trunk = new Graphics();
    trunk.beginFill(0x7c4a2d);
    trunk.drawRoundedRect(-5 * scale, -38 * scale, 10 * scale, 42 * scale, 4 * scale);
    trunk.endFill();

    const crown = new Graphics();
    crown.beginFill(0x14532d);
    crown.drawCircle(0, -55 * scale, 24 * scale);
    crown.beginFill(0x2f855a, 0.95);
    crown.drawCircle(-10 * scale, -64 * scale, 18 * scale);
    crown.drawCircle(11 * scale, -62 * scale, 17 * scale);
    crown.beginFill(0x86efac, 0.82);
    crown.drawCircle(-10 * scale, -70 * scale, 5 * scale);
    crown.endFill();

    container.addChild(shadow);
    container.addChild(trunk);
    container.addChild(crown);
    this.placeDecoration(container, x, y);
  }

  private addFlowerPatch(x: number, y: number, color: number) {
    const container = new Container();
    const shadow = new Graphics();
    shadow.beginFill(0x06111f, 0.18);
    shadow.drawEllipse(0, 4, 20, 6);
    shadow.endFill();

    for (const [offsetX, offsetY] of [[-12, -3], [0, -8], [12, -2]] as Array<[number, number]>) {
      const stem = new Graphics();
      stem.lineStyle(2, 0x65a30d, 0.95);
      stem.moveTo(offsetX, 3 + offsetY);
      stem.lineTo(offsetX, -7 + offsetY);
      stem.beginFill(color, 0.95);
      stem.drawCircle(offsetX, -9 + offsetY, 4);
      stem.endFill();
      container.addChild(stem);
    }

    container.addChildAt(shadow, 0);
    this.placeDecoration(container, x, y);
  }

  private addPlanter(x: number, y: number, color: number) {
    const container = new Container();
    const planter = new Graphics();
    planter.beginFill(0x8b5a3c);
    planter.drawPolygon([-16, -3, 16, -3, 11, 9, -11, 9]);
    planter.endFill();
    planter.beginFill(0x42291e);
    planter.drawEllipse(0, -4, 13, 4);
    planter.endFill();

    const leaves = new Graphics();
    leaves.beginFill(color, 0.92);
    leaves.drawCircle(-6, -12, 6);
    leaves.drawCircle(5, -13, 7);
    leaves.beginFill(0x86efac, 0.7);
    leaves.drawCircle(0, -20, 5);
    leaves.endFill();
    container.addChild(planter);
    container.addChild(leaves);
    this.placeDecoration(container, x, y);
  }

  private addMailbox(x: number, y: number) {
    const container = new Container();
    const post = new Graphics();
    post.beginFill(0x7c4a2d);
    post.drawRect(-2, -24, 4, 26);
    post.endFill();
    const box = new Graphics();
    box.beginFill(0xef4444);
    box.drawRoundedRect(-12, -34, 24, 13, 4);
    box.endFill();
    box.beginFill(0xfca5a5);
    box.drawCircle(7, -28, 2);
    box.endFill();
    container.addChild(post);
    container.addChild(box);
    this.placeDecoration(container, x, y);
  }

  private placeDecoration(container: Container, x: number, y: number) {
    const pos = cartToIso(x, y);
    container.position.set(pos.x + 32, pos.y + 16);
    this.worldContainer.addChild(container);
  }

  onResize() {
    const view = this.app.view as HTMLCanvasElement;
    view.width = view.clientWidth;
    view.height = view.clientHeight;
    this.app.renderer.resize(view.clientWidth, view.clientHeight);
    this.worldContainer.position.x = view.clientWidth / 2;
  }

  createAgentSprite(color = 0xffc47a): SpriteHandle {
    const container = new Container();
    const shadow = new Graphics();
    shadow.beginFill(0x06111f, 0.28);
    shadow.drawEllipse(0, 2, 16, 6);
    shadow.endFill();

    const legs = new Graphics();
    legs.beginFill(0x334155);
    legs.drawRoundedRect(-8, -6, 6, 12, 3);
    legs.drawRoundedRect(2, -6, 6, 12, 3);
    legs.endFill();

    const body = new Graphics();
    body.beginFill(0x0f766e);
    body.drawRoundedRect(-12, -31, 24, 27, 8);
    body.endFill();
    body.beginFill(0xfef3c7, 0.8);
    body.drawRoundedRect(-7, -27, 14, 5, 2);
    body.endFill();

    const head = new Graphics();
    head.beginFill(color);
    head.drawCircle(0, -40, 8);
    head.endFill();
    head.beginFill(0x4c1d1d);
    head.drawCircle(-2, -46, 7);
    head.endFill();
    head.beginFill(color);
    head.drawCircle(2, -40, 7);
    head.endFill();

    container.addChild(shadow);
    container.addChild(legs);
    container.addChild(body);
    container.addChild(head);
    this.worldContainer.addChild(container);
    return { id: this.spriteIdCounter++, container };
  }

  createObjectSprite(def: ObjectDefinition, rotation = 0): SpriteHandle {
    const container = createObjectVisual(def, rotation);
    this.worldContainer.addChild(container);
    return { id: this.spriteIdCounter++, container };
  }

  updateSpritePosition(sprite: SpriteHandle, x: number, y: number) {
    const pos = cartToIso(x, y);
    sprite.container.position.set(pos.x, pos.y);
  }

  setZoom(value: number) {
    this.camera.zoom = value;
    this.worldContainer.scale.set(value);
  }

  depthSort() {
    this.worldContainer.children.sort((a, b) => a.y - b.y);
  }

  destroy() {
    this.app.destroy(true, { children: true });
  }
}
