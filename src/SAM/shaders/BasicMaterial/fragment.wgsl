struct FragmentInput {
  @location(1) color: vec3f,
};

@group(2) @binding(0) var<uniform> materialColor: vec3f;

@fragment
fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
  let color = select(input.color, materialColor, materialColor.r >= 0);
  return vec4f(color, 1);
}
