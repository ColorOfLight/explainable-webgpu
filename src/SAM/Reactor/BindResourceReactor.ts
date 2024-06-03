import * as SAM from "@site/src/SAM";
import { Reactor } from "./_base";

export class BindResourceReactor extends Reactor {
  resource: GPUBindingResource;

  constructor(
    device: GPUDevice,
    getPrecursor: () => SAM.BindingResourcePrecursor,
    reactorKeySets?: { reactor: Reactor; key: PropertyKey }[]
  ) {
    super();

    const precursor = getPrecursor();
    const resource = this.createResource(device, precursor);

    this.resource = resource;

    if (reactorKeySets != null) {
      reactorKeySets.forEach(({ reactor, key }) => {
        this.registerToParentReactor(reactor, key, () => {
          const newPrecursor = getPrecursor();
          this.updateResource(device, newPrecursor);
        });
      });
    }
  }

  resetResource(
    device: GPUDevice,
    getPrecursor: () => SAM.BindingResourcePrecursor,
    reactorKeySets?: { reactor: Reactor; key: PropertyKey }[]
  ): void {
    this.deregisterParentHandlers();
    this.updateResource(device, getPrecursor());

    if (reactorKeySets != null) {
      reactorKeySets.forEach(({ reactor, key }) => {
        this.registerToParentReactor(reactor, key, () => {
          const newBufferData = getPrecursor();
          this.updateResource(device, newBufferData);
        });
      });
    }
  }

  protected createResource(
    device: GPUDevice,
    precursor: SAM.BindingResourcePrecursor
  ): GPUBindingResource {
    throw new Error("Not implemented");
  }

  protected updateResource(
    device: GPUDevice,
    precursor: SAM.BindingResourcePrecursor
  ): void {
    throw new Error("Not implemented");
  }
}
