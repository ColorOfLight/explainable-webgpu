import * as SAM from "@site/src/SAM";
import { Light } from "./_base";

export class DirectionalLight extends Light {
  direction: SAM.Vector3;

  constructor(color: SAM.Color, intensity: number, direction: SAM.Vector3) {
    super(color, intensity);

    this.direction = direction;
  }
}
