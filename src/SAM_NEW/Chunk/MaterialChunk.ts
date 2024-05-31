import * as SAM from "@site/src/SAM_NEW";
import { Chunk } from "./_base";
import { BindData } from "./_type";

export class MaterialChunk extends Chunk {
  bindDataList: SAM.SingleDataReactor<BindData>[];
  layoutEntryDataList: SAM.SingleDataReactor<GPUBindGroupLayoutEntry>[];

  constructor(material: SAM.Material) {
    super();

    this.bindDataList = this.getBindDataList(material);
    this.layoutEntryDataList = this.getLayoutEntryDataList(material);
  }

  getBindDataList(material: SAM.Material): SAM.SingleDataReactor<BindData>[] {
    if (material instanceof SAM.BasicMaterial) {
      return [
        new SAM.SingleDataReactor(
          () => ({
            type: "typed-array",
            value: material.color.toTypedArray(),
          }),
          [
            {
              reactor: material,
              key: "color",
            },
          ]
        ),
      ];
    }

    if (material instanceof SAM.NormalMaterial) {
      return [];
    }

    throw new Error("Unsupported material type");
  }

  getLayoutEntryDataList(
    material: SAM.Material
  ): SAM.SingleDataReactor<GPUBindGroupLayoutEntry>[] {
    if (material instanceof SAM.BasicMaterial) {
      return [
        new SAM.SingleDataReactor(() => ({
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: "uniform",
          },
        })),
      ];
    }

    if (material instanceof SAM.NormalMaterial) {
      return [];
    }

    throw new Error("Unsupported material type");
  }
}
