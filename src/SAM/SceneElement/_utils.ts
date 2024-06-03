import * as SAM from "@site/src/SAM";

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
  resourceReactors: SAM.BindResourceReactor[],
  bindGroupLayoutReactor: SAM.SingleDataReactor<GPUBindGroupLayout>
) {
  return device.createBindGroup({
    layout: bindGroupLayoutReactor.data,
    entries: resourceReactors.map((resourceReactor, index) => ({
      binding: index,
      resource: resourceReactor.resource,
    })),
  });
}
