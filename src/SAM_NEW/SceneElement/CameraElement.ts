import * as SAM from "@site/src/SAM_NEW";

import { NodeElement } from "./_base";

export class CameraElement extends NodeElement<SAM.Camera> {
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

  getBindDataList(camera: SAM.Camera): SAM.BindData<SAM.Camera>[] {
    return [
      {
        label: "viewTransform",
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        data: {
          type: "float32Array",
          getValue: () =>
            new Float32Array(camera.getViewTransformMatrix().toRenderingData()),
        },
        watchKeys: ["eye", "target", "up"],
      },
      {
        label: "projTransform",
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        data: {
          type: "float32Array",
          getValue: () =>
            new Float32Array(camera.getProjTransformMatrix().toRenderingData()),
        },
      },
      {
        label: "eyeVector",
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        data: {
          type: "float32Array",
          getValue: () =>
            new Float32Array(camera.getEyeVector().toNumberArray()),
        },
      },
    ];
  }
}
