import * as SAM from "@site/src/SAM";
import { Material, MaterialOptions } from "./_base";

import BasicMaterialVertexShader from "../shaders/BasicMaterial/vertex.wgsl";
import BasicMaterialFragmentShader from "../shaders/BasicMaterial/fragment.wgsl";

export interface BasicMaterialOptions extends MaterialOptions {
  color?: SAM.Color;
}

export class BasicMaterial extends Material {
  color?: SAM.Color;

  constructor(options?: BasicMaterialOptions) {
    super(options);
    this.color = options?.color ?? new SAM.Color([-1, -1, -1]);

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
