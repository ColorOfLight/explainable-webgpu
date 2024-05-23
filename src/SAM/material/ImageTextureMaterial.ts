import * as SAM from "@site/src/SAM";
import { Material, MaterialOptions } from "./_base";

import ImageTextureMaterialVertexShader from "../shaders/ImageTextureMaterial/vertex.wgsl";
import ImageTextureMaterialFragmentShader from "../shaders/ImageTextureMaterial/fragment.wgsl";

export interface ImageTextureMaterialOptions extends MaterialOptions {
  samplerDescriptor?: GPUSamplerDescriptor;
}

export class ImageTextureMaterial extends Material {
  imageTexture: SAM.ImageTexture;
  samplerDescriptor: GPUSamplerDescriptor;

  constructor(
    imageTexture: SAM.ImageTexture,
    options?: ImageTextureMaterialOptions
  ) {
    if (!imageTexture.isLoaded) {
      throw new Error("Texture is not loaded yet");
    }

    super(options);

    this.vertexDescriptor = {
      code: ImageTextureMaterialVertexShader,
      label: "Simple Standard Material Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: ImageTextureMaterialFragmentShader,
      label: "Simple Standard Material Fragment Shader Module",
    };

    this.imageTexture = imageTexture;
    this.samplerDescriptor = options?.samplerDescriptor ?? {};
  }

  getUniformItems(): SAM.UniformItem[] {
    return [
      {
        label: "sampler",
        data: { type: "sampler", descriptor: this.samplerDescriptor },
      },
      {
        label: "image bitmap",
        data: {
          type: "image",
          value: this.imageTexture.data,
          width: this.imageTexture.width,
          height: this.imageTexture.height,
        },
      },
    ];
  }
}
