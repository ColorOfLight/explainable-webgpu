struct FragmentInput {
  @location(0) texCoord: vec2f,
};

@group(2) @binding(0) var textureSampler: sampler;
@group(2) @binding(1) var texture: texture_2d<f32>;

@fragment
fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
  return textureSample(texture, textureSampler, input.texCoord);
}
