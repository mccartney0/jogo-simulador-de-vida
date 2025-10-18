import { Point, Graphics } from 'pixi.js';
import { watch } from 'vue';
import type { useUiStore } from '../../ui/store/ui';
import { createWorld, GameWorld } from '../ecs';
import { createAgent, Agent, Transform, Velocity, Needs } from '../ecs/components';
import { MovementSystem } from '../ecs/systems/MovementSystem';
import { NeedSystem } from '../ecs/systems/NeedSystem';
import { InteractionSystem } from '../ecs/systems/InteractionSystem';
import { AnimationSystem } from '../ecs/systems/AnimationSystem';
import { AISystem } from '../ecs/systems/AISystem';
import { RoomSystem } from '../ecs/systems/RoomSystem';
import { RenderSystem } from '../ecs/systems/RenderSystem';
import { TimeSystem } from './TimeSystem';
import { GameLoop, System } from './loop';
import { EventBus } from './EventBus';
import { Tilemap } from '../world/Tilemap';
import { IsoRenderer } from '../world/IsoRenderer';
import { RoomDetection } from '../world/RoomDetection';
import { ObjectFactory } from '../world/ObjectFactory';
import { getObjectDefinition } from '../world/ObjectDefs';
import { validatePlacement } from '../world/Collision';
import { cartToIso, isoToCart, clamp } from './math';
import { createSaveSnapshot, loadGame, saveGame } from '../save/save';
import type { NeedsSnapshot } from '../../ui/store/ui';

interface PathRequest {
  resolve: (path: Array<{ x: number; y: number }> | null) => void;
}

export class Game {
  private readonly host: HTMLElement;
  private readonly ui: ReturnType<typeof useUiStore>;
  private readonly eventBus = new EventBus();
  private readonly tilemap = new Tilemap(64, 64);
  private readonly renderer: IsoRenderer;
  private readonly world: GameWorld;
  private readonly loop: GameLoop;
  private readonly timeSystem: TimeSystem;
  private readonly interactionSystem: InteractionSystem;
  private readonly aiSystem: AISystem;
  private readonly roomSystem: RoomSystem;
  private readonly renderSystem: RenderSystem;
  private readonly objectFactory: ObjectFactory;
  private readonly ghost: Graphics;
  private buildRotation = 0;

  private agentEntity = 0;
  private agentPath: Array<{ x: number; y: number }> = [];
  private agentPathIndex = 0;

  private readonly worker = new Worker(new URL('../ai/pathfinding/worker.ts', import.meta.url), {
    type: 'module'
  });
  private readonly pendingPaths = new Map<number, PathRequest>();
  private nextPathId = 1;

  private audioCtx: AudioContext | null = null;
  private autoSaveTimer: number | null = null;

  constructor(host: HTMLElement, ui: ReturnType<typeof useUiStore>) {
    this.host = host;
    this.ui = ui;
    this.renderer = new IsoRenderer(host, this.tilemap);
    this.world = createWorld();
    this.timeSystem = new TimeSystem(this.eventBus);
    this.interactionSystem = new InteractionSystem();
    this.renderSystem = new RenderSystem(this.renderer);
    this.aiSystem = new AISystem(this.interactionSystem, this.eventBus, () => this.ui.autonomous);
    this.roomSystem = new RoomSystem(new RoomDetection(this.tilemap));
    this.objectFactory = new ObjectFactory(this.renderer, this.tilemap);
    this.ghost = new Graphics();
    this.ghost.visible = false;
    this.ghost.zIndex = 9999;
    this.renderer.worldContainer.addChild(this.ghost);

    const systems: System[] = [
      (world, dt) => this.followPath(world, dt),
      (world, dt) => MovementSystem(world, dt),
      (world, dt) => NeedSystem(world, dt),
      (world, dt) => this.interactionSystem.update(world, dt),
      (world) => this.aiSystem.update(world),
      (world) => this.roomSystem.update(world),
      (world, dt) => AnimationSystem(world, dt),
      (world, dt) => this.timeSystem.update(world, dt),
      (world) => this.syncUi(world),
      (world) => this.renderSystem.update(world)
    ];
    this.loop = new GameLoop(this.world, systems);

    this.worker.onmessage = (event) => {
      const { id, path } = event.data;
      const request = this.pendingPaths.get(id);
      if (request) {
        request.resolve(path);
        this.pendingPaths.delete(id);
      }
    };

    watch(
      () => this.ui.timeScale,
      (scale) => {
        this.loop.setTimeScale(scale === 0 ? 0 : scale);
      }
    );

    watch(
      () => this.ui.buildMode,
      (value) => {
        if (!value) {
          this.ghost.visible = false;
        }
      }
    );

    this.eventBus.on('TIME_UPDATED', ({ hours, minutes }) => this.ui.setTimeOfDay(hours, minutes));
    this.eventBus.on('NEED_LOW', (payload) => {
      if (payload.type === 'fun') {
        this.ui.addNotification('needsFun', 'warning');
      }
    });
    this.eventBus.on('SAVE_DONE', () => this.ui.addNotification('saved', 'info'));
  }

  async start() {
    this.setupInput();
    this.createAgent();
    this.loop.start();
    await this.loadSave();
    this.autoSaveTimer = window.setInterval(() => this.save(), 120000);
  }

  destroy() {
    this.loop.stop();
    this.renderer.destroy();
    if (this.autoSaveTimer) {
      window.clearInterval(this.autoSaveTimer);
    }
    this.worker.terminate();
  }

  private setupInput() {
    const view = this.renderer.app.view as HTMLCanvasElement;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    view.addEventListener('pointerdown', (event) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      this.ensureAudio();
    });

    window.addEventListener('pointerup', () => {
      dragging = false;
    });

    window.addEventListener('pointermove', (event) => {
      if (dragging) {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        lastX = event.clientX;
        lastY = event.clientY;
        this.renderer.worldContainer.position.x += dx;
        this.renderer.worldContainer.position.y += dy;
      }
    });

    view.addEventListener('wheel', (event) => {
      event.preventDefault();
      const zoom = clamp(this.renderer.camera.zoom + (event.deltaY > 0 ? -0.05 : 0.05), 0.5, 2.5);
      this.renderer.setZoom(zoom);
    });

    view.addEventListener('click', (event) => {
      const rect = view.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const tile = this.screenToTile(x, y);
      if (!tile) return;
      if (this.ui.buildMode && this.ui.selectedObjectId) {
        const def = getObjectDefinition(this.ui.selectedObjectId);
        if (
          def &&
          validatePlacement(this.tilemap, def, tile.x, tile.y, this.buildRotation) &&
          this.ui.funds >= def.cost
        ) {
          this.objectFactory.place(def, tile.x, tile.y, this.buildRotation);
          this.ui.adjustFunds(-def.cost);
          this.ui.addNotification('confirm', 'info');
          this.playTone(660, 0.1);
        } else {
          this.ui.addNotification('invalid', 'warning');
          this.playTone(220, 0.1);
        }
      } else {
        this.moveAgentTo(tile.x, tile.y);
      }
    });

    view.addEventListener('contextmenu', (event) => {
      if (!this.ui.buildMode) return;
      event.preventDefault();
      const rect = view.getBoundingClientRect();
      const tile = this.screenToTile(event.clientX - rect.left, event.clientY - rect.top);
      if (!tile) return;
      const removed = this.objectFactory.removeAt(tile.x, tile.y);
      if (removed) {
        const refund = Math.floor(removed.def.cost * 0.5);
        this.ui.adjustFunds(refund);
        this.ui.addNotification('refunded', 'info');
        this.playTone(520, 0.1);
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key.toLowerCase() === 'b') {
        this.ui.toggleBuildMode();
      }
      if (event.key.toLowerCase() === 'r' && this.ui.buildMode) {
        this.buildRotation = (this.buildRotation + 1) % 4;
        this.playTone(440, 0.08);
      }
      if (event.key === ' ') {
        event.preventDefault();
        this.ui.setTimeScale(this.ui.timeScale === 0 ? 1 : 0);
      }
    });

    view.addEventListener('pointermove', (event) => {
      if (!this.ui.buildMode || !this.ui.selectedObjectId) {
        this.ghost.visible = false;
        return;
      }
      const rect = view.getBoundingClientRect();
      const tile = this.screenToTile(event.clientX - rect.left, event.clientY - rect.top);
      if (!tile) return;
      const def = getObjectDefinition(this.ui.selectedObjectId);
      if (!def) return;
      const iso = cartToIso(tile.x, tile.y);
      const valid = validatePlacement(this.tilemap, def, tile.x, tile.y, this.buildRotation);
      this.ghost.clear();
      const width = this.buildRotation % 2 === 0 ? def.footprint.width : def.footprint.height;
      const height = this.buildRotation % 2 === 0 ? def.footprint.height : def.footprint.width;
      this.ghost.beginFill(valid ? 0x34d399 : 0xef4444, 0.35);
      this.ghost.drawRect(
        iso.x - width * 32,
        iso.y - height * 16,
        width * 64,
        height * 32
      );
      this.ghost.endFill();
      this.ghost.visible = true;
    });
  }

  private screenToTile(x: number, y: number) {
    const local = this.renderer.worldContainer.toLocal(new Point(x, y));
    const cart = isoToCart(local.x, local.y);
    const tileX = Math.round(cart.x);
    const tileY = Math.round(cart.y);
    if (!this.tilemap.inBounds(tileX, tileY)) return null;
    return { x: tileX, y: tileY };
  }

  private createAgent() {
    const eid = createAgent(this.world, 10, 10);
    this.agentEntity = eid;
    const handle = this.renderer.createAgentSprite();
    this.renderSystem.registerHandle(eid, handle);
  }

  private followPath(world: GameWorld, dt: number) {
    if (!this.agentEntity) return;
    if (this.agentPathIndex >= this.agentPath.length) {
      Velocity.x[this.agentEntity] = 0;
      Velocity.y[this.agentEntity] = 0;
      return;
    }
    const target = this.agentPath[this.agentPathIndex];
    const dx = target.x - Transform.x[this.agentEntity];
    const dy = target.y - Transform.y[this.agentEntity];
    const dist = Math.hypot(dx, dy);
    if (dist < 0.1) {
      this.agentPathIndex++;
      return;
    }
    const speed = Agent.speed[this.agentEntity];
    Velocity.x[this.agentEntity] = (dx / dist) * speed;
    Velocity.y[this.agentEntity] = (dy / dist) * speed;
  }

  private moveAgentTo(x: number, y: number) {
    const start = { x: Math.round(Transform.x[this.agentEntity]), y: Math.round(Transform.y[this.agentEntity]) };
    const goal = { x, y };
    this.requestPath(start, goal).then((path) => {
      if (!path) return;
      this.agentPath = path;
      this.agentPathIndex = 0;
    });
  }

  private requestPath(start: { x: number; y: number }, goal: { x: number; y: number }) {
    return new Promise<Array<{ x: number; y: number }> | null>((resolve) => {
      const id = this.nextPathId++;
      this.pendingPaths.set(id, { resolve });
      const walkables = [];
      for (let y = 0; y < this.tilemap.height; y++) {
        const row: boolean[] = [];
        for (let x = 0; x < this.tilemap.width; x++) {
          row.push(this.tilemap.isWalkable(x, y));
        }
        walkables.push(row);
      }
      this.worker.postMessage({ id, type: 'path', start, goal, walkables });
    });
  }

  private syncUi(world: GameWorld) {
    if (!this.agentEntity) return;
    const snapshot: NeedsSnapshot = {
      hunger: Needs.hunger[this.agentEntity],
      energy: Needs.energy[this.agentEntity],
      bladder: Needs.bladder[this.agentEntity],
      hygiene: Needs.hygiene[this.agentEntity],
      fun: Needs.fun[this.agentEntity],
      social: Needs.social[this.agentEntity]
    };
    this.ui.updateNeeds(snapshot);
  }

  private ensureAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
  }

  private playTone(freq: number, duration: number) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.frequency.value = freq;
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    gain.gain.value = 0.1;
    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  private async save() {
    if (!this.agentEntity) return;
    const snapshot = createSaveSnapshot(
      {
        hunger: Needs.hunger[this.agentEntity],
        energy: Needs.energy[this.agentEntity],
        bladder: Needs.bladder[this.agentEntity],
        hygiene: Needs.hygiene[this.agentEntity],
        fun: Needs.fun[this.agentEntity],
        social: Needs.social[this.agentEntity]
      },
      this.ui.funds
    );
    await saveGame(snapshot);
    this.eventBus.emit('SAVE_DONE', undefined);
  }

  private async loadSave() {
    const save = await loadGame();
    if (!save || !this.agentEntity) return;
    Needs.hunger[this.agentEntity] = save.needs.hunger ?? Needs.hunger[this.agentEntity];
    Needs.energy[this.agentEntity] = save.needs.energy ?? Needs.energy[this.agentEntity];
    Needs.bladder[this.agentEntity] = save.needs.bladder ?? Needs.bladder[this.agentEntity];
    Needs.hygiene[this.agentEntity] = save.needs.hygiene ?? Needs.hygiene[this.agentEntity];
    Needs.fun[this.agentEntity] = save.needs.fun ?? Needs.fun[this.agentEntity];
    Needs.social[this.agentEntity] = save.needs.social ?? Needs.social[this.agentEntity];
    this.ui.updateNeeds({
      hunger: Needs.hunger[this.agentEntity],
      energy: Needs.energy[this.agentEntity],
      bladder: Needs.bladder[this.agentEntity],
      hygiene: Needs.hygiene[this.agentEntity],
      fun: Needs.fun[this.agentEntity],
      social: Needs.social[this.agentEntity]
    });
    this.ui.setFunds(save.funds);
  }
}
