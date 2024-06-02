import * as SAM from "@site/src/SAM_NEW";

export class RenderSequence {
  runSequence: (passEncoder: GPURenderPassEncoder) => void;

  constructor(
    meshElement: SAM.MeshElement,
    geometryElement: SAM.GeometryElement,
    materialElement: SAM.MaterialElement,
    cameraElement: SAM.CameraElement,
    pipelineElement: SAM.PipelineElement
  ) {
    const vertexBuffer = geometryElement.vertexBufferReactor.buffer;
    const indexBuffer = geometryElement.indexBufferReactor.buffer;
    const indexCount = geometryElement.indexCountReactor.data;
    const meshBindGroup = meshElement.bindGroupReactor.data;
    const materialBindGroup = materialElement.bindGroupReactor.data;
    const cameraBindGroup = cameraElement.bindGroupReactor.data;
    const pipeline = pipelineElement.pipeline;

    this.runSequence = (passEncoder: GPURenderPassEncoder) => {
      passEncoder.setPipeline(pipeline);
      passEncoder.setVertexBuffer(0, vertexBuffer);
      passEncoder.setIndexBuffer(indexBuffer, "uint16");
      passEncoder.setBindGroup(0, meshBindGroup);
      passEncoder.setBindGroup(1, materialBindGroup);
      passEncoder.setBindGroup(2, cameraBindGroup);
      passEncoder.drawIndexed(indexCount, 1, 0, 0, 0);
    };
  }
}
