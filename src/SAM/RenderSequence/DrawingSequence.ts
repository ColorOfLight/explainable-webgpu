import * as SAM from "@site/src/SAM";
import { RenderSequence } from "./_base";

export class DrawingSequence extends RenderSequence {
  constructor(
    device: GPUDevice,
    canvasFormat: GPUTextureFormat,
    geometryElement: SAM.GeometryElement,
    materialElement: SAM.MaterialElement,
    meshElement: SAM.MeshElement,
    cameraElement: SAM.CameraElement,
    environmentElement: SAM.EnvironmentElement
  ) {
    super(geometryElement);

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
}
