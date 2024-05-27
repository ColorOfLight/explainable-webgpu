import * as SAM from "@site/src/SAM_NEW";

import { NodeElement } from "./_base";

export class MaterialElement extends NodeElement {
  buffers: GPUBuffer[];
  bindGroup: GPUBindGroup;
  bindGroupLayout: GPUBindGroupLayout;
  vertexShaderModule: GPUShaderModule;
  fragmentShaderModule: GPUShaderModule;
  cullMode: GPUCullMode;

  constructor(device: GPUDevice, material: SAM.Material) {
    super(device, material);

    const bindDataList = this.getBindDataList(material);

    this.buffers = bindDataList.map(this.initBuffer.bind(this));
    const [bindGroupLayout, bindGroup] = this.generateBindGroupSet(
      bindDataList,
      this.buffers
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

  getBindDataList(material: SAM.Material): SAM.BindData[] {
    if (material instanceof SAM.BasicMaterial) {
      return [
        {
          label: "color",
          data: { type: "float32Array", value: material.color.toNumberArray() },
          visibility: GPUShaderStage.FRAGMENT,
        },
      ];
    }

    throw new Error("Unsupported material type");
  }
}
