import * as SAM from "@site/src/SAM_NEW";

export class SceneElement {
  device: GPUDevice;

  constructor(device: GPUDevice) {
    this.device = device;
  }
}

export class NodeElement extends SceneElement {
  nodeId: Symbol;

  constructor(device: GPUDevice, node: SAM.Node) {
    super(device);

    this.nodeId = node.getId();
  }
}

export class PipelineElement extends SceneElement {
  pipeline: GPURenderPipeline;

  constructor(
    device: GPUDevice,
    canvasFormat: GPUTextureFormat,
    meshElement: SAM.MeshElement
  ) {
    super(device);

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [
        meshElement.bindGroupLayout,
        meshElement.materialElement.bindGroupLayout,
      ],
    });

    this.pipeline = device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: meshElement.materialElement.vertexShaderModule,
        buffers: [meshElement.geometryElement.vertexBufferLayout],
      },
      fragment: {
        module: meshElement.materialElement.fragmentShaderModule,
        targets: [
          {
            format: canvasFormat,
          },
        ],
      },
      primitive: {
        topology: meshElement.geometryElement.topology,
        cullMode: meshElement.materialElement.cullMode,
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
      },
    });
  }
}
