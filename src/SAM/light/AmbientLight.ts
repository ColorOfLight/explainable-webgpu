import * as SAM from "@site/src/SAM";
import { Light } from "./_base";

export class AmbientLight extends Light {
  constructor(color: SAM.Color, intensity: number) {
    super(color, intensity);
  }
}
