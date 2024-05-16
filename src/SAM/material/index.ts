import * as SAM from "@site/src/SAM";

import BasicMaterialVertexShader from "../shaders/BasicMaterial/vertex.wgsl";
import BasicMaterialFragmentShader from "../shaders/BasicMaterial/fragment.wgsl";

export class Material {
  vertexDescriptor: GPUShaderModuleDescriptor;
  fragmentDescriptor: GPUShaderModuleDescriptor;

  getUniformItems(): SAM.UniformItem[] {
    return [];
  }
}

export class BasicMaterial extends Material {
  color: SAM.Color;

  constructor(color?: SAM.Color) {
    super();
    this.color = color ?? new SAM.Color([0, 0, 0, -1]);
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
