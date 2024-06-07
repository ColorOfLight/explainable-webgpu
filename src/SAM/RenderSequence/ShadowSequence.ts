import * as SAM from "@site/src/SAM";
import { RenderSequence } from "./_base";
import ShadowVertexWgsl from "../_shaders/shadowVertex.wgsl";

export class ShadowSequence extends RenderSequence {
  shadowVertexModule: GPUShaderModule;

  constructor(
    device: GPUDevice,
    geometryElement: SAM.GeometryElement,
    meshElement: SAM.MeshElement,
    cameraElement: SAM.CameraElement
  ) {
    super(geometryElement);

    this.bindGroupReactors = [
      meshElement.bindGroupReactor,
      cameraElement.bindGroupReactor,
    ];

    this.shadowVertexModule = device.createShaderModule({
      code: ShadowVertexWgsl,
    });

    const bindGroupLayoutReactors = [
      meshElement.bindGroupLayoutReactor,
      cameraElement.bindGroupLayoutReactor,
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

    const pipelineDataReactors = [geometryElement.pipelineDataReactor];
    this.pipelineReactor = new SAM.SingleDataReactor(() => {
      const pipelineData = pipelineDataReactors.reduce((prevObj, reactor) => {
        return { ...prevObj, ...reactor.data };
      }, {}) as SAM.PipelineData;

      return device.createRenderPipeline({
        layout: this.pipelineLayoutReactor.data,
        vertex: {
          module: this.shadowVertexModule,
          buffers: [pipelineData.vertexBufferLayout],
        },
        primitive: {
          topology: pipelineData.topology,
        },
        depthStencil: {
          depthWriteEnabled: true,
          depthCompare: "less",
          format: "depth24plus",
        },
      });
    }, [
      ...pipelineDataReactors.map((reactor) => ({ reactor, key: "data" })),
      { reactor: this.pipelineLayoutReactor, key: "data" },
    ]);
  }
}
