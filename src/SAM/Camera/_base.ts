import * as SAM from "@site/src/SAM";

export interface CameraOptions {
  label?: string;
  eye?: SAM.Vector3;
  target?: SAM.Vector3;
}

export class Camera extends SAM.Node {
  eye: SAM.Vector3;
  target: SAM.Vector3;
  up: SAM.Vector3;

  constructor(options?: CameraOptions) {
    super(options?.label ?? "Camera");

    this.target = options?.target ?? new SAM.Vector3(0, 0, 0);
    this.eye = options?.eye ?? new SAM.Vector3(0, 0, 1);

    const eyeFromTarget = this.eye.sub(this.target);

    if (eyeFromTarget.getLength() < 1e-6) {
      throw new Error("Invalid camera position");
    }

    if (eyeFromTarget.cross(new SAM.Vector3(0, 1, 0)).getLength() < 1e-6) {
      this.up =
        eyeFromTarget.y > 0
          ? new SAM.Vector3(0, 0, 1)
          : new SAM.Vector3(0, 0, -1);

      return;
    }

    const newRight = eyeFromTarget.cross(new SAM.Vector3(0, 1, 0));
    this.up = newRight.cross(eyeFromTarget).normalize();
  }

  getViewTransformMatrix(): SAM.Matrix4 {
    const eyeFromTarget = this.eye.sub(this.target);

    const zAxis = eyeFromTarget.normalize();
    const xAxis = this.up.cross(zAxis).normalize();
    const yAxis = zAxis.cross(xAxis);

    // prettier-ignore
    return new SAM.Matrix4([
      xAxis.x, xAxis.y, xAxis.z, -xAxis.dot(this.eye),
      yAxis.x, yAxis.y, yAxis.z, -yAxis.dot(this.eye),
      zAxis.x, zAxis.y, zAxis.z, -zAxis.dot(this.eye),
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
      xAxis.x, xAxis.y, xAxis.z, 0,
      yAxis.x, yAxis.y, yAxis.z, 0,
      zAxis.x, zAxis.y, zAxis.z, 0,
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
