import * as SAM from "@site/src/SAM";
import { Material, MaterialOptions } from "./_base";

import PhongMaterialVertexShader from "../shaders/PhongMaterial/vertex.wgsl";
import PhongMaterialFragmentShader from "../shaders/PhongMaterial/fragment.wgsl";

/*
 * Phong Material.
 * Color = Intensity * (Diffuse * (L * N) + Specular * (R * V)^alpha)
 */
export interface PhongMaterialOptions extends MaterialOptions {
  color?: SAM.Color;
  diffuse?: number;
  specular?: number;
  alpha?: number;
}
/*
 * Only accept Ambient Light
 */
export class PhongMaterial extends Material {
  color?: SAM.Color;
  diffuse: number;
  specular: number;
  alpha: number;

  constructor(options?: PhongMaterialOptions) {
    super(options);

    this.vertexDescriptor = {
      code: PhongMaterialVertexShader,
      label: "Simple Standard Material Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: PhongMaterialFragmentShader,
      label: "Simple Standard Material Fragment Shader Module",
    };

    this.color = options?.color;

    this.diffuse = options?.diffuse ?? 1;
    this.specular = options?.specular ?? 1;
    this.alpha = options?.alpha ?? 16;
  }

  getUniformItems(): SAM.UniformItem[] {
    return [
      {
        label: "color",
        data: this.color.data,
      },
      {
        label: "diffuse",
        data: new Float32Array([this.diffuse]),
      },
      {
        label: "specular",
        data: new Float32Array([this.specular]),
      },
      {
        label: "alpha",
        data: new Float32Array([this.alpha]),
      },
    ];
  }
}
