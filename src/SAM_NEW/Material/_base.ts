import * as SAM from "@site/src/SAM_NEW";

export class Material extends SAM.Node {
  vertexDescriptor: GPUShaderModuleDescriptor;
  fragmentDescriptor: GPUShaderModuleDescriptor;

  constructor(label?: string) {
    super(label ?? "Material");
  }
}
