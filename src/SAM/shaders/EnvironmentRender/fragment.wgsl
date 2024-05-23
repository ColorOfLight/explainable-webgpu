@group(0) @binding(2) var mySampler: sampler;
@group(0) @binding(3) var myCubeMap: texture_cube<f32>;

struct FragmentInput {
  @location(0) texCoord: vec3f,
};

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
  // return vec4f(1.0, 0.0, 0.0, 1.0);
  let color = textureSample(myCubeMap, mySampler, input.texCoord);
  return color;
}