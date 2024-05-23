import * as SAM from "@site/src/SAM";
import { Material, MaterialOptions } from "./_base";

import SimpleStandardMaterialVertexShader from "../shaders/SimpleStandardMaterial/vertex.wgsl";
import SimpleStandardMaterialFragmentShader from "../shaders/SimpleStandardMaterial/fragment.wgsl";

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
      code: SimpleStandardMaterialVertexShader,
      label: "Simple Standard Material Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: SimpleStandardMaterialFragmentShader,
      label: "Simple Standard Material Fragment Shader Module",
    };

    this.color = options?.color;
  }

  getMaterialBindDatas(): SAM.MaterialBindData[] {
    return [
      {
        label: "color",
        data: { type: "typedArray", value: this.color.data },
      },
    ];
  }
}
