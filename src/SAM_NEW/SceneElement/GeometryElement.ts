import * as SAM from "@site/src/SAM_NEW";

import { SceneElement } from "./_base";

export class GeometryElement extends SceneElement {
  vertexBufferReactor: SAM.GPUBufferReactor;
  indexBufferReactor: SAM.GPUBufferReactor;
  pipelineDataReactor: SAM.GeometryChunk["pipelineDataReactor"];
  indexCountReactor: SAM.GeometryChunk["indexCountDataReactor"];

  constructor(device: GPUDevice, geometryChunk: SAM.GeometryChunk) {
    super(device);

    this.vertexBufferReactor = new SAM.GPUBufferReactor(
      device,
      () => geometryChunk.vertexDataReactor.data,
      [{ reactor: geometryChunk.vertexDataReactor, key: "data" }]
    );

    this.indexBufferReactor = new SAM.GPUBufferReactor(
      device,
      () => geometryChunk.indexDataReactor.data,
      [{ reactor: geometryChunk.indexDataReactor, key: "data" }]
    );

    this.pipelineDataReactor = geometryChunk.pipelineDataReactor;
    this.indexCountReactor = geometryChunk.indexCountDataReactor;
  }
}
