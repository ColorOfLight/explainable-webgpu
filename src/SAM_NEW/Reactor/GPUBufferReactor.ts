import * as SAM from "@site/src/SAM_NEW";
import { Reactor } from "./_base";

export class GPUBufferReactor extends Reactor {
  buffer: GPUBuffer;
  prevBindDataType: SAM.BufferData["type"];

  constructor(
    device: GPUDevice,
    setter: () => SAM.BufferData,
    reactorKeySets?: { reactor: Reactor; key: PropertyKey }[]
  ) {
    super();

    const bufferData = setter();
    const buffer = this.createBuffer(device, bufferData);

    this.buffer = buffer;
    this.prevBindDataType = bufferData.type;

    GPUBufferReactor.finalizationRegistry.register(this, buffer, this);

    if (reactorKeySets != null) {
      reactorKeySets.forEach(({ reactor, key }) => {
        this.registerToParentReactor(reactor, key, () => {
          const newBufferData = setter();
          this.updateBuffer(device, newBufferData);
        });
      });
    }
  }

  resetBuffer(
    device: GPUDevice,
    setter: () => SAM.BufferData,
    reactorKeySets?: { reactor: Reactor; key: PropertyKey }[]
  ): void {
    this.deregisterParentHandlers();
    this.updateBuffer(device, setter());

    if (reactorKeySets != null) {
      reactorKeySets.forEach(({ reactor, key }) => {
        this.registerToParentReactor(reactor, key, () => {
          const newBufferData = setter();
          this.updateBuffer(device, newBufferData);
        });
      });
    }
  }

  private createBuffer(
    device: GPUDevice,
    bufferData: SAM.BufferData
  ): GPUBuffer {
    if (bufferData.type === "uniform-typed-array") {
      const buffer = device.createBuffer({
        size: bufferData.value.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
      });
      device.queue.writeBuffer(buffer, 0, bufferData.value);
      return buffer;
    }

    if (bufferData.type === "vertex") {
      const buffer = device.createBuffer({
        size: bufferData.value.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
      });
      device.queue.writeBuffer(buffer, 0, bufferData.value);
      return buffer;
    }

    if (bufferData.type === "index") {
      const buffer = device.createBuffer({
        size: bufferData.value.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.INDEX,
      });
      device.queue.writeBuffer(buffer, 0, bufferData.value);
      return buffer;
    }

    throw new Error("Unsupported bind data type");
  }

  private updateBuffer(device: GPUDevice, bufferData: SAM.BufferData): void {
    if (bufferData.type !== this.prevBindDataType) {
      throw new Error("Unsupported bind data type change");
    }

    if (bufferData.value.byteLength !== this.buffer.size) {
      this.buffer.destroy();

      const newBuffer = this.createBuffer(device, bufferData);
      this.buffer = newBuffer;
      return;
    }
    device.queue.writeBuffer(this.buffer, 0, bufferData.value);
  }

  static finalizationRegistry = new FinalizationRegistry(
    (buffer: GPUBuffer) => {
      buffer.destroy();
    }
  );
}
