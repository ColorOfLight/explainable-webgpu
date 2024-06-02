import * as SAM from "@site/src/SAM_NEW";

export function createBindGroupLayout(
  device: GPUDevice,
  layoutEntryDataReactorList: SAM.SingleDataReactor<GPUBindGroupLayoutEntry>[]
) {
  return device.createBindGroupLayout({
    entries: layoutEntryDataReactorList.map(
      (layoutEntryDataReactor) => layoutEntryDataReactor.data
    ),
  });
}

export function createBindGroup(
  device: GPUDevice,
  bindBufferReactors: SAM.GPUBufferReactor[],
  bindGroupLayoutReactor: SAM.SingleDataReactor<GPUBindGroupLayout>
) {
  return device.createBindGroup({
    layout: bindGroupLayoutReactor.data,
    entries: bindBufferReactors.map((bufferReactor, index) => ({
      binding: index,
      resource: {
        buffer: bufferReactor.buffer,
      },
    })),
  });
}
