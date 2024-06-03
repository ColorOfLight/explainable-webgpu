import * as SAM from "@site/src/SAM";
import { Material, MaterialOptions } from "./_base";

import EnvironmentCubeVertexFragmentShader from "../_shaders/EnvironmentCubeMaterial/vertex.wgsl";
import EnvironmentCubeMaterialFragmentShader from "../_shaders/EnvironmentCubeMaterial/fragment.wgsl";

export interface EnvironmentCubeMaterialOptions extends MaterialOptions {
  samplerDescriptor?: GPUSamplerDescriptor;
}

export class EnvironmentCubeMaterial extends Material {
  cubeMapTexture: SAM.CubeMapTexture;
  samplerDescriptor: GPUSamplerDescriptor;

  constructor(
    cubeMapTexture: SAM.CubeMapTexture,
    options?: EnvironmentCubeMaterialOptions
  ) {
    if (!cubeMapTexture.isLoaded) {
      throw new Error("Texture is not loaded yet");
    }

    super(options);

    this.vertexDescriptor = {
      code: EnvironmentCubeVertexFragmentShader,
      label: "Image Texture Material Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: EnvironmentCubeMaterialFragmentShader,
      label: "Image Texture Material Fragment Shader Module",
    };

    this.cubeMapTexture = cubeMapTexture;
    this.samplerDescriptor = options?.samplerDescriptor ?? {};
  }
}
