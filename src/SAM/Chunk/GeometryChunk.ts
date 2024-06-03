import * as SAM from "@site/src/SAM";
import { Chunk } from "./_base";

interface PipelineData {
  topology: GPUPrimitiveTopology;
  vertexBufferLayout: GPUVertexBufferLayout;
}

export class GeometryChunk extends Chunk {
  vertexDataReactor: SAM.SingleDataReactor<SAM.NumbersResourcePrecursor>;
  indexDataReactor: SAM.SingleDataReactor<SAM.NumbersResourcePrecursor>;
  pipelineDataReactor: SAM.SingleDataReactor<PipelineData>;
  indexCountDataReactor: SAM.SingleDataReactor<number>;

  constructor(geometry: SAM.Geometry) {
    super();

    this.vertexDataReactor = new SAM.SingleDataReactor(
      () => ({ type: "vertex", value: this.generateVertexData(geometry) }),
      [
        {
          reactor: geometry,
          key: "vertexes",
        },
      ]
    );
    this.indexDataReactor = new SAM.SingleDataReactor(
      () => ({ type: "index", value: this.getIndexData(geometry) }),
      [
        {
          reactor: geometry,
          key: "indexes",
        },
      ]
    );
    this.pipelineDataReactor = new SAM.SingleDataReactor(
      () => ({
        topology: this.getTopology(geometry),
        vertexBufferLayout: geometry.vertexBufferLayout,
      }),
      [
        {
          reactor: geometry,
          key: "isWireframe",
        },
        {
          reactor: geometry,
          key: "vertexBufferLayout",
        },
      ]
    );
    this.indexCountDataReactor = new SAM.SingleDataReactor(
      () => this.getIndexCount(geometry),
      [
        {
          reactor: geometry,
          key: "indexes",
        },
        {
          reactor: geometry,
          key: "isWireframe",
        },
      ]
    );
  }

  private generateVertexData(geometry: SAM.Geometry): Float32Array {
    const vertexFloat32Size = geometry.vertexBufferLayout.arrayStride / 4;
    const data = new Float32Array(vertexFloat32Size * geometry.vertexes.length);

    for (let i = 0; i < geometry.vertexes.length; i++) {
      const vertex = geometry.vertexes[i];
      const colorData = vertex.color?.toNumberArray();

      data[i * vertexFloat32Size] = vertex.position[0];
      data[i * vertexFloat32Size + 1] = vertex.position[1];
      data[i * vertexFloat32Size + 2] = vertex.position[2];
      data[i * vertexFloat32Size + 3] = vertex.normal[0];
      data[i * vertexFloat32Size + 4] = vertex.normal[1];
      data[i * vertexFloat32Size + 5] = vertex.normal[2];
      data[i * vertexFloat32Size + 6] = vertex.texCoord[0];
      data[i * vertexFloat32Size + 7] = vertex.texCoord[1];
      data[i * vertexFloat32Size + 8] = colorData ? colorData[0] : 0;
      data[i * vertexFloat32Size + 9] = colorData ? colorData[1] : 0;
      data[i * vertexFloat32Size + 10] = colorData ? colorData[2] : 0;
    }

    return data;
  }

  private getIndexData(geometry: SAM.Geometry): Uint16Array {
    if (geometry.isWireframe) {
      const indexBufferData = new Uint16Array(geometry.indexes.length * 2);
      for (let i = 0; i < geometry.indexes.length; i++) {
        if (i % 3 === 0) {
          indexBufferData[i * 2] = geometry.indexes[i];
          indexBufferData[i * 2 + 5] = geometry.indexes[i];
        } else {
          indexBufferData[(i - 1) * 2 + 1] = geometry.indexes[i];
          indexBufferData[i * 2] = geometry.indexes[i];
        }
      }

      return indexBufferData;
    }

    // Make sure the indexes are a multiple of 4 bytes for the correct buffer size
    const indexBufferData = new Uint16Array(
      Math.ceil(geometry.indexes.length / 2) * 2
    );

    indexBufferData.set(geometry.indexes);
    return indexBufferData;
  }

  private getTopology(geometry: SAM.Geometry) {
    return geometry.isWireframe ? "line-list" : "triangle-list";
  }

  getIndexCount(geometry: SAM.Geometry): number {
    return geometry.isWireframe
      ? geometry.indexes.length * 2
      : geometry.indexes.length;
  }
}
