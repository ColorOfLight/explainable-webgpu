import * as SAM from "@site/src/SAM";

export interface Vertex {
  position: [number, number, number]; // xyz
  normal: [number, number, number]; // xyz
  texCoord: [number, number]; // texCoord
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

  getVertexByteSize(): number {
    return (3 + 3 + 2 + 4) * 4;
  }

  getVertexBufferData(): Float32Array {
    const vertexFloat32Size = 3 + 3 + 2 + 4;
    const data = new Float32Array(vertexFloat32Size * this.vertexes.length);

    for (let i = 0; i < this.vertexes.length; i++) {
      const vertex = this.vertexes[i];
      data[i * vertexFloat32Size] = vertex.position[0];
      data[i * vertexFloat32Size + 1] = vertex.position[1];
      data[i * vertexFloat32Size + 2] = vertex.position[2];
      data[i * vertexFloat32Size + 3] = vertex.normal[0];
      data[i * vertexFloat32Size + 4] = vertex.normal[1];
      data[i * vertexFloat32Size + 5] = vertex.normal[2];
      data[i * vertexFloat32Size + 6] = vertex.texCoord[0];
      data[i * vertexFloat32Size + 7] = vertex.texCoord[1];
      data[i * vertexFloat32Size + 8] = vertex.color ? vertex.color.data[0] : 0;
      data[i * vertexFloat32Size + 9] = vertex.color ? vertex.color.data[1] : 0;
      data[i * vertexFloat32Size + 10] = vertex.color
        ? vertex.color.data[2]
        : 0;
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
