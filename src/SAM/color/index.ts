export class Color {
  data: Float32Array;

  constructor([r, g, b, a]: [number, number, number, number]) {
    this.data = new Float32Array([r, g, b, a]);
  }
}
