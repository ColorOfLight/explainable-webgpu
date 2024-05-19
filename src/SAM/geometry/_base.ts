import * as SAM from "@site/src/SAM";

export interface Vertex {
  position: [number, number, number]; // xyz
  color?: SAM.Color;
}

export interface GetIndexBufferDataOptions {
  isWireframe?: boolean;
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
    if (options?.isWireframe) {
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
      indexCount: options?.isWireframe
        ? this.indexes.length * 2
        : this.indexes.length,
    };
  }
}
