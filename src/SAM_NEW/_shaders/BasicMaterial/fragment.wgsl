struct FragmentInput {
  @location(0) normal: vec3f,
  @location(1) texCoord: vec2f,
  @location(2) color: vec3f,
};

@group(1) @binding(0) var<uniform> materialColor: vec3f;

@fragment
fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
  let color = select(input.color, materialColor, materialColor.r >= 0);
  return vec4f(color, 1);
}
