import * as SAM from "@site/src/SAM_NEW";

import { NodeElement } from "./_base";

export class GeometryElement extends NodeElement {
  vertexBuffer: GPUBuffer;
  indexBuffer: GPUBuffer;
  indexCount: number;
  vertexBufferLayout: GPUVertexBufferLayout;
  topology: GPUPrimitiveTopology;

  constructor(device: GPUDevice, geometry: SAM.Geometry) {
    super(device, geometry);

    const vertexes = geometry.getVertexes();
    const vertexBufferLayout = geometry.getVertexBufferLayout();
    const indexes = geometry.getIndexes();

    const vertexBufferData = this.generateVertexBufferData(
      vertexes,
      vertexBufferLayout
    );
    const indexBufferData = this.getIndexBufferData(indexes);

    this.vertexBuffer = device.createBuffer({
      size: vertexBufferData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this.indexBuffer = device.createBuffer({
      size: indexBufferData.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });

    this.device.queue.writeBuffer(this.vertexBuffer, 0, vertexBufferData);
    this.device.queue.writeBuffer(this.indexBuffer, 0, indexBufferData);

    this.indexCount = indexes.length;
    this.vertexBufferLayout = vertexBufferLayout;
    this.topology = "triangle-list";
  }

  generateVertexBufferData(
    vertexes: SAM.Vertex[],
    vertexBufferLayout: GPUVertexBufferLayout
  ): Float32Array {
    const vertexFloat32Size = vertexBufferLayout.arrayStride / 4;
    const data = new Float32Array(vertexFloat32Size * vertexes.length);

    for (let i = 0; i < vertexes.length; i++) {
      const vertex = vertexes[i];
      const colorData = vertex.color.toNumberArray();

      data[i * vertexFloat32Size] = vertex.position[0];
      data[i * vertexFloat32Size + 1] = vertex.position[1];
      data[i * vertexFloat32Size + 2] = vertex.position[2];
      data[i * vertexFloat32Size + 3] = vertex.normal[0];
      data[i * vertexFloat32Size + 4] = vertex.normal[1];
      data[i * vertexFloat32Size + 5] = vertex.normal[2];
      data[i * vertexFloat32Size + 6] = vertex.texCoord[0];
      data[i * vertexFloat32Size + 7] = vertex.texCoord[1];
      data[i * vertexFloat32Size + 8] = vertex.color ? colorData[0] : 0;
      data[i * vertexFloat32Size + 9] = vertex.color ? colorData[1] : 0;
      data[i * vertexFloat32Size + 10] = vertex.color ? colorData[2] : 0;
    }

    return data;
  }

  getIndexBufferData(indexes: number[]): Uint16Array {
    // if (this.isWireframe) {
    //   const indexBufferData = new Uint16Array(this.indexes.length * 2);
    //   for (let i = 0; i < this.indexes.length; i++) {
    //     if (i % 3 === 0) {
    //       indexBufferData[i * 2] = this.indexes[i];
    //       indexBufferData[i * 2 + 5] = this.indexes[i];
    //     } else {
    //       indexBufferData[(i - 1) * 2 + 1] = this.indexes[i];
    //       indexBufferData[i * 2] = this.indexes[i];
    //     }
    //   }

    //   return indexBufferData;
    // }

    // Make sure the indexes are a multiple of 4 bytes for the correct buffer size
    const indexBufferData = new Uint16Array(Math.ceil(indexes.length / 2) * 2);

    indexBufferData.set(indexes);
    return indexBufferData;
  }
}
