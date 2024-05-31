import * as SAM from "@site/src/SAM_NEW";

import { BASE_VERTEX_BUFFER_LAYOUT } from "./_constants";

export interface GeometryOptions {
  isWireframe?: boolean;
  label?: string;
}

export class Geometry extends SAM.Node {
  vertexes: SAM.Vertex[];
  indexes: number[];
  vertexBufferLayout: GPUVertexBufferLayout;
  isWireframe: boolean;

  constructor(options?: GeometryOptions) {
    super(options?.label ?? "Geometry");

    this.vertexes = [];
    this.indexes = [];
    this.vertexBufferLayout = BASE_VERTEX_BUFFER_LAYOUT;
    this.isWireframe = options?.isWireframe ?? false;
  }

  // TODO: remove below functions

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
