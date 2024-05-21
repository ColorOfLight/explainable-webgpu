import * as SAM from "@site/src/SAM";
import { Material, MaterialOptions } from "./_base";

import UVMaterialVertexShader from "../shaders/UVMaterial/vertex.wgsl";
import UVMaterialFragmentShader from "../shaders/UVMaterial/fragment.wgsl";

const UV_MATERIAL_PATTERNS = ["gradient", "checkerboard"] as const;

export type UVMaterialPattern = (typeof UV_MATERIAL_PATTERNS)[number];

export interface UVMaterialOptions extends MaterialOptions {
  pattern?: UVMaterialPattern;
}

export class UVMaterial extends Material {
  pattern: UVMaterialPattern;

  constructor(options?: UVMaterialOptions) {
    super(options);

    this.vertexDescriptor = {
      code: UVMaterialVertexShader,
      label: "Simple Standard Material Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: UVMaterialFragmentShader,
      label: "Simple Standard Material Fragment Shader Module",
    };

    this.pattern = options?.pattern ?? "gradient";
  }

  getUniformItems(): SAM.UniformItem[] {
    return [
      {
        label: "pattern",
        data: new Uint32Array([UV_MATERIAL_PATTERNS.indexOf(this.pattern)]),
      },
    ];
  }
}
