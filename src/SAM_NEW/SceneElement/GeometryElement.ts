import * as SAM from "@site/src/SAM_NEW";

import { SceneElement } from "./_base";

export class GeometryElement extends SceneElement {
  vertexResourceReactor: SAM.NumbersResourceReactor;
  indexResourceReactor: SAM.NumbersResourceReactor;
  pipelineDataReactor: SAM.GeometryChunk["pipelineDataReactor"];
  indexCountReactor: SAM.GeometryChunk["indexCountDataReactor"];

  constructor(device: GPUDevice, geometryChunk: SAM.GeometryChunk) {
    super(device);

    this.vertexResourceReactor = new SAM.NumbersResourceReactor(
      device,
      () => geometryChunk.vertexDataReactor.data,
      [{ reactor: geometryChunk.vertexDataReactor, key: "resource" }]
    );

    this.indexResourceReactor = new SAM.NumbersResourceReactor(
      device,
      () => geometryChunk.indexDataReactor.data,
      [{ reactor: geometryChunk.indexDataReactor, key: "resource" }]
    );

    this.pipelineDataReactor = geometryChunk.pipelineDataReactor;
    this.indexCountReactor = geometryChunk.indexCountDataReactor;
  }
}
