import * as SAM from "@site/src/SAM_NEW";

import { NodeElement } from "./_base";

export class CameraElement extends NodeElement {
  buffers: GPUBuffer[];
  bindGroup: GPUBindGroup;
  bindGroupLayout: GPUBindGroupLayout;

  constructor(device: GPUDevice, camera: SAM.Camera) {
    super(device, camera);

    const bindDataList = this.getBindDataList(camera);

    this.buffers = bindDataList.map(this.initBuffer.bind(this));
    const [bindGroupLayout, bindGroup] = this.generateBindGroupSet(
      bindDataList,
      this.buffers
    );

    this.bindGroup = bindGroup;
    this.bindGroupLayout = bindGroupLayout;
  }

  getBindDataList(camera: SAM.Camera): SAM.BindData[] {
    return [
      {
        label: "viewTransform",
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        data: {
          type: "float32Array",
          value: camera.getViewTransformMatrix().toRenderingData(),
        },
      },
      {
        label: "projTransform",
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        data: {
          type: "float32Array",
          value: camera.getProjTransformMatrix().toRenderingData(),
        },
      },
      {
        label: "eyeVector",
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        data: {
          type: "float32Array",
          value: camera.getEyeVector().toNumberArray(),
        },
      },
    ];
  }
}
