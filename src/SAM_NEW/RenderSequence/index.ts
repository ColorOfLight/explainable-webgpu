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
    const vertexBuffer = geometryElement.vertexBuffer;
    const indexBuffer = geometryElement.indexBuffer;
    const indexCount = geometryElement.indexCount;
    const meshBindGroup = meshElement.observableBindGroup.bindGroup;
    const materialBindGroup = materialElement.observableBindGroup.bindGroup;
    const cameraBindGroup = cameraElement.observableBindGroup.bindGroup;
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
