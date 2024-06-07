import * as SAM from "@site/src/SAM";

export class RenderSequence extends SAM.Reactor {
  // Newly generated reactors
  pipelineReactor: SAM.SingleDataReactor<GPURenderPipeline>;
  pipelineLayoutReactor: SAM.SingleDataReactor<GPUPipelineLayout>;

  // Reactors from other elements
  vertexResourceReactor: SAM.NumbersResourceReactor;
  indexResourceReactor: SAM.NumbersResourceReactor;
  indexCountReactor: SAM.SingleDataReactor<number>;
  bindGroupReactors: SAM.SingleDataReactor<GPUBindGroup>[];

  constructor(geometryElement: SAM.GeometryElement) {
    super();

    this.vertexResourceReactor = geometryElement.vertexResourceReactor;
    this.indexResourceReactor = geometryElement.indexResourceReactor;
    this.indexCountReactor = geometryElement.indexCountReactor;
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
