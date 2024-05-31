import * as SAM from "@site/src/SAM_NEW";
import { Chunk } from "./_base";
import { BindData } from "./_type";

export class MeshChunk extends Chunk {
  bindDataList: SAM.SingleDataReactor<BindData>[];
  layoutEntryDataList: SAM.SingleDataReactor<GPUBindGroupLayoutEntry>[];

  constructor(mesh: SAM.Mesh) {
    super();

    this.bindDataList = this.getBindDataList(mesh);
    this.layoutEntryDataList = this.getLayoutEntryDataList();
  }

  getBindDataList(mesh: SAM.Mesh): SAM.SingleDataReactor<BindData>[] {
    return [
      new SAM.SingleDataReactor(
        () => ({
          type: "typed-array",
          value: new Float32Array(mesh.transformMatrix.toRenderingData()),
        }),
        [
          {
            reactor: mesh,
            key: "transformMatrix",
          },
        ]
      ),
    ];
  }

  getLayoutEntryDataList(): SAM.SingleDataReactor<GPUBindGroupLayoutEntry>[] {
    return [
      new SAM.SingleDataReactor(() => ({
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: {
          type: "uniform",
        },
      })),
    ];
  }
}
