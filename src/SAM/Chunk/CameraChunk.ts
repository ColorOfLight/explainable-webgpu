import * as SAM from "@site/src/SAM";
import { Chunk } from "./_base";

export class CameraChunk extends Chunk {
  precursorReactorList: SAM.SingleDataReactor<SAM.BindingResourcePrecursor>[];
  layoutEntryDataReactorList: SAM.SingleDataReactor<GPUBindGroupLayoutEntry>[];

  constructor(camera: SAM.Camera) {
    super();

    this.precursorReactorList = this.getPrecursorList(camera);
    this.layoutEntryDataReactorList = this.getLayoutEntryDataList();
  }

  getPrecursorList(
    camera: SAM.Camera
  ): SAM.SingleDataReactor<SAM.BindingResourcePrecursor>[] {
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
