import * as SAM from "@site/src/SAM_NEW";

export class Object3D extends SAM.Node {
  transformMatrix: SAM.Matrix4;

  constructor(label?: string) {
    super(label ?? "Object3D");

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
