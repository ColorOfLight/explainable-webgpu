import * as SAM from "@site/src/SAM";

/**
 * 4x4 matrix for 3D transformations.
 * row-major order.
 * When using data for rendering, you MUST use getRenderingData() method.
 */
export class Matrix4 {
  data: Float32Array;

  constructor(data?: number[]) {
    if (data === undefined) {
      this.data = new Float32Array(16);
      return;
    }

    if (data.length !== 16) {
      throw new Error("Matrix4 constructor requires 16 elements.");
    }

    this.data = new Float32Array(data);
  }

  getRenderingData(): Float32Array {
    return this.transpose().data;
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
    const newData = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newData[i * 4 + j] = this.data[j * 4 + i];
      }
    }

    this.data = newData;
  }

  transpose(): Matrix4 {
    const newMatrix = new Matrix4();
    newMatrix.data = new Float32Array(this.data);
    newMatrix.setTranspose();
    return newMatrix;
  }

  setMultiply(matrix: Matrix4): void {
    const newData = new Float32Array(16).fill(0);
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
    const newMatrix = new Matrix4();
    newMatrix.data = new Float32Array(this.data);
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
      vector.data[0],
      0,
      1,
      0,
      vector.data[1],
      0,
      0,
      1,
      vector.data[2],
      0,
      0,
      0,
      1,
    ]);
    this.data = translationMatrix.multiply(this).data;
  }

  translate(vector: SAM.Vector3): Matrix4 {
    const newMatrix = new Matrix4();
    newMatrix.data = new Float32Array(this.data);
    newMatrix.setTranslate(vector);
    return newMatrix;
  }

  setScale(vector: SAM.Vector3): void {
    const scaleMatrix = new Matrix4([
      vector.data[0],
      0,
      0,
      0,
      0,
      vector.data[1],
      0,
      0,
      0,
      0,
      vector.data[2],
      0,
      0,
      0,
      0,
      1,
    ]);
    this.data = scaleMatrix.multiply(this).data;
  }

  scale(vector: SAM.Vector3): Matrix4 {
    const newMatrix = new Matrix4();
    newMatrix.data = new Float32Array(this.data);
    newMatrix.setScale(vector);
    return newMatrix;
  }

  setRotateX(angle: number): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rotationMatrix = new Matrix4([
      1,
      0,
      0,
      0,
      0,
      cos,
      -sin,
      0,
      0,
      sin,
      cos,
      0,
      0,
      0,
      0,
      1,
    ]);
    this.data = rotationMatrix.multiply(this).data;
  }

  rotateX(angle: number): Matrix4 {
    const newMatrix = new Matrix4();
    newMatrix.data = new Float32Array(this.data);
    newMatrix.setRotateX(angle);
    return newMatrix;
  }

  setRotateY(angle: number): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rotationMatrix = new Matrix4([
      cos,
      0,
      sin,
      0,
      0,
      1,
      0,
      0,
      -sin,
      0,
      cos,
      0,
      0,
      0,
      0,
      1,
    ]);
    this.data = rotationMatrix.multiply(this).data;
  }

  rotateY(angle: number): Matrix4 {
    const newMatrix = new Matrix4();
    newMatrix.data = new Float32Array(this.data);
    newMatrix.setRotateY(angle);
    return newMatrix;
  }

  setRotateZ(angle: number): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rotationMatrix = new Matrix4([
      cos,
      -sin,
      0,
      0,
      sin,
      cos,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
    ]);
    this.data = rotationMatrix.multiply(this).data;
  }

  rotateZ(angle: number): Matrix4 {
    const newMatrix = new Matrix4();
    newMatrix.data = new Float32Array(this.data);
    newMatrix.setRotateZ(angle);
    return newMatrix;
  }

  productVector3(vector: SAM.Vector3): SAM.Vector3 {
    const x =
      this.data[0] * vector.getX() +
      this.data[1] * vector.getY() +
      this.data[2] * vector.getZ() +
      this.data[3];
    const y =
      this.data[4] * vector.getX() +
      this.data[5] * vector.getY() +
      this.data[6] * vector.getZ() +
      this.data[7];
    const z =
      this.data[8] * vector.getX() +
      this.data[9] * vector.getY() +
      this.data[10] * vector.getZ() +
      this.data[11];

    return new SAM.Vector3([x, y, z]);
  }
}
