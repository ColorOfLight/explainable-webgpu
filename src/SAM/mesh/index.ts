import { Geometry } from "../geometry";
import { Material } from "../material";

export class Mesh {
  geometry: Geometry;
  material: Material;

  constructor(geometry: Geometry, material: Material) {
    this.geometry = geometry;
    this.material = material;
  }
}
