import { Observable } from "./_base";

export class ObservableGPUBuffer extends Observable {
  buffer: GPUBuffer;

  constructor(buffer: GPUBuffer) {
    super();
    this.buffer = buffer;
  }
}
