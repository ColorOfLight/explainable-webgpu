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

    if (reactorKeySets != null) {
      reactorKeySets.forEach(({ reactor, key }) => {
        this.registerToParentReactor(reactor, key, () => {
          const newBindData = setter();

          if (newBindData.type !== this.prevBindDataType) {
            throw new Error("Unsupported bind data type change");
          }

          if (newBindData.value.byteLength !== this.buffer.size) {
            const newBuffer = this.createBuffer(device, newBindData);
            this.buffer = newBuffer;
            return;
          }
          device.queue.writeBuffer(this.buffer, 0, newBindData.value);
        });
      });
    }
  }

  createBuffer(device: GPUDevice, bufferData: SAM.BufferData): GPUBuffer {
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
}
