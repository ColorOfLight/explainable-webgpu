import * as SAM from "@site/src/SAM_NEW";
import { Light, LightOptions } from "./_base";

export interface PointLightOptions extends LightOptions {
  decay?: number;
}

export class PointLight extends Light {
  position: SAM.Vector3;
  decay: number;

  constructor(
    color: SAM.Color,
    intensity: number,
    position: SAM.Vector3,
    options?: PointLightOptions
  ) {
    super(color, intensity, options);

    this.position = position;
    this.decay = options?.decay ?? 2;
  }
}
