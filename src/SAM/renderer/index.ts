import * as SAM from "@site/src/SAM";

export interface RenderItem {
  pipeline: GPURenderPipeline;
  bindGroups: GPUBindGroup[];
  vertexBuffer: GPUBuffer;
  indexBuffer: GPUBuffer;
  indexCount: number;
}

export interface CameraBindItem {
  bindGroup: GPUBindGroup;
  bindGroupLayout: GPUBindGroupLayout;
}

export interface MeshBindItem {
  modelBindGroup: GPUBindGroup;
  modelBindGroupLayout: GPUBindGroupLayout;
  vertexBuffer: GPUBuffer;
  vertexBufferLayout: GPUVertexBufferLayout;
  indexCount: number;
  materialBindGroup: GPUBindGroup;
  materialBindGroupLayout: GPUBindGroupLayout;
  vertexModule: GPUShaderModule;
  fragmentModule: GPUShaderModule;
  indexBuffer: GPUBuffer;
  topology: GPUPrimitiveTopology;
}

export class WebGPURenderer {
  status: "not-initialized" | "ready" | "device-destroyed" | "device-lost";
  canvas: HTMLCanvasElement;
  adapter: GPUAdapter;
  device: GPUDevice;
  context: GPUCanvasContext;
  canvasFormat: GPUTextureFormat;

  constructor(canvas: HTMLCanvasElement) {
    if (navigator.gpu == null) {
      throw new Error("WebGPU not supported on this browser.");
    }

    this.status = "not-initialized";
    this.canvas = canvas;
  }

  async init(): Promise<void> {
    if (this.status === "ready") {
      throw new Error("Renderer already initialized.");
    }

    this.adapter = await navigator.gpu.requestAdapter();
    if (this.adapter == null) {
      throw new Error("No appropriate GPUAdapter found.");
    }

    this.device = await this.adapter.requestDevice();

    this.context = this.canvas.getContext("webgpu");
    if (this.context == null) {
      throw new Error("No WebGPU context found.");
    }

    this.canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device: this.device,
      format: this.canvasFormat,
    });

    this.device.lost.then((info) => {
      console.error(`WebGPU device was lost: ${info.message}`);

      if (info.reason !== "destroyed") {
        this.status = "device-lost";
        this.init();
      } else {
        this.status = "device-destroyed";
      }
    });

    this.status = "ready";
  }

  render(scene: SAM.Scene, camera: SAM.Camera): void {
    if (this.status !== "ready") {
      throw new Error(
        `Renderer is not ready for rendering. Current status is: ${this.status}`
      );
    }

    const renderItems = this.generateRenderItems(scene, camera);

    const renderPassDescriptor: GPURenderPassDescriptor = {
      label: "our basic canvas renderPass",
      colorAttachments: [
        {
          view: undefined,
          clearValue: [0.3, 0.3, 0.3, 1],
          loadOp: "clear" as const,
          storeOp: "store" as const,
        },
      ],
      depthStencilAttachment: {
        view: undefined,
        depthClearValue: 1.0,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    };

    const canvasTexture = this.context.getCurrentTexture();

    renderPassDescriptor.colorAttachments[0].view = this.context
      .getCurrentTexture()
      .createView();

    const depthTexture = this.device.createTexture({
      size: [canvasTexture.width, canvasTexture.height],
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    renderPassDescriptor.depthStencilAttachment.view =
      depthTexture.createView();

    const encoder = this.device.createCommandEncoder({
      label: "draw-encoder",
    });
    const pass = encoder.beginRenderPass(renderPassDescriptor);

    renderItems.forEach((renderItem) => {
      const { pipeline, bindGroups, vertexBuffer, indexBuffer, indexCount } =
        renderItem;

      pass.setPipeline(pipeline);
      bindGroups.forEach((bindGroup, index) => {
        pass.setBindGroup(index, bindGroup);
      });
      pass.setVertexBuffer(0, vertexBuffer);
      pass.setIndexBuffer(indexBuffer, "uint16");
      pass.drawIndexed(indexCount, 1, 0, 0, 0);
    });
    pass.end();

    const commandBuffer = encoder.finish();
    this.device.queue.submit([commandBuffer]);
  }

  generateResizeObserver(callback?: () => void): ResizeObserver {
    return new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (!(entry.target instanceof HTMLCanvasElement)) {
          throw new Error("ResizeObserver target must be a canvas element.");
        }

        const canvas = entry.target as HTMLCanvasElement;
        const width = entry.contentBoxSize[0].inlineSize;
        const height = entry.contentBoxSize[0].blockSize;
        canvas.width = Math.max(
          1,
          Math.min(width, this.device.limits.maxTextureDimension2D)
        );
        canvas.height = Math.max(
          1,
          Math.min(height, this.device.limits.maxTextureDimension2D)
        );
        callback?.();
      }
    });
  }

  generateRenderItems(scene: SAM.Scene, camera: SAM.Camera): RenderItem[] {
    const {
      bindGroup: cameraBindGroup,
      bindGroupLayout: cameraBindGroupLayout,
    } = this.generateCameraBindItem(camera);
    const meshBindItems = scene.meshes.map((mesh) =>
      this.generateMeshBindItem(mesh)
    );

    return meshBindItems.map((meshBindItem, index) => {
      const pipelineLayout = this.device.createPipelineLayout({
        label: `Render Layout ${index}`,
        bindGroupLayouts: [
          cameraBindGroupLayout,
          meshBindItem.modelBindGroupLayout,
          meshBindItem.materialBindGroupLayout,
        ],
      });

      const pipeline = this.device.createRenderPipeline({
        label: "Renderer Pipeline",
        layout: pipelineLayout,
        vertex: {
          module: meshBindItem.vertexModule,
          buffers: [meshBindItem.vertexBufferLayout],
        },
        fragment: {
          module: meshBindItem.fragmentModule,
          targets: [{ format: this.canvasFormat }],
        },
        depthStencil: {
          depthWriteEnabled: true,
          depthCompare: "less",
          format: "depth24plus",
        },
        primitive: {
          topology: meshBindItem.topology,
        },
      });

      return {
        pipeline,
        bindGroups: [
          cameraBindGroup,
          meshBindItem.modelBindGroup,
          meshBindItem.materialBindGroup,
        ],
        vertexBuffer: meshBindItem.vertexBuffer,
        indexCount: meshBindItem.indexCount,
        indexBuffer: meshBindItem.indexBuffer,
      };
    });
  }

  generateCameraBindItem(camera: SAM.Camera): CameraBindItem {
    const projTransformData = camera
      .getProjTransformMatrix()
      .getRenderingData();
    const viewTransformData = camera
      .getViewTransformMatrix()
      .getRenderingData();

    const viewTransformBuffer = this.device.createBuffer({
      label: "View Transform Buffer",
      size: viewTransformData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(viewTransformBuffer, 0, viewTransformData);

    const projTransformBuffer = this.device.createBuffer({
      label: "Projection Transform Buffer",
      size: projTransformData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(projTransformBuffer, 0, projTransformData);

    const bindGroupLayout: GPUBindGroupLayout =
      this.device.createBindGroupLayout({
        label: "Camera Bind Group Layout",
        entries: [
          {
            // View Transformation Matrix
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: {
              type: "uniform" as const,
            },
          },
          {
            // Projection Transformation Matrix
            binding: 1,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: {
              type: "uniform" as const,
            },
          },
        ],
      });

    const bindGroup = this.device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: viewTransformBuffer,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: projTransformBuffer,
          },
        },
      ],
    });

    return { bindGroup, bindGroupLayout };
  }

  generateMeshBindItem(mesh: SAM.Mesh): MeshBindItem {
    const modelTransformData = mesh.transformMatrix.getRenderingData();
    const { vertexData, indexData, indexCount } = mesh.geometry.getBufferData({
      isWireframe: mesh.material.isWireframe,
    });
    const uniformItems = mesh.material.getUniformItems();
    const topology = mesh.material.isWireframe ? "line-list" : "triangle-list";

    const vertexModule = this.device.createShaderModule(
      mesh.material.vertexDescriptor
    );
    const fragmentModule = this.device.createShaderModule(
      mesh.material.fragmentDescriptor
    );

    const vertexBuffer = this.device.createBuffer({
      label: "Vertex Buffer",
      size: vertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(vertexBuffer, 0, vertexData);

    const modelTransformBuffer = this.device.createBuffer({
      label: "Model Transform Buffer",
      size: modelTransformData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(modelTransformBuffer, 0, modelTransformData);

    const materialBuffers = uniformItems.map((uniformItem) => {
      const uniformBuffer = this.device.createBuffer({
        label: uniformItem.label,
        size: uniformItem.data.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      this.device.queue.writeBuffer(uniformBuffer, 0, uniformItem.data);

      return uniformBuffer;
    });

    const vertexBufferLayout: GPUVertexBufferLayout = {
      arrayStride: 4 * (3 + 4),
      attributes: [
        {
          // Position
          format: "float32x3" as const,
          offset: 0,
          shaderLocation: 0,
        },
        {
          // Color
          format: "float32x4" as const,
          offset: 4 * 3,
          shaderLocation: 1,
        },
      ],
    };

    const indexBuffer = this.device.createBuffer({
      label: "Index Buffer",
      size: indexData.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(indexBuffer, 0, indexData);

    const modelBindGroupLayout: GPUBindGroupLayout =
      this.device.createBindGroupLayout({
        label: "Model Bind Group Layout",
        entries: [
          {
            // Model Transformation Matrix
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: {
              type: "uniform" as const,
            },
          },
        ],
      });

    const modelBindGroup = this.device.createBindGroup({
      layout: modelBindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: modelTransformBuffer,
          },
        },
      ],
    });

    const materialBindGroupLayout = this.device.createBindGroupLayout({
      label: "Material Bind Group Layout",
      entries: uniformItems.map((_, index) => ({
        binding: index,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: {
          type: "uniform",
        },
      })),
    });

    const materialBindGroup = this.device.createBindGroup({
      layout: materialBindGroupLayout,
      entries: materialBuffers.map((buffer, index) => ({
        binding: index,
        resource: {
          buffer,
        },
      })),
    });

    return {
      modelBindGroup,
      modelBindGroupLayout,
      materialBindGroup,
      materialBindGroupLayout,
      vertexBuffer,
      vertexBufferLayout,
      vertexModule,
      fragmentModule,
      indexCount,
      indexBuffer,
      topology,
    };
  }
}
