import * as SAM from "@site/src/SAM_NEW";

import { NodeElement } from "./_base";

export class MeshElement extends NodeElement<SAM.Mesh> {
  geometryElement: SAM.GeometryElement;
  materialElement: SAM.MaterialElement;
  buffers: GPUBuffer[];
  bindGroup: GPUBindGroup;
  bindGroupLayout: GPUBindGroupLayout;

  constructor(
    device: GPUDevice,
    mesh: SAM.Mesh,
    geometryElement: SAM.GeometryElement,
    materialElement: SAM.MaterialElement
  ) {
    super(device, mesh);

    const bindDataList = this.getBindDataList(mesh);

    this.geometryElement = geometryElement;
    this.materialElement = materialElement;

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
