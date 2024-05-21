const AMBIENT_LIGHTS_COUNT = 5;
const DIRECTIONAL_LIGHTS_COUNT = 5;

struct AmbientLight {
  intensity: f32,
  color: vec3f,
};

struct DirectionalLight {
  intensity: f32,
  color: vec3f,
  direction: vec3f,
};

struct AmbientLights {
  light: array<AmbientLight, 5>,
}

struct DirectionalLights {
  light: array<DirectionalLight, 5>,
}

struct FragmentInput {
  @location(1) color: vec3f,
  @location(2) normal: vec3f,
}

@group(0) @binding(2) var<uniform> viewVector: vec3f;
@group(2) @binding(0) var<uniform> materialColor: vec3f;
@group(2) @binding(1) var<uniform> diffuse: f32;
@group(2) @binding(2) var<uniform> specular: f32;
@group(2) @binding(3) var<uniform> alpha: f32;
@group(3) @binding(0) var<uniform> ambientLights: AmbientLights;
@group(3) @binding(1) var<uniform> directionalLights: DirectionalLights;

@fragment
fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
  var baseColor = select(input.color, materialColor, materialColor.r >= 0);
  var outputColor = vec3f(0.0);

  // Normalize the interpolated normal
  let normal = normalize(input.normal);

  for (var i = 0; i < AMBIENT_LIGHTS_COUNT; i = i + 1) {
    let light = ambientLights.light[i];
    outputColor = outputColor + baseColor * light.color * light.intensity * diffuse;
  }

  for (var i = 0; i < DIRECTIONAL_LIGHTS_COUNT; i = i + 1) {
    let light = directionalLights.light[i];

    let lightVector = normalize(-light.direction);
    let reflection = reflect(lightVector, normal);

    let diffuseColor = diffuse * max(0.0, dot(lightVector, normal)) * baseColor;
    let specularColor = specular * pow(max(0.0, dot(reflection, viewVector)), alpha) * light.color;

    outputColor = outputColor + light.intensity * (diffuseColor + specularColor);
  }

  return vec4f(outputColor, 1);
}
