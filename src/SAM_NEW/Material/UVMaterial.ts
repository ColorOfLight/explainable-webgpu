import * as SAM from "@site/src/SAM_NEW";
import { Material, MaterialOptions } from "./_base";

import BaseVertexShader from "../_shaders/baseVertex.wgsl";
import UVMaterialFragmentShader from "../_shaders/UVMaterial/fragment.wgsl";

export type UVMaterialPattern = (typeof SAM.UV_MATERIAL_PATTERNS)[number];

export interface UVMaterialOptions extends MaterialOptions {
  pattern?: UVMaterialPattern;
}

export class UVMaterial extends Material {
  pattern: UVMaterialPattern;

  constructor(options?: UVMaterialOptions) {
    super(options);

    this.vertexDescriptor = {
      code: BaseVertexShader,
      label: "Simple Standard Material Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: UVMaterialFragmentShader,
      label: "Simple Standard Material Fragment Shader Module",
    };

    this.pattern = options?.pattern ?? "gradient";
  }
}
