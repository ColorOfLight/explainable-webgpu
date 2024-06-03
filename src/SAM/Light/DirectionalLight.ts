import * as SAM from "@site/src/SAM";
import { Light, LightOptions } from "./_base";

export interface DirectionalLightOptions extends LightOptions {}

export class DirectionalLight extends Light {
  direction: SAM.Vector3;

  constructor(
    color: SAM.Color,
    intensity: number,
    direction: SAM.Vector3,
    options?: DirectionalLightOptions
  ) {
    super(color, intensity, options);

    this.direction = direction;
  }
}
