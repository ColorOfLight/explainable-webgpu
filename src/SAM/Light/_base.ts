import * as SAM from "@site/src/SAM";

export interface LightOptions {
  label?: string;
}

export class Light extends SAM.Node {
  color: SAM.Color;
  intensity: number;

  constructor(color: SAM.Color, intensity: number, options?: LightOptions) {
    super(options?.label ?? "Light");

    this.color = color;
    this.intensity = intensity;
  }
}

export interface LightWithShadowOptions extends LightOptions {
  shadow?: Partial<SAM.LightShadowProperties>;
}

export class LightWithShadow extends Light {
  shadow: SAM.LightShadow;

  constructor(
    camera: SAM.Camera,
    color: SAM.Color,
    intensity: number,
    options?: LightWithShadowOptions
  ) {
    super(color, intensity, options);

    const shadowOptions = options?.shadow ?? {};

    this.shadow = new SAM.LightShadow(
      camera,
      shadowOptions.mapSize ?? [1024, 1024],
      shadowOptions.intensity ?? 0.5,
      shadowOptions.bias ?? 0.0001,
      shadowOptions.bias ?? 0.0001,
      shadowOptions.radius ?? 0.5
    );
  }
}
