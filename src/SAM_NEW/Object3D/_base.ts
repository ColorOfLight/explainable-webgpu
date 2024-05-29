import * as SAM from "@site/src/SAM_NEW";

export interface Object3DOptions {
  label?: string;
}

export class Object3D extends SAM.Node {
  transformMatrix: SAM.Matrix4;

  constructor(options?: Object3DOptions) {
    super(options?.label ?? "Object3D");

    this.transformMatrix = new SAM.Matrix4();
    this.transformMatrix.setIdentity();
  }

  setTranslate(vector: SAM.Vector3): void {
    this.transformMatrix = this.transformMatrix.translate(vector);
  }

  setScale(vector: SAM.Vector3): void {
    this.transformMatrix = this.transformMatrix.scale(vector);
  }

  setRotateX(angle: number): void {
    this.transformMatrix = this.transformMatrix.rotateX(angle);
  }

  setRotateY(angle: number): void {
    this.transformMatrix = this.transformMatrix.rotateY(angle);
  }

  setRotateZ(angle: number): void {
    this.transformMatrix = this.transformMatrix.rotateZ(angle);
  }
}
