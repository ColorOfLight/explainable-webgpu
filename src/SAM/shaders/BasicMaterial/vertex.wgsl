struct VertexInput {
  @location(0) position: vec3f,
  @location(1) color: vec4f,
};

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(1) color: vec4f,
};

@group(0) @binding(0) var<uniform> modelMatrix: mat4x4f;

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput  {
  var output: VertexOutput;
  // output.position = projMatrix * viewMatrix * vec4f(input.position, 1);
  output.position = modelMatrix * vec4f(input.position, 1);
  output.color = input.color;
  return output;
}
