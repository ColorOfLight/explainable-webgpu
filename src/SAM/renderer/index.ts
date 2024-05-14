import * as SAM from "@site/src/SAM";

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

    const firstMesh = scene.meshes[0];
    const modelTransformData = firstMesh.transformMatrix.getRenderingData();
    const vertexData = firstMesh.geometry.getVertexBufferData();
    const projTransformData = camera
      .getProjTransformMatrix()
      .getRenderingData();
    const viewTransformData = camera
      .getViewTransformMatrix()
      .getRenderingData();

    const vertexModule = this.device.createShaderModule(
      firstMesh.material.vertexDescriptor
    );
    const fragmentModule = this.device.createShaderModule(
      firstMesh.material.fragmentDescriptor
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

    const cameraBindGroupLayout: GPUBindGroupLayout =
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

    const cameraBindGroup = this.device.createBindGroup({
      layout: cameraBindGroupLayout,
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

    const pipelineLayout = this.device.createPipelineLayout({
      label: "Render Layout",
      bindGroupLayouts: [cameraBindGroupLayout, modelBindGroupLayout],
    });

    const pipeline = this.device.createRenderPipeline({
      label: "Renderer Pipeline",
      layout: pipelineLayout,
      vertex: {
        module: vertexModule,
        buffers: [vertexBufferLayout],
      },
      fragment: {
        module: fragmentModule,
        targets: [{ format: this.canvasFormat }],
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
      },
      // primitive: {
      //   cullMode: "back",
      // },
    });

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
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, cameraBindGroup);
    pass.setBindGroup(1, modelBindGroup);

    pass.setVertexBuffer(0, vertexBuffer);
    pass.draw(firstMesh.geometry.vertexes.length);
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
}
