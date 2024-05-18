struct FragmentInput {
  @location(1) color: vec4f,
};

@group(2) @binding(0) var<uniform> materialColor: vec4f;

@fragment
fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
  return select(input.color, materialColor, materialColor.a >= 0);
}
