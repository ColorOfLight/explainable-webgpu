import * as SAM from "@site/src/SAM_NEW";
import { Chunk } from "./_base";

export class CameraChunk extends Chunk {
  bufferDataReactorList: SAM.SingleDataReactor<SAM.BufferData>[];
  layoutEntryDataReactorList: SAM.SingleDataReactor<GPUBindGroupLayoutEntry>[];

  constructor(camera: SAM.Camera) {
    super();

    this.bufferDataReactorList = this.getBufferDataList(camera);
    this.layoutEntryDataReactorList = this.getLayoutEntryDataList();
  }

  getBufferDataList(
    camera: SAM.Camera
  ): SAM.SingleDataReactor<SAM.BufferData>[] {
    let projMatrixReactorKeys = [];
    if (camera instanceof SAM.PerspectiveCamera) {
      projMatrixReactorKeys = ["aspect", "fov", "near", "far"];
    }
    if (camera instanceof SAM.OrthographicCamera) {
      projMatrixReactorKeys = ["left", "right", "top", "bottom", "near", "far"];
    }

    return [
      new SAM.SingleDataReactor(
        () => ({
          type: "uniform-typed-array",
          value: new Float32Array(
            camera.getViewTransformMatrix().toRenderingData()
          ),
        }),
        [
          {
            reactor: camera,
            key: "eye",
          },
          {
            reactor: camera,
            key: "target",
          },
          {
            reactor: camera,
            key: "up",
          },
        ]
      ),
      new SAM.SingleDataReactor(
        () => ({
          type: "uniform-typed-array",
          value: new Float32Array(
            camera.getProjTransformMatrix().toRenderingData()
          ),
        }),
        projMatrixReactorKeys.map((key) => ({
          reactor: camera,
          key,
        }))
      ),
      new SAM.SingleDataReactor(
        () => ({
          type: "uniform-typed-array",
          value: camera.eye.toTypedArray(),
        }),
        [
          {
            reactor: camera,
            key: "eye",
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
      new SAM.SingleDataReactor(() => ({
        binding: 1,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: {
          type: "uniform",
        },
      })),
      new SAM.SingleDataReactor(() => ({
        binding: 2,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: {
          type: "uniform",
        },
      })),
    ];
  }
}
