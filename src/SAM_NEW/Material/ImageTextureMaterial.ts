import * as SAM from "@site/src/SAM_NEW";
import { Material, MaterialOptions } from "./_base";

import BaseVertexShader from "../_shaders/baseVertex.wgsl";
import ImageTextureMaterialFragmentShader from "../_shaders/ImageTextureMaterial/fragment.wgsl";

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
      code: BaseVertexShader,
      label: "Base Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: ImageTextureMaterialFragmentShader,
      label: "Image Texture Material Fragment Shader Module",
    };

    this.imageTexture = imageTexture;
    this.samplerDescriptor = options?.samplerDescriptor ?? {};
  }
}
