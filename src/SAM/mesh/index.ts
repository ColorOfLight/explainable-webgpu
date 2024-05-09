import { Geometry } from "../geometry";
import { Material } from "../material";
import { Vector3 } from "../vector";
import { Matrix4 } from "../matrix";

export class Mesh {
  geometry: Geometry;
  material: Material;
  translation: Vector3;
  rotation: Vector3;
  scale: Vector3;

  constructor(geometry: Geometry, material: Material) {
    this.geometry = geometry;
    this.material = material;

    this.translation = new Vector3([0, 0, 0]);
    this.rotation = new Vector3([0, 0, 0]);
    this.scale = new Vector3([1, 1, 1]);
  }

  get modelTransformMatrix(): Matrix4 {
    const matrix = new Matrix4();
    matrix.setIdentity();

    matrix.setTranslate(this.translation);
    matrix.setScale(this.scale);
    matrix.setRotateX(this.rotation.x);
    matrix.setRotateY(this.rotation.y);
    matrix.setRotateZ(this.rotation.z);

    return matrix;
  }
}
