import * as SAM from "@site/src/SAM_NEW";

import { Object3D } from "./_base";

export class Mesh extends Object3D {
  geometry: SAM.Geometry;
  material: SAM.Material;

  constructor(geometry: SAM.Geometry, material: SAM.Material, label?: string) {
    super(label ?? "Mesh");
    this.geometry = geometry;
    this.material = material;
  }
}
