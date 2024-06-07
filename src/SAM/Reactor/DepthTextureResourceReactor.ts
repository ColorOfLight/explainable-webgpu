import * as SAM from "@site/src/SAM";
import { Reactor } from "./_base";
import { BindResourceReactor } from "./BindResourceReactor";

export class DepthTextureResourceReactor extends BindResourceReactor {
  // Forcing type for other files
  resource: GPUTextureView;

  texture: GPUTexture;

  constructor(
    device: GPUDevice,
    getPrecursor: () => SAM.DepthTextureResourcePrecursor,
    reactorKeySets?: { reactor: Reactor; key: PropertyKey }[]
  ) {
    super(device, getPrecursor, reactorKeySets);

    DepthTextureResourceReactor.finalizationRegistry.register(
      this,
      this.texture,
      this
    );
  }

  protected createResource(
    device: GPUDevice,
    precursor: SAM.ImageResourcePrecursor
  ): GPUBindingResource {
    const texture = device.createTexture({
      size: [precursor.value.width, precursor.value.height, 1],
      format: "depth24plus",
      usage:
        GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
    });

    this.texture = texture;
    return texture.createView();
  }

  protected updateResource(
    device: GPUDevice,
    precursor: SAM.ImageResourcePrecursor
  ): void {
    this.texture.destroy();
    this.resource = this.createResource(device, precursor) as GPUTextureView;
  }

  static finalizationRegistry = new FinalizationRegistry(
    (texture: GPUTexture) => {
      texture.destroy();
    }
  );
}
