export interface Vertex {
  position: [number, number, number]; // xyz
  color?: [number, number, number, number]; // rgba
}

export class Geometry {
  vertexes: Vertex[];
  vertexCount: number;

  constructor() {}

  get vertexBufferData(): Float32Array {
    const data = new Float32Array((3 + 4) * this.vertexes.length);
    const vertexByteSize = 3 + 4;

    for (let i = 0; i < this.vertexes.length; i++) {
      const vertex = this.vertexes[i];
      data[i * vertexByteSize] = vertex.position[0];
      data[i * vertexByteSize + 1] = vertex.position[1];
      data[i * vertexByteSize + 2] = vertex.position[2];
      data[i * vertexByteSize + 3] = vertex.color ? vertex.color[0] : 1;
      data[i * vertexByteSize + 4] = vertex.color ? vertex.color[1] : 1;
      data[i * vertexByteSize + 5] = vertex.color ? vertex.color[2] : 1;
    }

    return data;
  }
}

export class SimpleTriangleGeometry extends Geometry {
  constructor(size: number) {
    super();

    this.vertexes = [
      { position: [size, size, 0], color: [1, 0, 0, 1] },
      { position: [-size, -size, 0], color: [0, 1, 0, 1] },
      { position: [size, -size, 0], color: [0, 0, 1, 1] },
    ];
  }
}

/*
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
*/
