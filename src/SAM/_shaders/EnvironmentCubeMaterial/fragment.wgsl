@group(1) @binding(0) var mySampler: sampler;
@group(1) @binding(1) var myCubeMap: texture_cube<f32>;

struct FragmentInput {
  @location(0) texCoord: vec3f,
};

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
  let color = textureSample(myCubeMap, mySampler, input.texCoord);
  return color;
}