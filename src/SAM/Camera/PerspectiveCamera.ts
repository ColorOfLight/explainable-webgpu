import * as SAM from "@site/src/SAM";

import { Camera, CameraOptions } from "./_base";

export interface PerspectiveCameraOptions extends CameraOptions {}

export class PerspectiveCamera extends Camera {
  fov: number;
  aspect: number;
  near: number;
  far: number;

  constructor(
    fov: number,
    aspect: number,
    near: number,
    far: number,
    options?: PerspectiveCameraOptions
  ) {
    super(options);

    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
  }

  getProjTransformMatrix(): SAM.Matrix4 {
    const f = 1.0 / Math.tan(this.fov / 2);
    const nf = 1 / (this.near - this.far);

    // prettier-ignore
    const projTransformMatrix = new SAM.Matrix4([
        f / this.aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, this.far * nf, (this.far * this.near) * nf,
        0, 0, -1, 0,
    ]);

    return projTransformMatrix;
  }
}
