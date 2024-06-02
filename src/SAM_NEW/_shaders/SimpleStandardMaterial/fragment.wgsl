const AMBIENT_LIGHTS_COUNT = 3;

struct AmbientLight {
  color: vec3f,
  intensity: f32,
};

struct AmbientLights {
  light: array<AmbientLight, 3>,
}

struct FragmentInput {
  @location(3) color: vec3f,
}

@group(1) @binding(0) var<uniform> materialColor: vec3f;
@group(3) @binding(0) var<uniform> ambientLights: AmbientLights;

@fragment
fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
  var baseColor = select(input.color, materialColor, materialColor.r >= 0);
  var outputColor = vec3f(0.0);

  for (var i = 0; i < AMBIENT_LIGHTS_COUNT; i = i + 1) {
    let light = ambientLights.light[i];
    outputColor = outputColor + baseColor * light.color * light.intensity;
  }

  return vec4f(outputColor, 1);
}
