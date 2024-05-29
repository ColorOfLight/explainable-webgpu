import * as SAM from "@site/src/SAM_NEW";

import { NodeElement } from "./_base";

export class MaterialElement extends NodeElement<SAM.Material> {
  observableBuffers: SAM.ObservableGPUBuffer[];
  bindGroup: GPUBindGroup;
  bindGroupLayout: GPUBindGroupLayout;
  vertexShaderModule: GPUShaderModule;
  fragmentShaderModule: GPUShaderModule;
  cullMode: GPUCullMode;

  constructor(device: GPUDevice, material: SAM.Material) {
    super(device, material);

    const bindDataList = this.getBindDataList(material);

    this.observableBuffers = bindDataList.map(
      this.initObservableBuffer.bind(this)
    );
    const [bindGroupLayout, bindGroup] = this.generateBindGroupSet(
      bindDataList,
      this.observableBuffers
    );

    this.bindGroup = bindGroup;
    this.bindGroupLayout = bindGroupLayout;

    this.vertexShaderModule = device.createShaderModule({
      code: material.vertexDescriptor.code,
    });

    this.fragmentShaderModule = device.createShaderModule({
      code: material.fragmentDescriptor.code,
    });

    this.cullMode = "none";
  }

  protected getWatchItems() {
    return [];
  }

  getBindDataList(material: SAM.Material): SAM.BindData<SAM.Material>[] {
    if (material instanceof SAM.BasicMaterial) {
      return [
        {
          label: "color",
          data: {
            type: "float32Array",
            getValue: () => material.color.toTypedArray(),
          },
          visibility: GPUShaderStage.FRAGMENT,
        },
      ];
    }

    throw new Error("Unsupported material type");
  }
}
