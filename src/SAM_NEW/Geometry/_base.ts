import * as SAM from "@site/src/SAM_NEW";

import { BASE_VERTEX_BUFFER_LAYOUT } from "./_constants";

export interface GetIndexBufferDataOptions {
  isWireframe?: boolean;
}

export interface GeometryBufferDataRecord extends SAM.BufferDataRecord {
  vertexData: Float32Array;
  indexData: Uint16Array;
}

export interface GeometryPrimitiveData {
  vertexBufferLayout: GPUVertexBufferLayout;
  indexCount: number;
}

export class Geometry extends SAM.Node {
  protected vertexes: SAM.Vertex[];
  protected indexes: number[];
  protected vertexBufferLayout: GPUVertexBufferLayout;
  private isWireframe: boolean;

  constructor(label?: string) {
    super(label ?? "Geometry");

    this.vertexes = [];
    this.indexes = [];
    this.vertexBufferLayout = BASE_VERTEX_BUFFER_LAYOUT;
    this.isWireframe = false;
  }

  getVertexes(): SAM.Vertex[] {
    return this.vertexes;
  }

  getVertexBufferLayout(): GPUVertexBufferLayout {
    return this.vertexBufferLayout;
  }

  getIndexes(): number[] {
    return this.indexes;
  }
}
