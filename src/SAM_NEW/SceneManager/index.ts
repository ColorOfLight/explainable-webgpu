import * as SAM from "@site/src/SAM_NEW";

export class SceneManager {
  device: GPUDevice;
  canvasFormat: GPUTextureFormat;
  nodeElements: {
    meshElements: SAM.MeshElement[];
    cameraElements: SAM.CameraElement[];
  };
  pipelineElements: SAM.PipelineElement[];
  renderSequences: SAM.RenderSequence[];

  constructor(device: GPUDevice, canvasFormat: GPUTextureFormat) {
    this.device = device;
    this.canvasFormat = canvasFormat;
    this.nodeElements = {
      meshElements: [],
      cameraElements: [],
    };
    this.pipelineElements = [];
    this.renderSequences = [];
  }

  add(node: SAM.Node) {
    if (node instanceof SAM.Mesh) {
      const meshElement = new SAM.MeshElement(this.device, node);
      const cameraElement = this.nodeElements.cameraElements[0];
      const pipelineElement = new SAM.PipelineElement(
        this.device,
        this.canvasFormat,
        meshElement,
        cameraElement
      );
      const renderSequence = new SAM.RenderSequence(
        meshElement,
        cameraElement,
        pipelineElement
      );

      this.nodeElements.meshElements.push(meshElement);
      this.pipelineElements.push(pipelineElement);
      this.renderSequences.push(renderSequence);

      return;
    }

    if (node instanceof SAM.Camera) {
      const cameraElement = new SAM.CameraElement(this.device, node);
      this.nodeElements.cameraElements.push(cameraElement);

      return;
    }

    throw new Error("Unsupported node type");
  }
}
