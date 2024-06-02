import * as SAM from "@site/src/SAM_NEW";

export class SceneManager {
  device: GPUDevice;
  canvasFormat: GPUTextureFormat;
  sceneElements: {
    meshElements: Map<Symbol, SAM.MeshElement>;
    geometryElements: Map<Symbol, SAM.GeometryElement>;
    materialElements: Map<Symbol, SAM.MaterialElement>;
    cameraElements: Map<Symbol, SAM.CameraElement>;
  };
  chunks: {
    geometryChunks: Map<Symbol, SAM.GeometryChunk>;
    materialChunks: Map<Symbol, SAM.MaterialChunk>;
    meshChunks: Map<Symbol, SAM.MeshChunk>;
    cameraChunks: Map<Symbol, SAM.CameraChunk>;
  };

  constructor(device: GPUDevice, canvasFormat: GPUTextureFormat) {
    this.device = device;
    this.canvasFormat = canvasFormat;
    this.sceneElements = {
      meshElements: new Map(),
      cameraElements: new Map(),
      geometryElements: new Map(),
      materialElements: new Map(),
    };
    this.chunks = {
      geometryChunks: new Map(),
      materialChunks: new Map(),
      meshChunks: new Map(),
      cameraChunks: new Map(),
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
      if (!this.sceneElements.geometryElements.has(geometry.getId())) {
        geometryElement = new SAM.GeometryElement(this.device, geometryChunk);
        this.sceneElements.geometryElements.set(
          geometry.getId(),
          geometryElement
        );
      } else {
        geometryElement = this.sceneElements.geometryElements.get(
          geometry.getId()
        );
      }

      const material = node.material;

      let materialChunk: SAM.MaterialChunk;
      if (!this.chunks.materialChunks.has(material.getId())) {
        materialChunk = new SAM.MaterialChunk(material);
        this.chunks.materialChunks.set(material.getId(), materialChunk);
      } else {
        materialChunk = this.chunks.materialChunks.get(material.getId());
      }

      let materialElement: SAM.MaterialElement;
      if (!this.sceneElements.materialElements.has(material.getId())) {
        materialElement = new SAM.MaterialElement(this.device, materialChunk);
        this.sceneElements.materialElements.set(
          material.getId(),
          materialElement
        );
      } else {
        materialElement = this.sceneElements.materialElements.get(
          material.getId()
        );
      }

      let meshChunk: SAM.MeshChunk;
      if (!this.chunks.meshChunks.has(node.getId())) {
        meshChunk = new SAM.MeshChunk(node);
        this.chunks.meshChunks.set(node.getId(), meshChunk);
      } else {
        meshChunk = this.chunks.meshChunks.get(node.getId());
      }

      let meshElement: SAM.MeshElement;
      if (!this.sceneElements.meshElements.has(node.getId())) {
        meshElement = new SAM.MeshElement(this.device, meshChunk);
        this.sceneElements.meshElements.set(node.getId(), meshElement);
      } else {
        meshElement = this.sceneElements.meshElements.get(node.getId());
      }

      return;
    }

    if (node instanceof SAM.Camera) {
      let cameraChunk: SAM.CameraChunk;
      if (!this.chunks.cameraChunks.has(node.getId())) {
        cameraChunk = new SAM.CameraChunk(node);
        this.chunks.cameraChunks.set(node.getId(), cameraChunk);
      } else {
        cameraChunk = this.chunks.cameraChunks.get(node.getId());
      }

      if (!this.sceneElements.cameraElements.has(node.getId())) {
        const cameraElement = new SAM.CameraElement(this.device, cameraChunk);
        this.sceneElements.cameraElements.set(node.getId(), cameraElement);
      }

      return;
    }

    throw new Error("Unsupported node type");
  }

  generateRenderSequences(camera: SAM.Camera): SAM.RenderSequence[] {
    const cameraElement = this.sceneElements.cameraElements.get(camera.getId());

    if (cameraElement === undefined) {
      throw new Error("Camera not found in the scene");
    }

    const meshElements = Array.from(this.sceneElements.meshElements.values());

    const renderSequences: SAM.RenderSequence[] = meshElements.map(
      (meshElement) => {
        const geometryElement = this.sceneElements.geometryElements.get(
          meshElement.geometryNodeIdReactor.data
        );
        if (geometryElement === undefined) {
          throw new Error("Geometry not found in the scene");
        }

        const materialElement = this.sceneElements.materialElements.get(
          meshElement.materialNodeIdReactor.data
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
