import { SceneElement } from "./_base";
import { MeshElement } from "./MeshElement";
import { GeometryElement } from "./GeometryElement";
import { MaterialElement } from "./MaterialElement";
import { CameraElement } from "./CameraElement";
import { EnvironmentElement } from "./EnvironmentElement";

export class PipelineElement extends SceneElement {
  pipeline: GPURenderPipeline;

  constructor(
    device: GPUDevice,
    canvasFormat: GPUTextureFormat,
    meshElement: MeshElement,
    geometryElement: GeometryElement,
    materialElement: MaterialElement,
    cameraElement: CameraElement,
    environmentElement: EnvironmentElement
  ) {
    super(device);

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [
        meshElement.bindGroupLayoutReactor.data,
        materialElement.bindGroupLayoutReactor.data,
        cameraElement.bindGroupLayoutReactor.data,
        environmentElement.bindGroupLayoutReactor.data,
      ],
    });

    this.pipeline = device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: materialElement.vertexShaderModuleReactor.data,
        buffers: [geometryElement.pipelineDataReactor.data.vertexBufferLayout],
      },
      fragment: {
        module: materialElement.fragmentShaderModuleReactor.data,
        targets: [
          {
            format: canvasFormat,
          },
        ],
      },
      primitive: {
        topology: geometryElement.pipelineDataReactor.data.topology,
      },
      depthStencil: {
        depthWriteEnabled:
          materialElement.pipelineDataReactor.data.depthWriteEnabled,
        depthCompare: "less",
        format: "depth24plus",
      },
    });
  }
}
