struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) texCoord: vec3f,
};

@group(2) @binding(0) var<uniform> viewMatrix: mat4x4f;
@group(2) @binding(1) var<uniform> projMatrix: mat4x4f;

@vertex
fn vertexMain(@location(0) position: vec3f) -> VertexOutput {
  var output: VertexOutput;

  let envAdjustMatrix = mat4x4f(
    vec4f(1, 0, 0, 0),
    vec4f(0, 1, 0, 0),
    vec4f(0, 0, 1, 0),
    vec4f(-viewMatrix[3].xyz, 1)
  );

  output.position = projMatrix * envAdjustMatrix * viewMatrix * vec4f(position, 1.0);
  output.texCoord = position;

  return output;
}
