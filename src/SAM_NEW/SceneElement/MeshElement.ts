import * as SAM from "@site/src/SAM_NEW";

import { NodeElement } from "./_base";

export class MeshElement extends NodeElement<SAM.Mesh> {
  geometryNodeId: Symbol;
  materialNodeId: Symbol;
  observableBuffers: SAM.ObservableGPUBuffer[];
  observableBindGroup: SAM.ObservableBindGroup;
  bindGroupLayout: GPUBindGroupLayout;

  constructor(device: GPUDevice, mesh: SAM.Mesh) {
    super(device, mesh);

    const bindDataList = this.getBindDataList(mesh);

    this.geometryNodeId = mesh.geometry.getId();
    this.materialNodeId = mesh.material.getId();

    this.observableBuffers = bindDataList.map(
      this.initObservableBuffer.bind(this)
    );
    const [bindGroupLayout, observableBindGroup] = this.generateBindGroupSet(
      bindDataList,
      this.observableBuffers
    );

    this.observableBindGroup = observableBindGroup;
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
