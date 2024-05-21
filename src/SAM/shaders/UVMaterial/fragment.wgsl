struct FragmentInput {
  @location(0) uv: vec2f,
};

fn getCheckerBoardColor(uv: vec2f) -> vec3f {
  let xStep = step(0.5, fract(uv.x * 5));
  let yStep = step(0.5, fract(uv.y * 5));

  return select(vec3f(1), vec3f(0.5), xStep + yStep == 1);
}

@group(2) @binding(0) var<uniform> pattern: u32;

@fragment
fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
  let gradientColor = vec3f(input.uv, 0);
  let checkerBoardColor = getCheckerBoardColor(input.uv);

  let isGradientInt = select(0.0, 1.0, pattern == 0);
  let isCheckerBoardInt = select(0.0, 1.0, pattern == 1);

  let color = isGradientInt * gradientColor + isCheckerBoardInt * checkerBoardColor;
  return vec4f(color, 1);
}
