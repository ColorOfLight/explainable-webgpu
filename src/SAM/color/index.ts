export class Color {
  data: Float32Array;

  constructor([r, g, b]: [number, number, number]) {
    this.data = new Float32Array([r, g, b]);
  }

  toNumberArray(): number[] {
    return Array.from(this.data);
  }
}
