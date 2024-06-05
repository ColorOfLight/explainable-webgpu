import * as SAM from "@site/src/SAM";

export interface LightShadowProperties {
  mapSize: [number, number];
  intensity: number;
  bias: number;
  normalBias: number;
  radius: number;
}

export class LightShadow extends SAM.Reactor implements LightShadowProperties {
  camera: SAM.Camera;
  mapSize: [number, number];
  intensity: number;
  bias: number;
  normalBias: number;
  radius: number;

  constructor(camera, mapSize, intensity, bias, normalBias, radius) {
    super();

    this.camera = camera;
    this.mapSize = mapSize;
    this.intensity = intensity;
    this.bias = bias;
    this.normalBias = normalBias;
    this.radius = radius;
  }
}
