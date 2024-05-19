import * as SAM from "@site/src/SAM";

export interface Vertex {
  position: [number, number, number]; // xyz
  color?: SAM.Color;
}

export interface GetIndexBufferDataOptions {
  isWireFrame?: boolean;
}

export interface GeometryBufferData {
  vertexData: Float32Array;
  indexData: Uint16Array;
  indexCount: number;
}

export class Geometry {
  vertexes: Vertex[];
  indexes: number[];

  constructor() {
    this.vertexes = [];
    this.indexes = [];
  }

  getVertexBufferData(): Float32Array {
    const data = new Float32Array((3 + 4) * this.vertexes.length);
    const vertexByteSize = 3 + 4;

    for (let i = 0; i < this.vertexes.length; i++) {
      const vertex = this.vertexes[i];
      data[i * vertexByteSize] = vertex.position[0];
      data[i * vertexByteSize + 1] = vertex.position[1];
      data[i * vertexByteSize + 2] = vertex.position[2];
      data[i * vertexByteSize + 3] = vertex.color ? vertex.color.data[0] : 1;
      data[i * vertexByteSize + 4] = vertex.color ? vertex.color.data[1] : 1;
      data[i * vertexByteSize + 5] = vertex.color ? vertex.color.data[2] : 1;
    }

    return data;
  }

  getIndexBufferData(options?: GetIndexBufferDataOptions): Uint16Array {
    if (options?.isWireFrame) {
      const indexBufferData = new Uint16Array(this.indexes.length * 2);
      for (let i = 0; i < this.indexes.length; i++) {
        if (i % 3 === 0) {
          indexBufferData[i * 2] = this.indexes[i];
          indexBufferData[i * 2 + 5] = this.indexes[i];
        } else {
          indexBufferData[(i - 1) * 2 + 1] = this.indexes[i];
          indexBufferData[i * 2] = this.indexes[i];
        }
      }

      return indexBufferData;
    }

    // Make sure the indexes are a multiple of 4 bytes for the correct buffer size
    const indexBufferData = new Uint16Array(
      Math.ceil(this.indexes.length / 2) * 2
    );

    indexBufferData.set(this.indexes);
    return indexBufferData;
  }

  getBufferData(options?: GetIndexBufferDataOptions): GeometryBufferData {
    return {
      vertexData: this.getVertexBufferData(),
      indexData: this.getIndexBufferData(options),
      indexCount: options?.isWireFrame
        ? this.indexes.length * 2
        : this.indexes.length,
    };
  }
}

export class SimpleTriangleGeometry extends Geometry {
  constructor(size: number) {
    super();

    this.vertexes = [
      { position: [size, size, 0], color: new SAM.Color([1, 0, 0, 1]) },
      { position: [-size, -size, 0], color: new SAM.Color([0, 1, 0, 1]) },
      { position: [size, -size, 0], color: new SAM.Color([0, 0, 1, 1]) },
    ];

    this.indexes = SAM.generateNumberArray(this.vertexes.length);
  }
}

export interface CubeGeometryOptions {
  colors?: {
    front: SAM.Color;
    back: SAM.Color;
    top: SAM.Color;
    bottom: SAM.Color;
    left: SAM.Color;
    right: SAM.Color;
  };
}

export class CubeGeometry extends Geometry {
  constructor(
    width: number,
    height: number,
    depth: number,
    options?: CubeGeometryOptions
  ) {
    super();

    const x = width / 2;
    const y = height / 2;
    const z = depth / 2;

    const defaultColor = new SAM.Color([1, 1, 1, 1]);

    const frontColor = options?.colors?.front || defaultColor;
    const backColor = options?.colors?.back || defaultColor;
    const topColor = options?.colors?.top || defaultColor;
    const bottomColor = options?.colors?.bottom || defaultColor;
    const leftColor = options?.colors?.left || defaultColor;
    const rightColor = options?.colors?.right || defaultColor;

    const frontVertexes: Vertex[] = [
      { position: [-x, -y, z], color: frontColor },
      { position: [x, -y, z], color: frontColor },
      { position: [-x, y, z], color: frontColor },
      { position: [x, y, z], color: frontColor },
      { position: [-x, y, z], color: frontColor },
      { position: [x, -y, z], color: frontColor },
    ];

    const backVertexes: Vertex[] = [
      { position: [-x, -y, -z], color: backColor },
      { position: [-x, y, -z], color: backColor },
      { position: [x, -y, -z], color: backColor },
      { position: [x, y, -z], color: backColor },
      { position: [x, -y, -z], color: backColor },
      { position: [-x, y, -z], color: backColor },
    ];

    const topVertexes: Vertex[] = [
      { position: [-x, y, -z], color: topColor },
      { position: [-x, y, z], color: topColor },
      { position: [x, y, -z], color: topColor },
      { position: [x, y, z], color: topColor },
      { position: [x, y, -z], color: topColor },
      { position: [-x, y, z], color: topColor },
    ];

    const bottomVertexes: Vertex[] = [
      { position: [-x, -y, -z], color: bottomColor },
      { position: [x, -y, -z], color: bottomColor },
      { position: [-x, -y, z], color: bottomColor },
      { position: [x, -y, z], color: bottomColor },
      { position: [-x, -y, z], color: bottomColor },
      { position: [x, -y, -z], color: bottomColor },
    ];

    const leftVertexes: Vertex[] = [
      { position: [-x, -y, -z], color: leftColor },
      { position: [-x, -y, z], color: leftColor },
      { position: [-x, y, -z], color: leftColor },
      { position: [-x, y, z], color: leftColor },
      { position: [-x, y, -z], color: leftColor },
      { position: [-x, -y, z], color: leftColor },
    ];

    const rightVertexes: Vertex[] = [
      { position: [x, -y, -z], color: rightColor },
      { position: [x, y, -z], color: rightColor },
      { position: [x, -y, z], color: rightColor },
      { position: [x, y, z], color: rightColor },
      { position: [x, -y, z], color: rightColor },
      { position: [x, y, -z], color: rightColor },
    ];

    this.vertexes = [
      ...frontVertexes,
      ...backVertexes,
      ...topVertexes,
      ...bottomVertexes,
      ...leftVertexes,
      ...rightVertexes,
    ];

    this.indexes = SAM.generateNumberArray(this.vertexes.length);
  }
}
