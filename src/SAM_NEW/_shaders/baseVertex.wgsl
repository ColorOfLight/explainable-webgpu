struct VertexInput {
  @location(0) position: vec3f,
  @location(1) normal: vec3f,
  @location(2) texCoord: vec2f,
  @location(3) color: vec3f,
};

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) globalPosition: vec3f,
  @location(1) normal: vec3f,
  @location(2) texCoord: vec2f,
  @location(3) color: vec3f,
};

@group(0) @binding(0) var<uniform> modelMatrix: mat4x4f;
@group(2) @binding(0) var<uniform> viewMatrix: mat4x4f;
@group(2) @binding(1) var<uniform> projMatrix: mat4x4f;

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput  {
  var output: VertexOutput;
  output.position = projMatrix * viewMatrix * modelMatrix * vec4f(input.position, 1);

  let globalNormal = modelMatrix * vec4f(input.normal, 1);
  let globalPosition = modelMatrix * vec4f(input.position, 1);

  output.globalPosition = globalPosition.xyz / globalPosition.w;
  output.color = input.color;
  output.normal = globalNormal.xyz / globalNormal.w;
  output.texCoord = input.texCoord;

  return output;
}
