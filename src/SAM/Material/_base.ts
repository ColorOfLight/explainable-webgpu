import * as SAM from "@site/src/SAM";

export interface MaterialOptions {
  label?: string;
}

export class Material extends SAM.Node {
  vertexDescriptor: GPUShaderModuleDescriptor;
  fragmentDescriptor: GPUShaderModuleDescriptor;

  constructor(options?: MaterialOptions) {
    super(options?.label ?? "Material");
  }
}
