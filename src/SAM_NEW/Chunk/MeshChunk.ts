import * as SAM from "@site/src/SAM_NEW";
import { Chunk } from "./_base";

export class MeshChunk extends Chunk {
  bufferDataReactorList: SAM.SingleDataReactor<SAM.BufferData>[];
  layoutEntryDataReactorList: SAM.SingleDataReactor<GPUBindGroupLayoutEntry>[];

  constructor(mesh: SAM.Mesh) {
    super();

    this.bufferDataReactorList = this.getBufferDataList(mesh);
    this.layoutEntryDataReactorList = this.getLayoutEntryDataList();
  }

  getBufferDataList(mesh: SAM.Mesh): SAM.SingleDataReactor<SAM.BufferData>[] {
    return [
      new SAM.SingleDataReactor(
        () => ({
          type: "uniform-typed-array",
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
