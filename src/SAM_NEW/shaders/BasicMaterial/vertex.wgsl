struct VertexInput {
  @location(0) position: vec3f,
  @location(1) normal: vec3f,
  @location(2) texCoord: vec2f,
  @location(3) color: vec3f,
};

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(1) color: vec3f,
};

// @group(0) @binding(0) var<uniform> viewMatrix: mat4x4f;
// @group(0) @binding(1) var<uniform> projMatrix: mat4x4f;
// @group(1) @binding(0) var<uniform> modelMatrix: mat4x4f;

@group(0) @binding(0) var<uniform> modelMatrix: mat4x4f;

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput  {
  var output: VertexOutput;
  // output.position = projMatrix * viewMatrix * modelMatrix * vec4f(input.position, 1);
  output.position = modelMatrix * vec4f(input.position, 1);

  output.color = input.color;

  return output;
}
