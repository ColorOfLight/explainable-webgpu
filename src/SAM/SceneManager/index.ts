import * as SAM from "@site/src/SAM";

export class SceneManager {
  device: GPUDevice;
  canvasFormat: GPUTextureFormat;
  chunks: {
    geometryChunks: Map<Symbol, SAM.GeometryChunk>;
    materialChunks: Map<Symbol, SAM.MaterialChunk>;
    meshChunks: Map<Symbol, SAM.MeshChunk>;
    cameraChunks: Map<Symbol, SAM.CameraChunk>;
    shadowCameraChunks: Map<Symbol, SAM.CameraChunk>;
    lightChunks: Map<Symbol, SAM.LightChunk>;
  };
  sceneElements: {
    meshElements: Map<Symbol, SAM.MeshElement>;
    geometryElements: Map<Symbol, SAM.GeometryElement>;
    materialElements: Map<Symbol, SAM.MaterialElement>;
    cameraElements: Map<Symbol, SAM.CameraElement>;
    shadowCameraElements: Map<Symbol, SAM.CameraElement>;
    environmentElement: SAM.EnvironmentElement;
  };
  backgroundElement: SAM.MeshElement | undefined;

  constructor(device: GPUDevice, canvasFormat: GPUTextureFormat) {
    this.device = device;
    this.canvasFormat = canvasFormat;
    this.chunks = {
      geometryChunks: new Map(),
      materialChunks: new Map(),
      meshChunks: new Map(),
      cameraChunks: new Map(),
      shadowCameraChunks: new Map(),
      lightChunks: new Map(),
    };
    this.sceneElements = {
      meshElements: new Map(),
      cameraElements: new Map(),
      shadowCameraElements: new Map(),
      geometryElements: new Map(),
      materialElements: new Map(),
      environmentElement: new SAM.EnvironmentElement(device),
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

    if (node instanceof SAM.Light) {
      let lightChunk: SAM.LightChunk;
      if (!this.chunks.lightChunks.has(node.getId())) {
        lightChunk = new SAM.LightChunk(node);
        this.chunks.lightChunks.set(node.getId(), lightChunk);
      } else {
        lightChunk = this.chunks.lightChunks.get(node.getId());
      }

      if (node instanceof SAM.LightWithShadow) {
        let shadowCameraChunk: SAM.CameraChunk;
        if (!this.chunks.shadowCameraChunks.has(node.shadow.camera.getId())) {
          shadowCameraChunk = new SAM.CameraChunk(node.shadow.camera);
          this.chunks.shadowCameraChunks.set(
            node.shadow.camera.getId(),
            shadowCameraChunk
          );
        } else {
          shadowCameraChunk = this.chunks.shadowCameraChunks.get(
            node.shadow.camera.getId()
          );
        }

        if (!this.sceneElements.shadowCameraElements.has(node.getId())) {
          const shadowCameraElement = new SAM.CameraElement(
            this.device,
            shadowCameraChunk
          );
          this.sceneElements.shadowCameraElements.set(
            node.shadow.camera.getId(),
            shadowCameraElement
          );
        }
      }

      const lightChunks = Array.from(this.chunks.lightChunks.values());
      this.sceneElements.environmentElement.updateLights(
        lightChunks,
        this.chunks.shadowCameraChunks
      );

      return;
    }

    throw new Error("Unsupported node type");
  }

  setBackground(cubeMapTexture: SAM.CubeMapTexture) {
    if (this.backgroundElement !== undefined) {
      throw new Error("Background already set");
    }

    const geometry = new SAM.CubeGeometry(1, 1, 1);
    const material = new SAM.EnvironmentCubeMaterial(cubeMapTexture);
    const mesh = new SAM.Mesh(geometry, material);

    const geometryChunk = new SAM.GeometryChunk(geometry);
    this.chunks.geometryChunks.set(geometry.getId(), geometryChunk);

    const geometryElement = new SAM.GeometryElement(this.device, geometryChunk);
    this.sceneElements.geometryElements.set(geometry.getId(), geometryElement);

    const materialChunk = new SAM.MaterialChunk(material);
    this.chunks.materialChunks.set(material.getId(), materialChunk);

    const materialElement = new SAM.MaterialElement(this.device, materialChunk);
    this.sceneElements.materialElements.set(material.getId(), materialElement);

    const meshChunk = new SAM.MeshChunk(mesh);
    this.chunks.meshChunks.set(mesh.getId(), meshChunk);

    const meshElement = new SAM.MeshElement(this.device, meshChunk);
    this.backgroundElement = meshElement;
  }

  generateRenderSequences(camera: SAM.Camera): SAM.RenderSequence[] {
    const cameraElement = this.sceneElements.cameraElements.get(camera.getId());

    if (cameraElement === undefined) {
      throw new Error("Camera not found in the scene");
    }

    const backgroundMeshElement = this.backgroundElement;
    const sceneMeshElements = Array.from(
      this.sceneElements.meshElements.values()
    );

    const meshElements = [
      ...(backgroundMeshElement !== undefined ? [backgroundMeshElement] : []),
      ...sceneMeshElements,
    ];

    const newRenderSequences: SAM.RenderSequence[] = meshElements.map(
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

        return new SAM.RenderSequence(
          this.device,
          this.canvasFormat,
          geometryElement,
          materialElement,
          meshElement,
          cameraElement,
          this.sceneElements.environmentElement
        );
      }
    );

    return newRenderSequences;
  }
}
