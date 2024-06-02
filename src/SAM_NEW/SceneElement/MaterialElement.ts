import * as SAM from "@site/src/SAM_NEW";

import { SceneElement } from "./_base";
import { createBindGroup, createBindGroupLayout } from "./_utils";

export class MaterialElement extends SceneElement {
  bindBufferReactors: SAM.GPUBufferReactor[];
  bindGroupLayoutReactor: SAM.SingleDataReactor<GPUBindGroupLayout>;
  bindGroupReactor: SAM.SingleDataReactor<GPUBindGroup>;
  vertexShaderModuleReactor: SAM.SingleDataReactor<GPUShaderModule>;
  fragmentShaderModuleReactor: SAM.SingleDataReactor<GPUShaderModule>;

  constructor(device: GPUDevice, materialChunk: SAM.MaterialChunk) {
    super(device);

    this.bindBufferReactors = [];
    materialChunk.bufferDataReactorList.forEach((bufferDataReactor) => {
      const bufferReactor = new SAM.GPUBufferReactor(
        device,
        () => bufferDataReactor.data,
        [{ reactor: bufferDataReactor, key: "data" }]
      );
      this.bindBufferReactors.push(bufferReactor);
    });

    this.bindGroupLayoutReactor = new SAM.SingleDataReactor(
      () =>
        createBindGroupLayout(device, materialChunk.layoutEntryDataReactorList),
      materialChunk.layoutEntryDataReactorList.map(
        (layoutEntryDataReactor) => ({
          reactor: layoutEntryDataReactor,
          key: "data",
        })
      )
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

    this.vertexShaderModuleReactor = new SAM.SingleDataReactor(
      () =>
        this.device.createShaderModule(
          materialChunk.vertexDescriptorReactor.data
        ),
      [{ reactor: materialChunk.vertexDescriptorReactor, key: "data" }]
    );

    this.fragmentShaderModuleReactor = new SAM.SingleDataReactor(
      () =>
        this.device.createShaderModule(
          materialChunk.fragmentDescriptorReactor.data
        ),
      [{ reactor: materialChunk.fragmentDescriptorReactor, key: "data" }]
    );
  }
}
