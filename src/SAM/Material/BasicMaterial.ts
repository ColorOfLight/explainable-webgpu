import * as SAM from "@site/src/SAM";
import { Material, MaterialOptions } from "./_base";

import BaseVertexShader from "../_shaders/baseVertex.wgsl";
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
      code: BaseVertexShader,
      label: "Basic Material Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: BasicMaterialFragmentShader,
      label: "Basic Material Fragment Shader Module",
    };
  }
}
