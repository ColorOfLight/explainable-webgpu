import * as SAM from "@site/src/SAM_NEW";

import { NodeElement } from "./_base";

export class CameraElement<
  C extends SAM.Camera = SAM.Camera,
> extends NodeElement<C> {
  observableBuffers: SAM.ObservableGPUBuffer[];
  observableBindGroup: SAM.ObservableBindGroup;
  bindGroupLayout: GPUBindGroupLayout;

  constructor(device: GPUDevice, camera: C) {
    super(device, camera);

    const bindDataList = this.getBindDataList(camera);

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

  protected getWatchItems(): SAM.MediatorWatchItem<keyof C>[] {
    return [];
  }

  getBindDataList(camera: C): SAM.BindData<C>[] {
    const viewTransformBindData = {
      label: "viewTransform",
      data: {
        type: "float32Array" as const,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        getValue: () =>
          new Float32Array(camera.getViewTransformMatrix().toRenderingData()),
      },
      watchKeys: ["eye", "target", "up"] as (keyof C)[],
    };

    const eyeVectorBindData = {
      label: "eyeVector",

      data: {
        type: "float32Array" as const,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        getValue: () => new Float32Array(camera.getEyeVector().toNumberArray()),
      },
      watchKeys: ["eye"] as (keyof C)[],
    };

    if (camera instanceof SAM.PerspectiveCamera) {
      const projectionTransformBindData = {
        label: "projTransform",
        data: {
          type: "float32Array" as const,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          getValue: () =>
            new Float32Array(camera.getProjTransformMatrix().toRenderingData()),
        },
        watchKeys: ["fov", "aspect", "near", "far"] as (keyof C)[],
      };

      return [
        viewTransformBindData,
        projectionTransformBindData,
        eyeVectorBindData,
      ];
    }

    if (camera instanceof SAM.OrthographicCamera) {
      const projectionTransformBindData = {
        label: "projTransform",
        data: {
          type: "float32Array" as const,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          getValue: () =>
            new Float32Array(camera.getProjTransformMatrix().toRenderingData()),
        },
        watchKeys: [
          "left",
          "right",
          "top",
          "bottom",
          "near",
          "far",
        ] as (keyof C)[],
      };

      return [
        viewTransformBindData,
        projectionTransformBindData,
        eyeVectorBindData,
      ];
    }

    throw new Error("Unsupported camera type");
  }
}
