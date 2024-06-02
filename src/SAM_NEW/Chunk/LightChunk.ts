import * as SAM from "@site/src/SAM_NEW";
import { Chunk } from "./_base";

export class LightChunk extends Chunk {
  precursorReactor: SAM.SingleDataReactor<SAM.BindingResourcePrecursor>;
  lightType: SAM.LightType;

  constructor(light: SAM.Light) {
    super();

    this.precursorReactor = this.getBindData(light);
    this.lightType = this.getLightType(light);
  }

  private getBindData(
    light: SAM.Light
  ): SAM.SingleDataReactor<SAM.BindingResourcePrecursor> {
    if (light instanceof SAM.AmbientLight) {
      return new SAM.SingleDataReactor(
        () => ({
          type: "uniform-typed-array",
          value: new Float32Array([
            ...light.color.toNumberArray(),
            light.intensity,
          ]),
        }),
        [
          {
            reactor: light,
            key: "intensity",
          },
          {
            reactor: light,
            key: "color",
          },
        ]
      );
    }

    if (light instanceof SAM.DirectionalLight) {
      return new SAM.SingleDataReactor(
        () => ({
          type: "uniform-typed-array",
          value: new Float32Array([
            ...light.color.toNumberArray(),
            light.intensity,
            ...light.direction.toNumberArray(),
          ]),
        }),
        [
          {
            reactor: light,
            key: "intensity",
          },
          {
            reactor: light,
            key: "color",
          },
          {
            reactor: light,
            key: "direction",
          },
        ]
      );
    }

    if (light instanceof SAM.PointLight) {
      return new SAM.SingleDataReactor(
        () => ({
          type: "uniform-typed-array",
          value: new Float32Array([
            ...light.color.toNumberArray(),
            light.intensity,
            ...light.position.toNumberArray(),
            light.decay,
          ]),
        }),
        [
          {
            reactor: light,
            key: "intensity",
          },
          {
            reactor: light,
            key: "color",
          },
          {
            reactor: light,
            key: "position",
          },
          {
            reactor: light,
            key: "decay",
          },
        ]
      );
    }

    throw new Error("Unsupported light type");
  }

  private getLightType(light: SAM.Light): SAM.LightType {
    if (light instanceof SAM.AmbientLight) {
      return "ambient";
    }

    if (light instanceof SAM.DirectionalLight) {
      return "directional";
    }

    if (light instanceof SAM.PointLight) {
      return "point";
    }

    throw new Error("Unsupported light type");
  }
}
