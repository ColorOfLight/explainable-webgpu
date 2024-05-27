import * as SAM from "@site/src/SAM_NEW";

export class SceneManager {
  device: GPUDevice;
  canvasFormat: GPUTextureFormat;
  nodeElements: {
    meshElements: SAM.MeshElement[];
  };
  pipelineElements: SAM.PipelineElement[];
  renderSequences: SAM.RenderSequence[];

  constructor(device: GPUDevice, canvasFormat: GPUTextureFormat) {
    this.device = device;
    this.canvasFormat = canvasFormat;
    this.nodeElements = {
      meshElements: [],
    };
    this.pipelineElements = [];
    this.renderSequences = [];
  }

  add(node: SAM.Node) {
    if (node instanceof SAM.Mesh) {
      const meshElement = new SAM.MeshElement(this.device, node);
      const pipelineElement = new SAM.PipelineElement(
        this.device,
        this.canvasFormat,
        meshElement
      );
      const renderSequence = new SAM.RenderSequence(
        meshElement,
        pipelineElement
      );

      this.nodeElements.meshElements.push(meshElement);
      this.pipelineElements.push(pipelineElement);
      this.renderSequences.push(renderSequence);

      return;
    }

    throw new Error("Unsupported node type");
  }
}
