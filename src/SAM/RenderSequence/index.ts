import * as SAM from "@site/src/SAM";

export class RenderSequence extends SAM.Reactor {
  pipelineReactor: SAM.SingleDataReactor<GPURenderPipeline>;
  pipelineLayoutReactor: SAM.SingleDataReactor<GPUPipelineLayout>;

  vertexResourceReactor: SAM.NumbersResourceReactor;
  indexResourceReactor: SAM.NumbersResourceReactor;
  indexCountReactor: SAM.SingleDataReactor<number>;
  bindGroupReactors: SAM.SingleDataReactor<GPUBindGroup>[];

  constructor(
    device: GPUDevice,
    canvasFormat: GPUTextureFormat,
    geometryElement: SAM.GeometryElement,
    materialElement: SAM.MaterialElement,
    meshElement: SAM.MeshElement,
    cameraElement: SAM.CameraElement,
    environmentElement: SAM.EnvironmentElement
  ) {
    super();

    this.vertexResourceReactor = geometryElement.vertexResourceReactor;
    this.indexResourceReactor = geometryElement.indexResourceReactor;
    this.indexCountReactor = geometryElement.indexCountReactor;
    this.bindGroupReactors = [
      meshElement.bindGroupReactor,
      materialElement.bindGroupReactor,
      cameraElement.bindGroupReactor,
      environmentElement.bindGroupReactor,
    ];

    const bindGroupLayoutReactors = [
      meshElement.bindGroupLayoutReactor,
      materialElement.bindGroupLayoutReactor,
      cameraElement.bindGroupLayoutReactor,
      environmentElement.bindGroupLayoutReactor,
    ];
    this.pipelineLayoutReactor = new SAM.SingleDataReactor(
      () => {
        return device.createPipelineLayout({
          bindGroupLayouts: bindGroupLayoutReactors.map(
            (reactor) => reactor.data
          ),
        });
      },
      bindGroupLayoutReactors.map((reactor) => ({ reactor, key: "data" }))
    );

    const pipelineDataReactors = [
      geometryElement.pipelineDataReactor,
      materialElement.pipelineDataReactor,
    ];
    this.pipelineReactor = new SAM.SingleDataReactor(() => {
      const pipelineData = pipelineDataReactors.reduce((prevObj, reactor) => {
        return { ...prevObj, ...reactor.data };
      }, {}) as SAM.PipelineData;

      return device.createRenderPipeline({
        layout: this.pipelineLayoutReactor.data,
        vertex: {
          module: materialElement.vertexShaderModuleReactor.data,
          buffers: [pipelineData.vertexBufferLayout],
        },
        fragment: {
          module: materialElement.fragmentShaderModuleReactor.data,
          targets: [
            {
              format: canvasFormat,
            },
          ],
        },
        primitive: {
          topology: pipelineData.topology,
        },
        depthStencil: {
          depthWriteEnabled: pipelineData.depthWriteEnabled,
          depthCompare: "less",
          format: "depth24plus",
        },
      });
    }, [
      ...pipelineDataReactors.map((reactor) => ({ reactor, key: "data" })),
      { reactor: this.pipelineLayoutReactor, key: "data" },
      { reactor: materialElement.vertexShaderModuleReactor, key: "data" },
      { reactor: materialElement.fragmentShaderModuleReactor, key: "data" },
    ]);
  }

  runSequence(passEncoder: GPURenderPassEncoder) {
    passEncoder.setPipeline(this.pipelineReactor.data);
    passEncoder.setVertexBuffer(0, this.vertexResourceReactor.resource.buffer);
    passEncoder.setIndexBuffer(
      this.indexResourceReactor.resource.buffer,
      "uint16"
    );
    this.bindGroupReactors.forEach((reactor, index) => {
      passEncoder.setBindGroup(index, reactor.data);
    });
    passEncoder.drawIndexed(this.indexCountReactor.data, 1, 0, 0, 0);

    // TODO: Remove this after handling initialization optimization
    this.destroy();
  }

  destroy() {
    this.pipelineReactor.deregisterParentHandlers();
    this.pipelineLayoutReactor.deregisterParentHandlers();
  }
}
