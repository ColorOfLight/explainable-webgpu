import { Color } from "../types";

import BasicMaterialVertexShader from "../shaders/BasicMaterial/vertex.wgsl";
import BasicMaterialFragmentShader from "../shaders/BasicMaterial/fragment.wgsl";

export class Material {
  vertexDescriptor: GPUShaderModuleDescriptor;
  fragmentDescriptor: GPUShaderModuleDescriptor;
}

export class BasicMaterial extends Material {
  color: Color;

  constructor(color: Color) {
    super();
    this.color = color;
    this.vertexDescriptor = {
      code: BasicMaterialVertexShader,
      label: "Basic Material Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: BasicMaterialFragmentShader,
      label: "Basic Material Fragment Shader Module",
    };
  }
}
