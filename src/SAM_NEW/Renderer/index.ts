import * as SAM from "@site/src/SAM_NEW";

export class WebGPURenderer {
  status: "not-initialized" | "ready" | "device-destroyed" | "device-lost";
  canvas: HTMLCanvasElement;
  adapter: GPUAdapter;
  device: GPUDevice;
  context: GPUCanvasContext;
  canvasFormat: GPUTextureFormat;
  renderPassDescriptor: GPURenderPassDescriptor;

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
    this.device.lost.then((info) => {
      console.error(`WebGPU device was lost: ${info.message}`);

      if (info.reason !== "destroyed") {
        this.status = "device-lost";
        this.init();
      } else {
        this.status = "device-destroyed";
      }
    });

    this.context = this.canvas.getContext("webgpu");
    if (this.context == null) {
      throw new Error("No WebGPU context found.");
    }

    this.canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device: this.device,
      format: this.canvasFormat,
    });

    this.renderPassDescriptor = {
      label: "Render Pass",
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

    this.status = "ready";
  }

  createSceneManager(): SAM.SceneManager {
    return new SAM.SceneManager(this.device, this.canvasFormat);
  }

  render(sceneManager: SAM.SceneManager, camera: SAM.Camera): void {
    if (this.status !== "ready") {
      throw new Error(
        `Renderer is not ready for rendering. Current status is: ${this.status}`
      );
    }

    const canvasTexture = this.context.getCurrentTexture();

    this.renderPassDescriptor.colorAttachments[0].view = this.context
      .getCurrentTexture()
      .createView();

    const depthTexture = this.device.createTexture({
      size: [canvasTexture.width, canvasTexture.height],
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    this.renderPassDescriptor.depthStencilAttachment.view =
      depthTexture.createView();

    const encoderDraw = this.device.createCommandEncoder({
      label: "draw-encoder",
    });
    const pass = encoderDraw.beginRenderPass(this.renderPassDescriptor);

    const renderSequences = sceneManager.generateRenderSequences(camera);

    renderSequences.forEach((renderSequence) => {
      renderSequence.runSequence(pass);
    });

    pass.end();

    const commandBuffer = encoderDraw.finish();
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
