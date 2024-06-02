import * as SAM from "@site/src/SAM_NEW";

import { SceneElement } from "./_base";
import { createBindGroup, createBindGroupLayout } from "./_utils";
import { RESOURCE_CLASS_MAP } from "./_constants";

export class CameraElement extends SceneElement {
  bindResourceReactors: SAM.BindResourceReactor[];
  bindGroupLayoutReactor: SAM.SingleDataReactor<GPUBindGroupLayout>;
  bindGroupReactor: SAM.SingleDataReactor<GPUBindGroup>;

  constructor(device: GPUDevice, cameraChunk: SAM.CameraChunk) {
    super(device);

    this.bindResourceReactors = [];
    cameraChunk.precursorReactorList.forEach((precursorReactor) => {
      const bindResourceReactor = new RESOURCE_CLASS_MAP[
        precursorReactor.data.type
      ](device, () => precursorReactor.data, [
        { reactor: precursorReactor, key: "data" },
      ]);
      this.bindResourceReactors.push(bindResourceReactor);
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
          this.bindResourceReactors,
          this.bindGroupLayoutReactor
        ),
      [
        ...this.bindResourceReactors.map((resourceReactor) => ({
          reactor: resourceReactor,
          key: "resource",
        })),
        {
          reactor: this.bindGroupLayoutReactor,
          key: "data",
        },
      ]
    );
  }
}
