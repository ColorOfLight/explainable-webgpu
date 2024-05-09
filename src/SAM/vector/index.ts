export class Vector3 {
  data: Float32Array;

  constructor(data: [number, number, number]) {
    this.data = new Float32Array(data);
  }

  add(vec: Vector3) {
    return new Vector3([this.x + vec.x, this.y + vec.y, this.z + vec.z]);
  }

  sub(vec: Vector3) {
    return new Vector3([this.x - vec.x, this.y - vec.y, this.z - vec.z]);
  }

  multiplyScalar(scalar: number) {
    return new Vector3([this.x * scalar, this.y * scalar, this.z * scalar]);
  }

  divideScalar(scalar: number) {
    return new Vector3([this.x / scalar, this.y / scalar, this.z / scalar]);
  }

  dot(v: Vector3) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vector3) {
    return new Vector3([
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
    ]);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    return this.divideScalar(this.length());
  }

  get x() {
    return this.data[0];
  }

  get y() {
    return this.data[1];
  }

  get z() {
    return this.data[2];
  }

  set x(value: number) {
    this.data[0] = value;
  }

  set y(value: number) {
    this.data[1] = value;
  }

  set z(value: number) {
    this.data[2] = value;
  }
}
