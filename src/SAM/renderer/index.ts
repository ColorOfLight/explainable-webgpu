import { Scene } from "../scene";

export class WebGPURenderer {
  mode: "not-initialized" | "ready";
  canvas: HTMLCanvasElement;
  adapter: GPUAdapter;
  device: GPUDevice;
  context: GPUCanvasContext;
  canvasFormat: GPUTextureFormat;

  constructor(canvas: HTMLCanvasElement) {
    if (navigator.gpu == null) {
      throw new Error("WebGPU not supported on this browser.");
    }

    this.mode = "not-initialized";
    this.canvas = canvas;
  }

  async init() {
    if (this.mode !== "not-initialized") {
      throw new Error("WebGPURenderer is already initialized!");
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
  }

  render(scene: Scene) {
    const firstMesh = scene.meshes[0];

    const vertexModule = this.device.createShaderModule(
      firstMesh.material.vertexDescriptor
    );
    const fragmentModule = this.device.createShaderModule(
      firstMesh.material.fragmentDescriptor
    );

    const vertexBuffer = this.device.createBuffer({
      label: "Vertex Buffer",
      size: firstMesh.geometry.vertexes.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(vertexBuffer, 0, firstMesh.geometry.vertexes);

    const vertexBufferLayout: GPUVertexBufferLayout = {
      arrayStride: 12,
      attributes: [
        {
          format: "float32x3" as const,
          offset: 0,
          shaderLocation: 0,
        },
      ],
    };

    const pipeline = this.device.createRenderPipeline({
      label: "Renderer Pipeline",
      layout: "auto",
      vertex: {
        module: vertexModule,
        buffers: [vertexBufferLayout],
      },
      fragment: {
        module: fragmentModule,
        targets: [{ format: this.canvasFormat }],
      },
    });

    const renderPassDescriptor = {
      label: "our basic canvas renderPass",
      colorAttachments: [
        {
          view: undefined,
          clearValue: [0.3, 0.3, 0.3, 1],
          loadOp: "clear" as const,
          storeOp: "store" as const,
        },
      ],
    };

    renderPassDescriptor.colorAttachments[0].view = this.context
      .getCurrentTexture()
      .createView();

    const encoder = this.device.createCommandEncoder({ label: "draw-encoder" });
    const pass = encoder.beginRenderPass(renderPassDescriptor);
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.draw(firstMesh.geometry.vertexes.length / 3);
    pass.end();

    const commandBuffer = encoder.finish();
    this.device.queue.submit([commandBuffer]);
  }
}
