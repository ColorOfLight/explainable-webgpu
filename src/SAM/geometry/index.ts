export class Geometry {
  vertexes: Float32Array; /* [...position.xyz] */

  constructor(inputVertexes: Float32Array) {
    this.vertexes = inputVertexes;
  }
}

export class SimpleTriangleGeometry extends Geometry {
  constructor(size: number) {
    const vertexes = new Float32Array([
      size,
      size,
      0,
      -size,
      -size,
      0,
      size,
      -size,
      0,
    ]);

    super(vertexes);
  }
}
