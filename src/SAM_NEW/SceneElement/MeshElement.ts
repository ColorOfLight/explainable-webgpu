import * as SAM from "@site/src/SAM_NEW";

import { NodeElement } from "./_base";

export class MeshElement extends NodeElement<SAM.Mesh> {
  geometryNodeId: Symbol;
  materialNodeId: Symbol;
  dynamicBuffers: SAM.DynamicGPUBuffer[];
  bindGroup: GPUBindGroup;
  bindGroupLayout: GPUBindGroupLayout;

  constructor(device: GPUDevice, mesh: SAM.Mesh) {
    super(device, mesh);

    const bindDataList = this.getBindDataList(mesh);

    this.geometryNodeId = mesh.geometry.getId();
    this.materialNodeId = mesh.material.getId();

    this.dynamicBuffers = bindDataList.map(this.initDynamicBuffer.bind(this));
    const [bindGroupLayout, bindGroup] = this.generateBindGroupSet(
      bindDataList,
      this.dynamicBuffers
    );

    this.bindGroup = bindGroup;
    this.bindGroupLayout = bindGroupLayout;
  }

  protected getWatchItems() {
    return [];
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
