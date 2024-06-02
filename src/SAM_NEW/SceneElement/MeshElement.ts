import * as SAM from "@site/src/SAM_NEW";

import { SceneElement } from "./_base";
import { createBindGroup, createBindGroupLayout } from "./_utils";

export class MeshElement extends SceneElement {
  bindBufferReactors: SAM.GPUBufferReactor[];
  bindGroupLayoutReactor: SAM.SingleDataReactor<GPUBindGroupLayout>;
  bindGroupReactor: SAM.SingleDataReactor<GPUBindGroup>;
  geometryNodeIdReactor: SAM.SingleDataReactor<Symbol>;
  materialNodeIdReactor: SAM.SingleDataReactor<Symbol>;

  constructor(device: GPUDevice, meshChunk: SAM.MeshChunk) {
    super(device);

    this.bindBufferReactors = [];
    meshChunk.bufferDataReactorList.forEach((bufferDataReactor) => {
      const bufferReactor = new SAM.GPUBufferReactor(
        device,
        () => bufferDataReactor.data,
        [{ reactor: bufferDataReactor, key: "data" }]
      );
      this.bindBufferReactors.push(bufferReactor);
    });

    this.bindGroupLayoutReactor = new SAM.SingleDataReactor(
      () => createBindGroupLayout(device, meshChunk.layoutEntryDataReactorList),
      meshChunk.layoutEntryDataReactorList.map((layoutEntryDataReactor) => ({
        reactor: layoutEntryDataReactor,
        key: "data",
      }))
    );

    this.bindGroupReactor = new SAM.SingleDataReactor(
      () =>
        createBindGroup(
          device,
          this.bindBufferReactors,
          this.bindGroupLayoutReactor
        ),
      [
        ...this.bindBufferReactors.map((bufferReactor) => ({
          reactor: bufferReactor,
          key: "buffer",
        })),
        {
          reactor: this.bindGroupLayoutReactor,
          key: "data",
        },
      ]
    );

    this.geometryNodeIdReactor = meshChunk.geometryNodeIdReactor;
    this.materialNodeIdReactor = meshChunk.materialNodeIdReactor;
  }
}
