import { Material, MaterialOptions } from "./_base";

import baseVertexShader from "../_shaders/baseVertex.wgsl";
import NormalMaterialFragmentShader from "../_shaders/NormalMaterial/fragment.wgsl";

export interface NormalMaterialOptions extends MaterialOptions {}

export class NormalMaterial extends Material {
  constructor(options?: NormalMaterialOptions) {
    super(options);

    this.vertexDescriptor = {
      code: baseVertexShader,
      label: "Normal Material Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: NormalMaterialFragmentShader,
      label: "Normal Material Fragment Shader Module",
    };
  }
}
