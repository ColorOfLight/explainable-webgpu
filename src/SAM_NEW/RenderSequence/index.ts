import * as SAM from "@site/src/SAM_NEW";

export class RenderSequence {
  runSequence: (passEncoder: GPURenderPassEncoder) => void;

  constructor(
    meshElement: SAM.MeshElement,
    pipelineElement: SAM.PipelineElement
  ) {
    const vertexBuffer = meshElement.geometryElement.vertexBuffer;
    const indexBuffer = meshElement.geometryElement.indexBuffer;
    const indexCount = meshElement.geometryElement.indexCount;
    const meshBindGroup = meshElement.bindGroup;
    const materialBindGroup = meshElement.materialElement.bindGroup;
    const pipeline = pipelineElement.pipeline;

    this.runSequence = (passEncoder: GPURenderPassEncoder) => {
      passEncoder.setPipeline(pipeline);
      passEncoder.setVertexBuffer(0, vertexBuffer);
      passEncoder.setIndexBuffer(indexBuffer, "uint16");
      passEncoder.setBindGroup(0, meshBindGroup);
      passEncoder.setBindGroup(1, materialBindGroup);
      passEncoder.drawIndexed(indexCount, 1, 0, 0, 0);
    };
  }
}
