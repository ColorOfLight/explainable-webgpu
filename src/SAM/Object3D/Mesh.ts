import * as SAM from "@site/src/SAM";

import { Object3D, Object3DOptions } from "./_base";

export interface MeshOptions extends Object3DOptions {}

export class Mesh extends Object3D {
  geometry: SAM.Geometry;
  material: SAM.Material;

  constructor(
    geometry: SAM.Geometry,
    material: SAM.Material,
    options?: MeshOptions
  ) {
    super(options);
    this.geometry = geometry;
    this.material = material;
  }
}
