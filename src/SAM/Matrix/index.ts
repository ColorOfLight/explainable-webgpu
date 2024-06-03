import * as SAM from "@site/src/SAM";

export interface DecomposedMatrixes {
  translation: SAM.Matrix4;
  rotation: SAM.Matrix4;
  scale: SAM.Matrix4;
}

export type RotationAxis = "x" | "y" | "z";

/**
 * 4x4 matrix for 3D transformations.
 * row-major order.
 * When using data for rendering, you MUST use getRenderingData() method.
 */
export class Matrix4 {
  data: number[];

  constructor(data?: number[]) {
    if (data === undefined) {
      this.data = new Array(16).fill(0);
      return;
    }

    if (data.length !== 16) {
      throw new Error("Matrix4 constructor requires 16 elements.");
    }

    this.data = data;
  }

  clone(): Matrix4 {
    return new Matrix4([...this.data]);
  }

  setFill(value: number): void {
    this.data.fill(value);
  }

  fill(value: number): Matrix4 {
    const newMatrix = new Matrix4();
    newMatrix.setFill(value);
    return newMatrix;
  }

  setTranspose(): void {
    const newData = new Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newData[i * 4 + j] = this.data[j * 4 + i];
      }
    }

    this.data = newData;
  }

  transpose(): Matrix4 {
    const newMatrix = this.clone();
    newMatrix.setTranspose();
    return newMatrix;
  }

  setMultiply(matrix: Matrix4): void {
    const newData = new Array(16).fill(0);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          newData[i * 4 + k] += this.data[i * 4 + j] * matrix.data[j * 4 + k];
        }
      }
    }
    this.data = newData;
  }

  multiply(matrix: Matrix4): Matrix4 {
    const newMatrix = this.clone();
    newMatrix.setMultiply(matrix);
    return newMatrix;
  }

  setIdentity(): void {
    this.data.fill(0);
    this.data[0] = 1;
    this.data[5] = 1;
    this.data[10] = 1;
    this.data[15] = 1;
  }

  setTranslate(vector: SAM.Vector3): void {
    const translationMatrix = new Matrix4([
      1,
      0,
      0,
      vector.x,
      0,
      1,
      0,
      vector.y,
      0,
      0,
      1,
      vector.z,
      0,
      0,
      0,
      1,
    ]);
    this.data = translationMatrix.multiply(this).data;
  }

  translate(vector: SAM.Vector3): Matrix4 {
    const newMatrix = this.clone();
    newMatrix.setTranslate(vector);
    return newMatrix;
  }

  setScale(vector: SAM.Vector3): void {
    const scaleMatrix = new Matrix4([
      vector.x,
      0,
      0,
      0,
      0,
      vector.y,
      0,
      0,
      0,
      0,
      vector.z,
      0,
      0,
      0,
      0,
      1,
    ]);
    this.data = scaleMatrix.multiply(this).data;
  }

  scale(vector: SAM.Vector3): Matrix4 {
    const newMatrix = this.clone();
    newMatrix.setScale(vector);
    return newMatrix;
  }

  setRotate(angle: number, axis: RotationAxis) {
    const { translation, rotation, scale } = this.decompose();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // prettier-ignore
    const newRotation: Matrix4 = {
      x: new Matrix4([
        1, 0, 0, 0,
        0, cos, -sin, 0,
        0, sin, cos, 0,
        0, 0, 0, 1,
      ]),
      y: new Matrix4([
        cos, 0, sin, 0,
        0, 1, 0, 0,
        -sin, 0, cos, 0,
        0, 0, 0, 1,
      ]),
      z: new Matrix4([
        cos, -sin, 0, 0,
        sin, cos, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ]),
    }[axis];

    this.data = translation
      .multiply(scale)
      .multiply(newRotation)
      .multiply(rotation).data;
  }

  setRotateX(angle: number): void {
    this.setRotate(angle, "x");
  }

  rotateX(angle: number): Matrix4 {
    const newMatrix = this.clone();
    newMatrix.setRotateX(angle);
    return newMatrix;
  }

  setRotateY(angle: number): void {
    this.setRotate(angle, "y");
  }

  rotateY(angle: number): Matrix4 {
    const newMatrix = this.clone();
    newMatrix.setRotateY(angle);
    return newMatrix;
  }

  setRotateZ(angle: number): void {
    this.setRotate(angle, "z");
  }

  rotateZ(angle: number): Matrix4 {
    const newMatrix = this.clone();
    newMatrix.setRotateZ(angle);
    return newMatrix;
  }

  productVector3(vector: SAM.Vector3): SAM.Vector3 {
    const x =
      this.data[0] * vector.x +
      this.data[1] * vector.y +
      this.data[2] * vector.z +
      this.data[3];
    const y =
      this.data[4] * vector.x +
      this.data[5] * vector.y +
      this.data[6] * vector.z +
      this.data[7];
    const z =
      this.data[8] * vector.x +
      this.data[9] * vector.y +
      this.data[10] * vector.z +
      this.data[11];

    return new SAM.Vector3(x, y, z);
  }

  decompose(): DecomposedMatrixes {
    const scaleX = Math.hypot(this.data[0], this.data[4], this.data[8]);
    const scaleY = Math.hypot(this.data[1], this.data[5], this.data[9]);
    const scaleZ = Math.hypot(this.data[2], this.data[6], this.data[10]);

    // prettier-ignore
    const translation = new Matrix4([
      1, 0, 0, this.data[3],
      0, 1, 0, this.data[7],
      0, 0, 1, this.data[11],
      0, 0, 0, 1,
    ]);

    // prettier-ignore
    const scale = new Matrix4([
      scaleX, 0, 0, 0,
      0, scaleY, 0, 0,
      0, 0, scaleZ, 0,
      0, 0, 0, 1,
    ]);

    // prettier-ignore
    const rotation = new Matrix4([
      this.data[0] / scaleX, this.data[1] / scaleX, this.data[2] / scaleX, 0,
      this.data[4] / scaleY, this.data[5] / scaleY, this.data[6] / scaleY, 0,
      this.data[8] / scaleZ, this.data[9] / scaleZ, this.data[10] / scaleZ, 0,
      0, 0, 0, 1,
    ]);

    return { translation, rotation, scale };
  }

  toRenderingData(): number[] {
    return this.transpose().data;
  }
}
