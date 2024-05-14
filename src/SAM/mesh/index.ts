import * as SAM from "@site/src/SAM";

export class Mesh {
  geometry: SAM.Geometry;
  material: SAM.Material;
  translation: SAM.Vector3;
  rotation: SAM.Vector3;
  scale: SAM.Vector3;

  constructor(geometry: SAM.Geometry, material: SAM.Material) {
    this.geometry = geometry;
    this.material = material;

    this.translation = new SAM.Vector3([0, 0, 0]);
    this.rotation = new SAM.Vector3([0, 0, 0]);
    this.scale = new SAM.Vector3([1, 1, 1]);
  }

  getModelTransformMatrix(): SAM.Matrix4 {
    const matrix = new SAM.Matrix4();
    matrix.setIdentity();

    matrix.setTranslate(this.translation);
    matrix.setScale(this.scale);
    matrix.setRotateX(this.rotation.getX());
    matrix.setRotateY(this.rotation.getY());
    matrix.setRotateZ(this.rotation.getZ());

    return matrix;
  }
}
