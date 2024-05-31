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
  chunks: {
    geometryChunks: Map<Symbol, SAM.GeometryChunk>;
    materialChunks: Map<Symbol, SAM.MaterialChunk>;
    meshChunks: Map<Symbol, SAM.MeshChunk>;
  };

  constructor(device: GPUDevice, canvasFormat: GPUTextureFormat) {
    this.device = device;
    this.canvasFormat = canvasFormat;
    this.nodeElements = {
      meshElements: new Map(),
      cameraElements: new Map(),
      geometryElements: new Map(),
      materialElements: new Map(),
    };
    this.chunks = {
      geometryChunks: new Map(),
      materialChunks: new Map(),
      meshChunks: new Map(),
    };
  }

  add(node: SAM.Node) {
    if (node instanceof SAM.Mesh) {
      const geometry = node.geometry;

      let geometryChunk: SAM.GeometryChunk;
      if (!this.chunks.geometryChunks.has(geometry.getId())) {
        geometryChunk = new SAM.GeometryChunk(geometry);
        this.chunks.geometryChunks.set(geometry.getId(), geometryChunk);
      } else {
        geometryChunk = this.chunks.geometryChunks.get(geometry.getId());
      }

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

      let materialChunk: SAM.MaterialChunk;
      if (!this.chunks.materialChunks.has(material.getId())) {
        materialChunk = new SAM.MaterialChunk(material);
        this.chunks.materialChunks.set(material.getId(), materialChunk);
      } else {
        materialChunk = this.chunks.materialChunks.get(material.getId());
      }

      let meshElement: SAM.MeshElement;
      if (!this.nodeElements.meshElements.has(node.getId())) {
        meshElement = new SAM.MeshElement(this.device, node);
        this.nodeElements.meshElements.set(node.getId(), meshElement);
      } else {
        meshElement = this.nodeElements.meshElements.get(node.getId());
      }

      let meshChunk: SAM.MeshChunk;
      if (!this.chunks.meshChunks.has(node.getId())) {
        meshChunk = new SAM.MeshChunk(node);
        this.chunks.meshChunks.set(node.getId(), meshChunk);
      } else {
        meshChunk = this.chunks.meshChunks.get(node.getId());
      }

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

  generateRenderSequences(camera: SAM.Camera): SAM.RenderSequence[] {
    const cameraElement = this.nodeElements.cameraElements.get(camera.getId());

    if (cameraElement === undefined) {
      throw new Error("Camera not found in the scene");
    }

    const meshElements = Array.from(this.nodeElements.meshElements.values());

    const renderSequences: SAM.RenderSequence[] = meshElements.map(
      (meshElement) => {
        const geometryElement = this.nodeElements.geometryElements.get(
          meshElement.geometryNodeId
        );
        if (geometryElement === undefined) {
          throw new Error("Geometry not found in the scene");
        }

        const materialElement = this.nodeElements.materialElements.get(
          meshElement.materialNodeId
        );
        if (materialElement === undefined) {
          throw new Error("Material not found in the scene");
        }

        const pipelineElement = new SAM.PipelineElement(
          this.device,
          this.canvasFormat,
          meshElement,
          geometryElement,
          materialElement,
          cameraElement
        );

        return new SAM.RenderSequence(
          meshElement,
          geometryElement,
          materialElement,
          cameraElement,
          pipelineElement
        );
      }
    );

    return renderSequences;
  }
}
