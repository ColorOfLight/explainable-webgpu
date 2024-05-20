const AMBIENT_LIGHTS_COUNT = 5;

struct AmbientLight {
  intensity: f32,
  color: vec4f,
};

struct AmbientLights {
  light: array<AmbientLight, 5>,
}

struct FragmentInput {
  @location(1) color: vec4f,
}

@group(2) @binding(0) var<uniform> materialColor: vec4f;
@group(3) @binding(0) var<uniform> ambientLights: AmbientLights;

@fragment
fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
  var baseColor = select(input.color, materialColor, materialColor.a >= 0);
  var outputColor = vec4f(0.0);

  for (var i = 0; i < AMBIENT_LIGHTS_COUNT; i = i + 1) {
    let light = ambientLights.light[i];
    outputColor = outputColor + baseColor * light.color * light.intensity;
  }

  return vec4f(outputColor.rgb, 1);
}
