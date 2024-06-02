import * as SAM from "@site/src/SAM_NEW";

import { SceneElement } from "./_base";
import { createBindGroup, createBindGroupLayout } from "./_utils";

export class CameraElement extends SceneElement {
  bindBufferReactors: SAM.GPUBufferReactor[];
  bindGroupLayoutReactor: SAM.SingleDataReactor<GPUBindGroupLayout>;
  bindGroupReactor: SAM.SingleDataReactor<GPUBindGroup>;

  constructor(device: GPUDevice, cameraChunk: SAM.CameraChunk) {
    super(device);

    this.bindBufferReactors = [];
    cameraChunk.bufferDataReactorList.forEach((bufferDataReactor) => {
      const bufferReactor = new SAM.GPUBufferReactor(
        device,
        () => bufferDataReactor.data,
        [{ reactor: bufferDataReactor, key: "data" }]
      );
      this.bindBufferReactors.push(bufferReactor);
    });

    this.bindGroupLayoutReactor = new SAM.SingleDataReactor(
      () =>
        createBindGroupLayout(device, cameraChunk.layoutEntryDataReactorList),
      cameraChunk.layoutEntryDataReactorList.map((layoutEntryDataReactor) => ({
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
  }
}
