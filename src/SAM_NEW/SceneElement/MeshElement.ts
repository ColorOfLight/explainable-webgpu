import * as SAM from "@site/src/SAM_NEW";

import { SceneElement } from "./_base";
import { createBindGroup, createBindGroupLayout } from "./_utils";
import { RESOURCE_CLASS_MAP } from "./_constants";

export class MeshElement extends SceneElement {
  bindResourceReactors: SAM.BindResourceReactor[];
  bindGroupLayoutReactor: SAM.SingleDataReactor<GPUBindGroupLayout>;
  bindGroupReactor: SAM.SingleDataReactor<GPUBindGroup>;
  geometryNodeIdReactor: SAM.SingleDataReactor<Symbol>;
  materialNodeIdReactor: SAM.SingleDataReactor<Symbol>;

  constructor(device: GPUDevice, meshChunk: SAM.MeshChunk) {
    super(device);

    this.bindResourceReactors = [];
    meshChunk.precursorReactorList.forEach((precursorReactor) => {
      const bufferReactor = new RESOURCE_CLASS_MAP[precursorReactor.data.type](
        device,
        () => precursorReactor.data,
        [{ reactor: precursorReactor, key: "data" }]
      );
      this.bindResourceReactors.push(bufferReactor);
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
          this.bindResourceReactors,
          this.bindGroupLayoutReactor
        ),
      [
        ...this.bindResourceReactors.map((resourceReactor) => ({
          reactor: resourceReactor,
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
