import * as SAM from "@site/src/SAM";
import { Material, MaterialOptions } from "./_base";

import BaseVertexShader from "../_shaders/baseVertex.wgsl";
import PhongMaterialFragmentShader from "../_shaders/PhongMaterial/fragment.wgsl";

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
      code: BaseVertexShader,
      label: "Simple Standard Material Vertex Shader Module",
    };
    this.fragmentDescriptor = {
      code: PhongMaterialFragmentShader,
      label: "Simple Standard Material Fragment Shader Module",
    };

    this.color = options?.color;

    this.diffuse = options?.diffuse ?? 1;
    this.specular = options?.specular ?? 1;
    this.alpha = options?.alpha ?? 64;
  }
}
