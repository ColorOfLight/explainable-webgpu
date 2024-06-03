import * as SAM from "@site/src/SAM";
import { Material, MaterialOptions } from "./_base";

import BaseVertexShader from "../_shaders/baseVertex.wgsl";
import SimpleStandardMaterialFragmentShader from "../_shaders/SimpleStandardMaterial/fragment.wgsl";

export interface SimpleStandardMaterialOptions extends MaterialOptions {
  color?: SAM.Color;
}
/*
 * Only accept Ambient Light
 */
export class SimpleStandardMaterial extends Material {
  color?: SAM.Color;

  constructor(options?: SimpleStandardMaterialOptions) {
    super(options);

    this.vertexDescriptor = {
      code: BaseVertexShader,
      label: "Base Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: SimpleStandardMaterialFragmentShader,
      label: "Simple Standard Material Fragment Shader Module",
    };

    this.color = options?.color;
  }
}
