import { IsoRenderer } from './IsoRenderer';

export class DepthSort {
  constructor(private renderer: IsoRenderer) {}

  update() {
    this.renderer.depthSort();
  }
}
