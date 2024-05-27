import * as SAM from "@site/src/SAM_NEW";

export class SceneElement {
  device: GPUDevice;

  constructor(device: GPUDevice) {
    this.device = device;
  }
}

export class NodeElement extends SceneElement {
  nodeId: Symbol;

  constructor(device: GPUDevice, node: SAM.Node) {
    super(device);

    this.nodeId = node.getId();
  }

  protected initBuffer(bindData: SAM.BindData) {
    if (bindData.data.type === "float32Array") {
      const typedData = new Float32Array(bindData.data.value);

      const buffer = this.device.createBuffer({
        label: bindData.label,
        size: typedData.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      this.device.queue.writeBuffer(buffer, 0, typedData);

      return buffer;
    }

    throw new Error("Unsupported bind data type");
  }

  protected generateBindGroupSet(
    bindDataList: SAM.BindData[],
    buffers: GPUBuffer[]
  ): [GPUBindGroupLayout, GPUBindGroup] {
    const bindGroupLayout = this.device.createBindGroupLayout({
      entries: bindDataList.map((bindData, index) => {
        if (bindData.data.type === "float32Array") {
          return {
            label: `Bind data layout(${index}): ${bindData.label}`,
            binding: index,
            visibility: bindDataList[index].visibility,
            buffer: {
              type: "uniform",
            },
          };
        }

        throw new Error("Unsupported bind data type");
      }),
    });

    const bindGroup = this.device.createBindGroup({
      layout: bindGroupLayout,
      entries: bindDataList.map((bindData, index) => {
        if (bindData.data.type === "float32Array") {
          return {
            binding: index,
            resource: {
              buffer: buffers[index],
            },
          };
        }

        throw new Error("Unsupported bind data type");
      }),
    });

    return [bindGroupLayout, bindGroup];
  }
}

export class PipelineElement extends SceneElement {
  pipeline: GPURenderPipeline;

  constructor(
    device: GPUDevice,
    canvasFormat: GPUTextureFormat,
    meshElement: SAM.MeshElement,
    cameraElement: SAM.CameraElement
  ) {
    super(device);

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [
        meshElement.bindGroupLayout,
        meshElement.materialElement.bindGroupLayout,
        cameraElement.bindGroupLayout,
      ],
    });

    this.pipeline = device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: meshElement.materialElement.vertexShaderModule,
        buffers: [meshElement.geometryElement.vertexBufferLayout],
      },
      fragment: {
        module: meshElement.materialElement.fragmentShaderModule,
        targets: [
          {
            format: canvasFormat,
          },
        ],
      },
      primitive: {
        topology: meshElement.geometryElement.topology,
        cullMode: meshElement.materialElement.cullMode,
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
      },
    });
  }
}
