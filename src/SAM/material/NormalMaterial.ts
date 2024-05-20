import * as SAM from "@site/src/SAM";
import { Material, MaterialOptions } from "./_base";

import NormalMaterialVertexShader from "../shaders/NormalMaterial/vertex.wgsl";
import NormalMaterialFragmentShader from "../shaders/NormalMaterial/fragment.wgsl";

export class NormalMaterial extends Material {
  color: SAM.Color;

  constructor(options?: MaterialOptions) {
    super(options);

    this.vertexDescriptor = {
      code: NormalMaterialVertexShader,
      label: "Normal Material Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: NormalMaterialFragmentShader,
      label: "Normal Material Fragment Shader Module",
    };
  }
}
