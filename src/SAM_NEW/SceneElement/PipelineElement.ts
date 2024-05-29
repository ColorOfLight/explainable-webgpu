import { SceneElement } from "./_base";
import { MeshElement } from "./MeshElement";
import { GeometryElement } from "./GeometryElement";
import { MaterialElement } from "./MaterialElement";
import { CameraElement } from "./CameraElement";

export class PipelineElement extends SceneElement {
  pipeline: GPURenderPipeline;

  constructor(
    device: GPUDevice,
    canvasFormat: GPUTextureFormat,
    meshElement: MeshElement,
    geometryElement: GeometryElement,
    materialElement: MaterialElement,
    cameraElement: CameraElement
  ) {
    super(device);

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [
        meshElement.bindGroupLayout,
        materialElement.bindGroupLayout,
        cameraElement.bindGroupLayout,
      ],
    });

    this.pipeline = device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: materialElement.vertexShaderModule,
        buffers: [geometryElement.vertexBufferLayout],
      },
      fragment: {
        module: materialElement.fragmentShaderModule,
        targets: [
          {
            format: canvasFormat,
          },
        ],
      },
      primitive: {
        topology: geometryElement.topology,
        cullMode: materialElement.cullMode,
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
      },
    });
  }
}
