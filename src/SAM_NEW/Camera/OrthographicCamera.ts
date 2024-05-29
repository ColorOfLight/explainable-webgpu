import * as SAM from "@site/src/SAM_NEW";

import { Camera, CameraOptions } from "./_base";

export interface OrthographicCameraOptions extends CameraOptions {}

export class OrthographicCamera extends Camera {
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;

  constructor(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number,
    options?: OrthographicCameraOptions
  ) {
    super(options);

    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
  }

  getProjTransformMatrix(): SAM.Matrix4 {
    // prettier-ignore
    const projTransformMatrix = new SAM.Matrix4([
      2 / (this.right - this.left), 0, 0, (this.right + this.left) / (this.left - this.right),
      0, 2 / (this.top - this.bottom), 0, (this.top + this.bottom) / (this.bottom - this.top),
      0, 0, 1 / (this.near - this.far),  this.near / (this.near - this.far),
      0, 0, 0, 1,
    ]);

    return projTransformMatrix;
  }
}
