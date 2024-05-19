import * as SAM from "@site/src/SAM";

import BasicMaterialVertexShader from "../shaders/BasicMaterial/vertex.wgsl";
import BasicMaterialFragmentShader from "../shaders/BasicMaterial/fragment.wgsl";

export interface MaterialOptions {
  isWireFrame?: boolean;
}

export class Material {
  vertexDescriptor: GPUShaderModuleDescriptor;
  fragmentDescriptor: GPUShaderModuleDescriptor;
  isWireFrame: boolean;

  constructor(options?: MaterialOptions) {
    this.isWireFrame = options?.isWireFrame ?? false;
  }

  getUniformItems(): SAM.UniformItem[] {
    return [];
  }
}

export interface BasicMaterialOptions extends MaterialOptions {
  color?: SAM.Color;
}

export class BasicMaterial extends Material {
  color: SAM.Color;

  constructor(options?: BasicMaterialOptions) {
    super();
    this.color = options?.color ?? new SAM.Color([0, 0, 0, -1]);
    this.isWireFrame = options?.isWireFrame ?? false;
    this.vertexDescriptor = {
      code: BasicMaterialVertexShader,
      label: "Basic Material Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: BasicMaterialFragmentShader,
      label: "Basic Material Fragment Shader Module",
    };
  }

  getUniformItems(): SAM.UniformItem[] {
    return [
      {
        label: "color",
        data: this.color.data,
      },
    ];
  }
}
