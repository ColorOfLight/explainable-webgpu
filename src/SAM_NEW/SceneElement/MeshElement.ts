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

    const bindDataList = this.getBindDataList(mesh);

    this.geometryElement = new SAM.GeometryElement(device, mesh.geometry);
    this.materialElement = new SAM.MaterialElement(device, mesh.material);

    this.buffers = bindDataList.map(this.initBuffer.bind(this));
    const [bindGroupLayout, bindGroup] = this.generateBindGroupSet(
      bindDataList,
      this.buffers
    );

    this.bindGroup = bindGroup;
    this.bindGroupLayout = bindGroupLayout;
  }

  getBindDataList(mesh: SAM.Mesh): SAM.BindData[] {
    return [
      {
        label: "transformMatrix",
        data: {
          type: "float32Array",
          value: mesh.transformMatrix.toRenderingData(),
        },
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      },
    ];
  }
}
