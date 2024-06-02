import * as SAM from "@site/src/SAM_NEW";
import { Reactor } from "./_base";
import { BindResourceReactor } from "./BindResourceReactor";

export class NumbersResourceReactor extends BindResourceReactor {
  resource: { buffer: GPUBuffer }; // Force Type for finalizationRegistry
  precursorType: SAM.NumbersResourcePrecursor["type"];

  constructor(
    device: GPUDevice,
    getPrecursor: () => SAM.NumbersResourcePrecursor,
    reactorKeySets?: { reactor: Reactor; key: PropertyKey }[]
  ) {
    super(device, getPrecursor, reactorKeySets);

    this.precursorType = getPrecursor().type;

    NumbersResourceReactor.finalizationRegistry.register(
      this,
      this.resource,
      this
    );
  }

  protected createResource(
    device: GPUDevice,
    precursor: SAM.BindingResourcePrecursor
  ): GPUBindingResource {
    if (precursor.type === "uniform-typed-array") {
      const buffer = device.createBuffer({
        size: precursor.value.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
      });
      device.queue.writeBuffer(buffer, 0, precursor.value);
      return { buffer };
    }

    if (precursor.type === "vertex") {
      const buffer = device.createBuffer({
        size: precursor.value.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
      });
      device.queue.writeBuffer(buffer, 0, precursor.value);
      return { buffer };
    }

    if (precursor.type === "index") {
      const buffer = device.createBuffer({
        size: precursor.value.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.INDEX,
      });
      device.queue.writeBuffer(buffer, 0, precursor.value);
      return { buffer };
    }

    throw new Error("Unsupported bind data type");
  }

  protected updateResource(
    device: GPUDevice,
    precursor: SAM.BindingResourcePrecursor
  ): void {
    if (precursor.type !== this.precursorType) {
      throw new Error("Unsupported resource precursor type change");
    }

    if (precursor.value.byteLength !== this.resource.buffer.size) {
      this.resource.buffer.destroy();

      const newResource = this.createResource(device, precursor) as {
        buffer: GPUBuffer;
      };
      this.resource = newResource;
      return;
    }

    device.queue.writeBuffer(this.resource.buffer, 0, precursor.value);
  }

  static finalizationRegistry = new FinalizationRegistry(
    (resource: { buffer: GPUBuffer }) => {
      resource?.buffer.destroy();
    }
  );
}
