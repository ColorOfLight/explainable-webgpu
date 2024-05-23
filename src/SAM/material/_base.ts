import * as SAM from "@site/src/SAM";

export interface MaterialOptions {
  isWireframe?: boolean;
}

export class Material {
  vertexDescriptor: GPUShaderModuleDescriptor;
  fragmentDescriptor: GPUShaderModuleDescriptor;
  isWireframe: boolean;

  constructor(options?: MaterialOptions) {
    this.isWireframe = options?.isWireframe ?? false;
  }

  getMaterialBindDatas(): SAM.MaterialBindData[] {
    return [];
  }
}
