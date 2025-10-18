import { Application, Container, Graphics } from 'pixi.js';
import { cartToIso } from '../core/math';
import { Tilemap } from './Tilemap';

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
    for (let y = 0; y < this.tilemap.height; y++) {
      for (let x = 0; x < this.tilemap.width; x++) {
        const pos = cartToIso(x, y);
        base.beginFill(y % 2 === x % 2 ? 0x253547 : 0x2c3e50, 0.8);
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
      }
    }
    base.alpha = 0.85;
    this.worldContainer.addChild(base);
  }

  onResize() {
    const view = this.app.view as HTMLCanvasElement;
    view.width = view.clientWidth;
    view.height = view.clientHeight;
  }

  createAgentSprite(color = 0xffe066): SpriteHandle {
    const container = new Container();
    const body = new Graphics();
    body.beginFill(color);
    body.drawRoundedRect(-12, -28, 24, 36, 8);
    body.endFill();
    const shadow = new Graphics();
    shadow.beginFill(0x000000, 0.2);
    shadow.drawEllipse(0, 0, 16, 6);
    shadow.endFill();
    container.addChild(shadow);
    container.addChild(body);
    this.worldContainer.addChild(container);
    return { id: this.spriteIdCounter++, container };
  }

  createObjectSprite(width: number, height: number, color = 0x4caf50): SpriteHandle {
    const container = new Container();
    const shape = new Graphics();
    shape.beginFill(color, 0.9);
    shape.drawRoundedRect(-width * 16, -height * 8, width * 32, height * 16, 6);
    shape.endFill();
    container.addChild(shape);
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
