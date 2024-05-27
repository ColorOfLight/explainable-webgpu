import * as SAM from "@site/src/SAM_NEW";
export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  setAdd(vector: Vector3): void {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
  }

  add(vector: Vector3): Vector3 {
    const newVector = this.clone();
    newVector.setAdd(vector);
    return newVector;
  }

  setSub(vector: Vector3): void {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
  }

  sub(vector: Vector3): Vector3 {
    const newVector = this.clone();
    newVector.setSub(vector);
    return newVector;
  }

  setMultiplyScalar(scalar: number): void {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
  }

  multiplyScalar(scalar: number): Vector3 {
    const newVector = this.clone();
    newVector.setMultiplyScalar(scalar);
    return newVector;
  }

  setDivideScalar(scalar: number): void {
    if (scalar === 0) {
      throw new Error("Cannot divide by zero");
    }

    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
  }

  divideScalar(scalar: number): Vector3 {
    const newVector = this.clone();
    newVector.setDivideScalar(scalar);
    return newVector;
  }

  dot(vector: Vector3): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  cross(vector: Vector3): Vector3 {
    const x = this.y * vector.z - this.z * vector.y;
    const y = this.z * vector.x - this.x * vector.z;
    const z = this.x * vector.y - this.y * vector.x;
    return new Vector3(x, y, z);
  }

  getLength(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  setNormalize(): void {
    const length = this.getLength();
    if (length === 0) {
      throw new Error("Cannot normalize the zero vector");
    }

    this.setDivideScalar(length);
  }

  normalize(): Vector3 {
    const newVector = this.clone();
    newVector.setNormalize();
    return newVector;
  }

  /*
   * Uses Rodrigues' rotation formula.
   */
  setRotateAroundAxis(axis: SAM.Vector3, angle: number): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const normalizedAxis = axis.normalize();

    const firstElement = this.multiplyScalar(cos);
    const secondElement = normalizedAxis.cross(this).multiplyScalar(sin);
    const thirdElement = normalizedAxis.multiplyScalar(
      normalizedAxis.dot(this) * (1 - cos)
    );

    const newVector = firstElement.add(secondElement).add(thirdElement);

    this.x = newVector.x;
    this.y = newVector.y;
    this.z = newVector.z;
  }

  rotateAroundAxis(axis: SAM.Vector3, angle: number): Vector3 {
    const newVector = this.clone();
    newVector.setRotateAroundAxis(axis, angle);
    return newVector;
  }

  toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }

  toNumberArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  toTypedArray(): Float32Array {
    return new Float32Array([this.x, this.y, this.z]);
  }
}
