import * as SAM from "@site/src/SAM";
import { Reactor } from "./_base";
import { BindResourceReactor } from "./BindResourceReactor";

export class ImageResourceReactor extends BindResourceReactor {
  texture: GPUTexture;

  constructor(
    device: GPUDevice,
    getPrecursor: () => SAM.ImageResourcePrecursor,
    reactorKeySets?: { reactor: Reactor; key: PropertyKey }[]
  ) {
    super(device, getPrecursor, reactorKeySets);

    ImageResourceReactor.finalizationRegistry.register(
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
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    device.queue.copyExternalImageToTexture(
      { source: precursor.value.image },
      { texture: texture },
      [precursor.value.width, precursor.value.height]
    );

    this.texture = texture;
    return texture.createView();
  }

  protected updateResource(
    device: GPUDevice,
    precursor: SAM.ImageResourcePrecursor
  ): void {
    this.texture.destroy();
    this.resource = this.createResource(device, precursor);
  }

  static finalizationRegistry = new FinalizationRegistry(
    (texture: GPUTexture) => {
      texture.destroy();
    }
  );
}
