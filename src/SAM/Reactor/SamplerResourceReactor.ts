import * as SAM from "@site/src/SAM";
import { Reactor } from "./_base";
import { BindResourceReactor } from "./BindResourceReactor";

export class SamplerResourceReactor extends BindResourceReactor {
  constructor(
    device: GPUDevice,
    getPrecursor: () => SAM.SamplerResourcePrecursor,
    reactorKeySets?: { reactor: Reactor; key: PropertyKey }[]
  ) {
    super(device, getPrecursor, reactorKeySets);
  }

  protected createResource(
    device: GPUDevice,
    precursor: SAM.SamplerResourcePrecursor
  ): GPUBindingResource {
    const sampler = device.createSampler(precursor.value);
    return sampler;
  }

  protected updateResource(
    device: GPUDevice,
    precursor: SAM.SamplerResourcePrecursor
  ): void {
    this.resource = this.createResource(device, precursor);
  }
}
