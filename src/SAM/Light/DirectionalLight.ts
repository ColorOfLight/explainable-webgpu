import * as SAM from "@site/src/SAM";
import { LightWithShadow, LightWithShadowOptions } from "./_base";

export interface DirectionalLightOptions extends LightWithShadowOptions {}

export class DirectionalLight extends LightWithShadow {
  direction: SAM.Vector3;

  constructor(
    color: SAM.Color,
    intensity: number,
    direction: SAM.Vector3,
    options?: DirectionalLightOptions
  ) {
    const shadowCamera = new SAM.OrthographicCamera(-5, 5, 5, -5, 0.5, 500);

    super(shadowCamera, color, intensity, options);

    this.direction = direction;
  }
}
