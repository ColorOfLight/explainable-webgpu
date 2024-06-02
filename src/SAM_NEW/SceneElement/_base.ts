import * as SAM from "@site/src/SAM_NEW";

export class SceneElement extends SAM.Reactor {
  device: GPUDevice;

  constructor(device: GPUDevice) {
    super();
    this.device = device;
  }
}
