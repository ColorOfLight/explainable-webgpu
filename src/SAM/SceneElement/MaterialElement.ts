import * as SAM from "@site/src/SAM";

import { SceneElement } from "./_base";
import { createBindGroup, createBindGroupLayout } from "./_utils";
import { RESOURCE_CLASS_MAP } from "./_constants";

export class MaterialElement extends SceneElement {
  bindResourceReactors: SAM.BindResourceReactor[];
  bindGroupLayoutReactor: SAM.SingleDataReactor<GPUBindGroupLayout>;
  bindGroupReactor: SAM.SingleDataReactor<GPUBindGroup>;
  vertexShaderModuleReactor: SAM.SingleDataReactor<GPUShaderModule>;
  fragmentShaderModuleReactor: SAM.SingleDataReactor<GPUShaderModule>;

  constructor(device: GPUDevice, materialChunk: SAM.MaterialChunk) {
    super(device);

    this.bindResourceReactors = [];
    materialChunk.precursorReactorList.forEach((precursorReactor) => {
      const bindResourceReactor = new RESOURCE_CLASS_MAP[
        precursorReactor.data.type
      ](device, () => precursorReactor.data, [
        { reactor: precursorReactor, key: "data" },
      ]);
      this.bindResourceReactors.push(bindResourceReactor);
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
