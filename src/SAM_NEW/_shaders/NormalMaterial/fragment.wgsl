struct FragmentInput {
  @location(0) normal: vec3f,
};

@fragment
fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
  let colorizedNormal = normalize((input.normal + 1.0) / 2.0);
  
  return vec4f(colorizedNormal, 1.0);
}
