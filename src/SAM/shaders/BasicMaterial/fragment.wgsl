struct FragmentInput {
  @location(1) color: vec4f,
};

@fragment
fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
  return input.color;
}
