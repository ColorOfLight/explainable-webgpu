import * as SAM from "@site/src/SAM_NEW";
import { Material, MaterialOptions } from "./_base";

import BasicMaterialVertexShader from "../_shaders/BasicMaterial/vertex.wgsl";
import BasicMaterialFragmentShader from "../_shaders/BasicMaterial/fragment.wgsl";

export interface BasicMaterialOptions extends MaterialOptions {
  color?: SAM.Color;
}

export class BasicMaterial extends Material {
  color?: SAM.Color;

  constructor(options?: BasicMaterialOptions) {
    super(options);
    this.color = options?.color ?? new SAM.Color(-1, -1, -1);

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
