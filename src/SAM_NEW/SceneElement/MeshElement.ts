import * as SAM from "@site/src/SAM_NEW";

import { NodeElement } from "./_base";

export class MeshElement extends NodeElement<SAM.Mesh> {
  geometryNodeId: Symbol;
  materialNodeId: Symbol;
  buffers: GPUBuffer[];
  bindGroup: GPUBindGroup;
  bindGroupLayout: GPUBindGroupLayout;

  constructor(device: GPUDevice, mesh: SAM.Mesh) {
    super(device, mesh);

    const bindDataList = this.getBindDataList(mesh);

    this.geometryNodeId = mesh.geometry.getId();
    this.materialNodeId = mesh.material.getId();

    this.buffers = bindDataList.map(this.initBuffer.bind(this));
    const [bindGroupLayout, bindGroup] = this.generateBindGroupSet(
      bindDataList,
      this.buffers
    );

    this.bindGroup = bindGroup;
    this.bindGroupLayout = bindGroupLayout;
  }

  getBindDataList(mesh: SAM.Mesh): SAM.BindData<SAM.Mesh>[] {
    return [
      {
        label: "transformMatrix",
        data: {
          type: "float32Array",
          getValue: () =>
            new Float32Array(mesh.transformMatrix.toRenderingData()),
        },
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      },
    ];
  }
}
