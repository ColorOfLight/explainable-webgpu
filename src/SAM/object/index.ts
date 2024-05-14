import * as SAM from "@site/src/SAM";

export class Object3D {
  transformMatrix: SAM.Matrix4;

  constructor() {
    this.transformMatrix = new SAM.Matrix4();
    this.transformMatrix.setIdentity();
  }

  setTranslate(vector: SAM.Vector3): void {
    this.transformMatrix.setTranslate(vector);
  }

  setScale(vector: SAM.Vector3): void {
    this.transformMatrix.setScale(vector);
  }

  setRotateX(angle: number): void {
    this.transformMatrix.setRotateX(angle);
  }

  setRotateY(angle: number): void {
    this.transformMatrix.setRotateY(angle);
  }

  setRotateZ(angle: number): void {
    this.transformMatrix.setRotateZ(angle);
  }
}

export class Mesh extends Object3D {
  geometry: SAM.Geometry;
  material: SAM.Material;

  constructor(geometry: SAM.Geometry, material: SAM.Material) {
    super();
    this.geometry = geometry;
    this.material = material;
  }
}
