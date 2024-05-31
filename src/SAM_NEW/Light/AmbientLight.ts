import * as SAM from "@site/src/SAM_NEW";
import { Light, LightOptions } from "./_base";

export interface AmbientLightOptions extends LightOptions {}

export class AmbientLight extends Light {
  constructor(
    color: SAM.Color,
    intensity: number,
    options?: AmbientLightOptions
  ) {
    super(color, intensity, options);
  }
}
