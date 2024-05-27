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

    const bindDataList = material.getBindDataList();

    this.buffers = bindDataList.map((item) => {
      if (item.data.type === "numberArray") {
        const bufferData = new Float32Array(item.data.value);
        const buffer = device.createBuffer({
          size: bufferData.byteLength,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        this.device.queue.writeBuffer(buffer, 0, bufferData);

        return buffer;
      }

      throw new Error("Unsupported bind data type");
    });

    this.bindGroupLayout = device.createBindGroupLayout({
      entries: bindDataList.map((_, index) => {
        return {
          label: `Material ${index}`,
          binding: index,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: "uniform",
          },
        };
      }),
    });

    this.bindGroup = device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: bindDataList.map((_, index) => {
        return {
          binding: index,
          resource: {
            buffer: this.buffers[index],
          },
        };
      }),
    });

    this.vertexShaderModule = device.createShaderModule({
      code: material.vertexDescriptor.code,
    });

    this.fragmentShaderModule = device.createShaderModule({
      code: material.fragmentDescriptor.code,
    });

    this.cullMode = "none";
  }
}
