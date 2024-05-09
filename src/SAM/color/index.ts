export class Color {
  data: Uint8Array;

  constructor([r, g, b, a]: [number, number, number, number]) {
    this.data = new Uint8Array([r, g, b, a]);
  }
}
