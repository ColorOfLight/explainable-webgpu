export class Color {
  private r: number;
  private g: number;
  private b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  toNumberArray(): number[] {
    return [this.r, this.g, this.b];
  }

  toTypedArray(): Float32Array {
    return new Float32Array([this.r, this.g, this.b]);
  }
}
