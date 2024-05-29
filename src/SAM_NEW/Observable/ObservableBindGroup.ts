import { Observable } from "./_base";

export class ObservableBindGroup extends Observable {
  bindGroup: GPUBindGroup;

  constructor(bindGroup: GPUBindGroup) {
    super();
    this.bindGroup = bindGroup;
  }
}
