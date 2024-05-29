import * as SAM from "@site/src/SAM_NEW";

export class SceneManager {
  device: GPUDevice;
  canvasFormat: GPUTextureFormat;
  nodeElements: {
    meshElements: Map<Symbol, SAM.MeshElement>;
    geometryElements: Map<Symbol, SAM.GeometryElement>;
    materialElements: Map<Symbol, SAM.MaterialElement>;
    cameraElements: Map<Symbol, SAM.CameraElement>;
  };
  pipelineElements: SAM.PipelineElement[];
  renderSequences: SAM.RenderSequence[];

  constructor(device: GPUDevice, canvasFormat: GPUTextureFormat) {
    this.device = device;
    this.canvasFormat = canvasFormat;
    this.nodeElements = {
      meshElements: new Map(),
      cameraElements: new Map(),
      geometryElements: new Map(),
      materialElements: new Map(),
    };
    this.pipelineElements = [];
    this.renderSequences = [];
  }

  add(node: SAM.Node) {
    if (node instanceof SAM.Mesh) {
      const geometry = node.geometry;
      let geometryElement: SAM.GeometryElement;
      if (!this.nodeElements.geometryElements.has(geometry.getId())) {
        geometryElement = new SAM.GeometryElement(this.device, geometry);
        this.nodeElements.geometryElements.set(
          geometry.getId(),
          geometryElement
        );
      } else {
        geometryElement = this.nodeElements.geometryElements.get(
          geometry.getId()
        );
      }

      const material = node.material;
      let materialElement: SAM.MaterialElement;
      if (!this.nodeElements.materialElements.has(material.getId())) {
        materialElement = new SAM.MaterialElement(this.device, material);
        this.nodeElements.materialElements.set(
          material.getId(),
          materialElement
        );
      } else {
        materialElement = this.nodeElements.materialElements.get(
          material.getId()
        );
      }

      let meshElement: SAM.MeshElement;
      if (!this.nodeElements.meshElements.has(node.getId())) {
        meshElement = new SAM.MeshElement(
          this.device,
          node,
          geometryElement,
          materialElement
        );
        this.nodeElements.meshElements.set(node.getId(), meshElement);
      } else {
        meshElement = this.nodeElements.meshElements.get(node.getId());
      }

      const cameraElement = this.nodeElements.cameraElements.values().next()
        .value as SAM.CameraElement;

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

      this.pipelineElements.push(pipelineElement);
      this.renderSequences.push(renderSequence);

      return;
    }

    if (node instanceof SAM.Camera) {
      if (!this.nodeElements.cameraElements.has(node.getId())) {
        const cameraElement = new SAM.CameraElement(this.device, node);
        this.nodeElements.cameraElements.set(node.getId(), cameraElement);
      }

      return;
    }

    throw new Error("Unsupported node type");
  }
}
