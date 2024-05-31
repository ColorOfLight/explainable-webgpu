import * as SAM from "@site/src/SAM_NEW";

export interface LightOptions {
  label?: string;
}

export class Light extends SAM.Node {
  color: SAM.Color;
  intensity: number;

  constructor(color: SAM.Color, intensity: number, options?: LightOptions) {
    super(options?.label ?? "Light");

    this.color = color;
    this.intensity = intensity;
  }
}
