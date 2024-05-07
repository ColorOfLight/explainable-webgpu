struct VertexInput {
  @location(0) position: vec3f,
};

struct VertexOutput {
  @builtin(position) position: vec4f,
};

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput  {
  var output: VertexOutput;
  output.position = vec4f(input.position, 1);
  return output;
}
