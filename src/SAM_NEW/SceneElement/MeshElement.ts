import * as SAM from "@site/src/SAM_NEW";

import { NodeElement } from "./_base";

export class MeshElement extends NodeElement {
  geometryElement: SAM.GeometryElement;
  materialElement: SAM.MaterialElement;
  buffers: GPUBuffer[];
  bindGroup: GPUBindGroup;
  bindGroupLayout: GPUBindGroupLayout;

  constructor(device: GPUDevice, mesh: SAM.Mesh) {
    super(device, mesh);

    const bindDataList = mesh.getBindDataList();

    this.geometryElement = new SAM.GeometryElement(device, mesh.geometry);
    this.materialElement = new SAM.MaterialElement(device, mesh.material);

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
          label: `Mesh ${index}`,
          binding: index,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
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
  }
}
