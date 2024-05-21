import * as SAM from "@site/src/SAM";
import { Light } from "./_base";

export interface PointLightOptions {
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
    super(color, intensity);

    this.position = position;
    this.decay = options?.decay ?? 2;
  }
}
