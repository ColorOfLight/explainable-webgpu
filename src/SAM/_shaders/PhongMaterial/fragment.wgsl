const AMBIENT_LIGHTS_COUNT = 3;
const DIRECTIONAL_LIGHTS_COUNT = 3;
const POINT_LIGHTS_COUNT = 3;

struct AmbientLight {
  color: vec3f,
  intensity: f32,
};

struct DirectionalLight {
  color: vec3f,
  intensity: f32,
  direction: vec3f,
};

struct PointLight {
  color: vec3f,
  intensity: f32,
  position: vec3f,
  decay: f32,
};

struct AmbientLights {
  light: array<AmbientLight, AMBIENT_LIGHTS_COUNT>,
}

struct DirectionalLights {
  light: array<DirectionalLight, DIRECTIONAL_LIGHTS_COUNT>,
}

struct PointLights {
  light: array<PointLight, POINT_LIGHTS_COUNT>,
}

struct PhongMaterial {
  color: vec3f,
  diffuse: f32,
  specular: f32,
  alpha: f32,
}

struct FragmentInput {
  @location(0) globalPosition: vec3f,
  @location(1) normal: vec3f,
  @location(3) color: vec3f,
}

fn getColorFromLight(
  lightColor: vec3f,
  lightDirection: vec3f,
  baseColor: vec3f,
  viewVector: vec3f,
  normal: vec3f,
  diffuse: f32,
  specular: f32,
  alpha: f32
  ) -> vec3f {
    let lightVector = normalize(-lightDirection);
    let reflection = reflect(lightVector, normal);

    let diffuseColor = diffuse * max(0.0, dot(lightVector, normal)) * baseColor * lightColor;
    let specularColor = specular * pow(max(0.0, dot(reflection, viewVector)), alpha) * lightColor;

    return diffuseColor + specularColor;
}

@group(1) @binding(0) var<uniform> phong: PhongMaterial;
@group(2) @binding(2) var<uniform> eyePosition: vec3f;
@group(3) @binding(0) var<uniform> ambientLights: AmbientLights;
@group(3) @binding(1) var<uniform> directionalLights: DirectionalLights;
@group(3) @binding(2) var<uniform> pointLights: PointLights;

@fragment
fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
  let materialColor = phong.color;
  let diffuse = phong.diffuse;
  let specular = phong.specular;
  let alpha = phong.alpha;

  let position = input.globalPosition;

  var baseColor = select(input.color, materialColor, materialColor.r >= 0);
  var outputColor = vec3f(0);

  // Normalize the interpolated normal
  let normal = normalize(input.normal);
  let viewVector = normalize(position - eyePosition);

  for (var i = 0; i < AMBIENT_LIGHTS_COUNT; i = i + 1) {
    let light = ambientLights.light[i];
    outputColor = outputColor + baseColor * light.color * light.intensity * diffuse;
  }

  for (var i = 0; i < DIRECTIONAL_LIGHTS_COUNT; i = i + 1) {
    let light = directionalLights.light[i];
    let colorFromLight = getColorFromLight(light.color, light.direction, baseColor, viewVector, normal, diffuse, specular, alpha);

    outputColor = outputColor + light.intensity * colorFromLight;
  }

  for (var i = 0; i < POINT_LIGHTS_COUNT; i = i + 1) {
    let light = pointLights.light[i];
    let lightDirection = position - light.position;
    let attenuation = 1 / (1 + light.decay * pow(length(lightDirection), 2)); 

    let colorFromLight = getColorFromLight(light.color, lightDirection, baseColor, viewVector, normal, diffuse, specular, alpha);

    outputColor = outputColor + light.intensity * attenuation * colorFromLight;
  }

  return vec4f(outputColor, 1);
}
