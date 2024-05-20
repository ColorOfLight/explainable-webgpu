import * as SAM from "@site/src/SAM";

export class Light {
  color: SAM.Color;
  intensity: number;

  constructor(color: SAM.Color, intensity: number) {
    this.color = color;
    this.intensity = intensity;
  }
}
