import { Vector3 } from "../vector";
import { Matrix4 } from "../matrix";

export class Camera {
  position: Vector3;
  target: Vector3;

  constructor(position?: Vector3, target?: Vector3) {
    this.target = target ?? new Vector3([0, 0, 0]);
    this.position = position ?? new Vector3([0, 0, 1]);
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
    // prettier-ignore
    const projTransformMatrix = new Matrix4([
      2 / (this.right - this.left), 0, 0, (this.right + this.left) / (this.left - this.right),
      0, 2 / (this.top - this.bottom), 0, (this.top + this.bottom) / (this.bottom - this.top),
      0, 0, 1 / (this.near - this.far),  this.near / (this.near - this.far),
      0, 0, 0, 1,
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
    const f = 1.0 / Math.tan(this.fov / 2);
    const nf = 1 / (this.near - this.far);

    // prettier-ignore
    const projTransformMatrix = new Matrix4([
        f / this.aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, this.far * nf, (this.far * this.near) * nf,
        0, 0, -1, 0,
    ]);

    return projTransformMatrix;
  }
}

function computeViewTransformMatrix(eye: Vector3, target: Vector3) {
  const eyeFromTarget = eye.sub(target);

  const zAxis = eyeFromTarget.normalize();
  const xAxis = new Vector3([0, 1, 0]).cross(zAxis).normalize();
  const yAxis = zAxis.cross(xAxis);

  // prettier-ignore
  return new Matrix4([
    xAxis.x, yAxis.x, zAxis.x, -xAxis.dot(eye),
    xAxis.y, yAxis.y, zAxis.y, -yAxis.dot(eye),
    xAxis.z, yAxis.z, zAxis.z, -zAxis.dot(eye),
    0, 0, 0, 1,
  ]);
}
