import * as SAM from "@site/src/SAM_NEW";
import { Chunk } from "./_base";

export class LightChunk extends Chunk {
  bufferDataReactor: SAM.SingleDataReactor<SAM.BufferData>;
  lightType: SAM.LightType;

  constructor(light: SAM.Light) {
    super();

    this.bufferDataReactor = this.getBindData(light);
    this.lightType = this.getLightType(light);
  }

  private getBindData(light: SAM.Light): SAM.SingleDataReactor<SAM.BufferData> {
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

    throw new Error("Unsupported light type");
  }

  private getLightType(light: SAM.Light): SAM.LightType {
    if (light instanceof SAM.AmbientLight) {
      return "ambient";
    }

    throw new Error("Unsupported light type");
  }
}
