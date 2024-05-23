import * as SAM from "@site/src/SAM";

export class Camera {
  eye: SAM.Vector3;
  target: SAM.Vector3;
  up: SAM.Vector3;

  constructor(eye?: SAM.Vector3, target?: SAM.Vector3) {
    this.target = target ?? new SAM.Vector3([0, 0, 0]);
    this.eye = eye ?? new SAM.Vector3([0, 0, 1]);
    this.up = new SAM.Vector3([0, 1, 0]);
  }

  getViewTransformMatrix(): SAM.Matrix4 {
    const eyeFromTarget = this.eye.sub(this.target);

    const zAxis = eyeFromTarget.normalize();
    const xAxis = this.up.cross(zAxis).normalize();
    const yAxis = zAxis.cross(xAxis);

    // prettier-ignore
    return new SAM.Matrix4([
      xAxis.getX(), xAxis.getY(), xAxis.getZ(), -xAxis.dot(this.eye),
      yAxis.getX(), yAxis.getY(), yAxis.getZ(), -yAxis.dot(this.eye),
      zAxis.getX(), zAxis.getY(), zAxis.getZ(), -zAxis.dot(this.eye),
      0, 0, 0, 1,
    ]);
  }

  getEnvViewTransformMatrix(): SAM.Matrix4 {
    const eyeFromTarget = this.eye.sub(this.target);

    const zAxis = eyeFromTarget.normalize();
    const xAxis = this.up.cross(zAxis).normalize();
    const yAxis = zAxis.cross(xAxis);

    // prettier-ignore
    return new SAM.Matrix4([
      xAxis.getX(), xAxis.getY(), xAxis.getZ(), 0,
      yAxis.getX(), yAxis.getY(), yAxis.getZ(), 0,
      zAxis.getX(), zAxis.getY(), zAxis.getZ(), 0,
      0, 0, 0, 1,
    ]);
  }

  getProjTransformMatrix(): SAM.Matrix4 {
    const newMatrix = new SAM.Matrix4();
    newMatrix.setIdentity();
    return newMatrix;
  }

  getEyeVector(): SAM.Vector3 {
    return this.eye;
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
