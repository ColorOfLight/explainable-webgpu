import * as SAM from "@site/src/SAM_NEW";

import { NodeElement } from "./_base";

export class CameraElement extends NodeElement {
  buffers: GPUBuffer[];
  bindGroup: GPUBindGroup;
  bindGroupLayout: GPUBindGroupLayout;

  constructor(device: GPUDevice, camera: SAM.Camera) {
    super(device, camera);

    const viewTransformMatrixData = new Float32Array(
      camera.getViewTransformMatrix().toRenderingData()
    );
    const projTransformMatrixData = new Float32Array(
      camera.getProjTransformMatrix().toRenderingData()
    );
    const eyeVectorData = camera.getEyeVector().toTypedArray();

    const viewTransformBuffer = device.createBuffer({
      label: "View Transform Buffer",
      size: viewTransformMatrixData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(
      viewTransformBuffer,
      0,
      viewTransformMatrixData.buffer
    );

    const projTransformBuffer = device.createBuffer({
      label: "Projection Transform Buffer",
      size: projTransformMatrixData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(
      projTransformBuffer,
      0,
      projTransformMatrixData.buffer
    );

    const eyeVectorBuffer = device.createBuffer({
      label: "Eye Vector Buffer",
      size: eyeVectorData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(eyeVectorBuffer, 0, eyeVectorData.buffer);

    const bindGroupLayout = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: {
            type: "uniform" as const,
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: {
            type: "uniform" as const,
          },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: {
            type: "uniform" as const,
          },
        },
      ],
    });

    const bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: viewTransformBuffer,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: projTransformBuffer,
          },
        },
        {
          binding: 2,
          resource: {
            buffer: eyeVectorBuffer,
          },
        },
      ],
    });

    this.buffers = [viewTransformBuffer, projTransformBuffer, eyeVectorBuffer];
    this.bindGroup = bindGroup;
    this.bindGroupLayout = bindGroupLayout;
  }
}
