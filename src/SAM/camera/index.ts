import { Vector3 } from "../vector";
import { Matrix4 } from "../matrix";

export class Camera {
  position: Vector3;
  target: Vector3;

  constructor(position?: Vector3, target?: Vector3) {
    this.target = target ?? new Vector3([0, 0, 0]);
    this.position = position ?? new Vector3([0, 0, -1]);
  }

  get viewTransformMatrix(): Matrix4 {
    return computeViewTransformMatrix(this.position, this.target);
  }

  get projTransformMatrix(): Matrix4 {
    const newMatrix = new Matrix4();
    newMatrix.setIdentity();
    return newMatrix;
  }
}

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
    far: number
  ) {
    super();

    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
  }

  get projTransformMatrix(): Matrix4 {
    // const projTransformMatrix = new Matrix4([
    //   2 / (this.right - this.left),
    //   0,
    //   0,
    //   -(this.right + this.left) / (this.right - this.left),
    //   0,
    //   2 / (this.top - this.bottom),
    //   0,
    //   -(this.top + this.bottom) / (this.top - this.bottom),
    //   0,
    //   0,
    //   -2 / (this.far - this.near),
    //   -(this.far + this.near) / (this.far - this.near),
    //   0,
    //   0,
    //   0,
    //   1,
    // ]);

    const projTransformMatrix = new Matrix4([
      2 / (this.right - this.left),
      0,
      0,
      0,
      0,
      2 / (this.top - this.bottom),
      0,
      0,
      0,
      0,
      1 / (this.near - this.far),
      0,
      (this.right + this.left) / (this.left - this.right),
      (this.top + this.bottom) / (this.bottom - this.top),
      this.near / (this.near - this.far),
      1,
    ]);

    return projTransformMatrix;
  }
}

export class PerspectiveCamera extends Camera {
  fov: number;
  aspect: number;
  near: number;
  far: number;

  constructor(fov: number, aspect: number, near: number, far: number) {
    super();

    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
  }

  get projTransformMatrix(): Matrix4 {
    const focalLength = 1 / Math.tan(this.fov / 2);

    const projTransformMatrix = new Matrix4([
      this.aspect * focalLength,
      0,
      0,
      0,
      0,
      focalLength,
      0,
      0,
      0,
      0,
      (this.far + this.near) / (this.far - this.near),
      (this.far * this.near) / (this.near - this.far),
      0,
      0,
      1,
      0,
    ]);

    return projTransformMatrix;
  }
}

function computeViewTransformMatrix(position: Vector3, target: Vector3) {
  const eyeFromTarget = position.sub(target);

  const zAxis = eyeFromTarget.normalize();
  const xAxis = new Vector3([0, 1, 0]).cross(zAxis).normalize();
  const yAxis = zAxis.cross(xAxis);

  return new Matrix4([
    xAxis.x,
    yAxis.x,
    zAxis.x,
    -eyeFromTarget.x,
    xAxis.y,
    yAxis.y,
    zAxis.y,
    -eyeFromTarget.y,
    xAxis.z,
    yAxis.z,
    zAxis.z,
    -eyeFromTarget.z,
    0,
    0,
    0,
    1,
  ]);
}
