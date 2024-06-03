import * as SAM from "@site/src/SAM";
import { Reactor } from "./_base";
import { BindResourceReactor } from "./BindResourceReactor";

export class CubeImageResourceReactor extends BindResourceReactor {
  texture: GPUTexture;

  constructor(
    device: GPUDevice,
    getPrecursor: () => SAM.CubeImageResourcePrecursor,
    reactorKeySets?: { reactor: Reactor; key: PropertyKey }[]
  ) {
    super(device, getPrecursor, reactorKeySets);

    CubeImageResourceReactor.finalizationRegistry.register(
      this,
      this.texture,
      this
    );
  }

  protected createResource(
    device: GPUDevice,
    precursor: SAM.CubeImageResourcePrecursor
  ): GPUBindingResource {
    const texture = device.createTexture({
      size: [precursor.value.width, precursor.value.height, 6],
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    precursor.value.images.forEach((imageBitmap, index) => {
      device.queue.copyExternalImageToTexture(
        { source: imageBitmap },
        { texture, origin: { x: 0, y: 0, z: index } },
        [imageBitmap.width, imageBitmap.height, 1]
      );
    });

    this.texture = texture;
    return texture.createView({
      dimension: "cube",
      format: "rgba8unorm",
      baseMipLevel: 0,
      mipLevelCount: 1,
      baseArrayLayer: 0,
      arrayLayerCount: 6,
    });
  }

  protected updateResource(
    device: GPUDevice,
    precursor: SAM.CubeImageResourcePrecursor
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
