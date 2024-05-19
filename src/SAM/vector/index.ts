import * as SAM from "@site/src/SAM";
export class Vector3 {
  data: Float32Array;

  constructor(data: [number, number, number]) {
    this.data = new Float32Array(data);
  }

  getX(): number {
    return this.data[0];
  }

  getY(): number {
    return this.data[1];
  }

  getZ(): number {
    return this.data[2];
  }

  setX(x: number): void {
    this.data[0] = x;
  }

  setY(y: number): void {
    this.data[1] = y;
  }

  setZ(z: number): void {
    this.data[2] = z;
  }

  setAdd(vector: Vector3): void {
    this.data[0] += vector.getX();
    this.data[1] += vector.getY();
    this.data[2] += vector.getZ();
  }

  add(vector: Vector3): Vector3 {
    const newData = Array.from(this.data) as [number, number, number];
    const newVector = new Vector3(newData);
    newVector.setAdd(vector);
    return newVector;
  }

  setSub(vector: Vector3): void {
    this.data[0] -= vector.getX();
    this.data[1] -= vector.getY();
    this.data[2] -= vector.getZ();
  }

  sub(vector: Vector3): Vector3 {
    const newData = Array.from(this.data) as [number, number, number];
    const newVector = new Vector3(newData);
    newVector.setSub(vector);
    return newVector;
  }

  setMultiplyScalar(scalar: number): void {
    this.data[0] *= scalar;
    this.data[1] *= scalar;
    this.data[2] *= scalar;
  }

  multiplyScalar(scalar: number): Vector3 {
    const newData = Array.from(this.data) as [number, number, number];
    const newVector = new Vector3(newData);
    newVector.setMultiplyScalar(scalar);
    return newVector;
  }

  setDivideScalar(scalar: number): void {
    if (scalar === 0) {
      throw new Error("Cannot divide by zero");
    }

    this.data[0] /= scalar;
    this.data[1] /= scalar;
    this.data[2] /= scalar;
  }

  divideScalar(scalar: number): Vector3 {
    const newData = Array.from(this.data) as [number, number, number];
    const newVector = new Vector3(newData);
    newVector.setDivideScalar(scalar);
    return newVector;
  }

  dot(vector: Vector3): number {
    return (
      this.data[0] * vector.getX() +
      this.data[1] * vector.getY() +
      this.data[2] * vector.getZ()
    );
  }

  cross(vector: Vector3): Vector3 {
    return new Vector3([
      this.data[1] * vector.getZ() - this.data[2] * vector.getY(),
      this.data[2] * vector.getX() - this.data[0] * vector.getZ(),
      this.data[0] * vector.getY() - this.data[1] * vector.getX(),
    ]);
  }

  getLength(): number {
    return Math.sqrt(
      this.data[0] * this.data[0] +
        this.data[1] * this.data[1] +
        this.data[2] * this.data[2]
    );
  }

  setNormalize(): void {
    const length = this.getLength();
    if (length === 0) {
      throw new Error("Cannot normalize the zero vector");
    }

    this.setDivideScalar(length);
  }

  normalize(): Vector3 {
    const newData = Array.from(this.data) as [number, number, number];
    const newVector = new Vector3(newData);
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

    this.data = newVector.data;
  }

  rotateAroundAxis(axis: SAM.Vector3, angle: number): Vector3 {
    const newData = Array.from(this.data) as [number, number, number];
    const newVector = new Vector3(newData);
    newVector.setRotateAroundAxis(axis, angle);
    return newVector;
  }

  toString(): string {
    return `(${this.data[0]}, ${this.data[1]}, ${this.data[2]})`;
  }

  toNumberArray(): [number, number, number] {
    return [this.data[0], this.data[1], this.data[2]];
  }
}
