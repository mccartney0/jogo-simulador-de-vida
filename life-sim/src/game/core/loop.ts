import { GameWorld } from '../ecs';

export type System = (world: GameWorld, dt: number) => void;

export class GameLoop {
  private running = false;
  private lastTime = 0;
  private frameHandle = 0;
  private readonly systems: System[];
  private readonly world: GameWorld;
  private readonly fixedStep = 1 / 60;
  private timeScale = 1;

  constructor(world: GameWorld, systems: System[]) {
    this.world = world;
    this.systems = systems;
  }

  setTimeScale(scale: number) {
    this.timeScale = scale;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    const tick = (time: number) => {
      if (!this.running) return;
      const delta = (time - this.lastTime) / 1000;
      this.lastTime = time;
      this.update(delta * this.timeScale);
      this.frameHandle = requestAnimationFrame(tick);
    };
    this.frameHandle = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frameHandle);
  }

  private update(dt: number) {
    this.world.accumulator += dt;
    while (this.world.accumulator >= this.fixedStep) {
      this.world.delta = this.fixedStep;
      this.world.time += this.fixedStep;
      for (const system of this.systems) {
        system(this.world, this.fixedStep);
      }
      this.world.accumulator -= this.fixedStep;
    }
  }
}
