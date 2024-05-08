export class Geometry {
  vertexes: Float32Array; /* [...position.xyz] */
  vertexSize: number;

  constructor(inputVertexes: Float32Array) {
    this.vertexes = inputVertexes;
    this.vertexSize = 3;
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

export class CubeGeometry extends Geometry {
  constructor(width: number, height: number, depth: number) {
    const x = width / 2;
    const y = height / 2;
    const z = depth / 2;

    const frontSide = [
      -x,
      -y,
      z,
      -x,
      y,
      z,
      x,
      -y,
      z,
      //
      x,
      y,
      z,
      -x,
      y,
      z,
      x,
      -y,
      z,
    ];

    const backSide = [
      -x,
      -y,
      -z,
      x,
      -y,
      -z,
      -x,
      y,
      -z,
      //
      x,
      -y,
      -z,
      x,
      y,
      -z,
      -x,
      y,
      -z,
    ];

    const topSide = [
      -x,
      y,
      z,
      -x,
      y,
      -z,
      x,
      y,
      z,
      //
      x,
      y,
      -z,
      x,
      y,
      z,
      -x,
      y,
      -z,
    ];

    const bottomSide = [
      -x,
      -y,
      z,
      -x,
      -y,
      -z,
      x,
      -y,
      z,
      //
      x,
      -y,
      -z,
      x,
      -y,
      z,
      -x,
      -y,
      -z,
    ];

    const leftSide = [
      -x,
      -y,
      z,
      -x,
      -y,
      -z,
      -x,
      y,
      z,
      //
      -x,
      y,
      -z,
      -x,
      y,
      z,
      -x,
      -y,
      -z,
    ];

    const rightSide = [
      x,
      -y,
      z,
      x,
      -y,
      -z,
      x,
      y,
      z,
      //
      x,
      y,
      -z,
      x,
      y,
      z,
      x,
      -y,
      -z,
    ];

    const vertexes = new Float32Array([
      ...frontSide,
      ...backSide,
      ...topSide,
      ...bottomSide,
      ...leftSide,
      ...rightSide,
    ]);

    super(vertexes);
  }
}
