class WebGPURenderer {
  canvas: HTMLCanvasElement;
  context: GPUCanvasContext;
  adapter: GPUAdapter;
  device: GPUDevice;
  presentationFormat: GPUTextureFormat;

  constructor(canvas: HTMLCanvasElement) {
    if (navigator.gpu == null) {
      throw new Error("WebGPU not supported on this browser.");
    }

    this.canvas = canvas;
  }

  async init() {
    this.context = this.canvas.getContext("webgpu");
    this.adapter = await navigator.gpu.requestAdapter();
    this.device = await this.adapter.requestDevice();
    this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();

    this.context.configure({
      device: this.device,
      format: this.presentationFormat,
    });
  }
}

export default WebGPURenderer;
