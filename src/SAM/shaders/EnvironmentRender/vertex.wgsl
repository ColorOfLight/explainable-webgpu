const ADJUST_MATRIX = mat4x4f(
  1.0, 0.0, 0.0, 0.0,
  0.0, 1.0, 0.0, 0.0,
  0.0, 0.0, 1.0, 0.0,
  0.0, 0.0, 0.0, 1.0
);

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) texCoord: vec3f,
};

@group(0) @binding(0) var<uniform> envViewMatrix: mat4x4f;
@group(0) @binding(1) var<uniform> projMatrix: mat4x4f;

@vertex
fn vertexMain(@location(0) position: vec3f) -> VertexOutput {
  var output: VertexOutput;

  output.position = ADJUST_MATRIX * projMatrix * envViewMatrix * vec4f(position, 1.0);
  output.texCoord = position;

  return output;
}
