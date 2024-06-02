import * as SAM from "@site/src/SAM_NEW";
import { SceneElement } from "./_base";
import { createBindGroup } from "./_utils";

const AMBIENT_LIGHT_SIZE = 3 + 1; /* color(3) + intensity(1) */
const DIRECTIONAL_LIGHT_SIZE =
  3 + 1 + 3 + 1; /* color(3) + intensity(1) + direction(3) + pad(1) */
const POINT_LIGHT_SIZE =
  3 + 1 + 3 + 1; /* color(3) + intensity(1) + position(3) + decay(1) */

export class EnvironmentElement extends SceneElement {
  ambientLightsResourceReactor: SAM.NumbersResourceReactor;
  directionalLightsResourceReactor: SAM.NumbersResourceReactor;
  pointLightsResourceReactor: SAM.NumbersResourceReactor;
  bindGroupLayoutReactor: SAM.SingleDataReactor<GPUBindGroupLayout>;
  bindGroupReactor: SAM.SingleDataReactor<GPUBindGroup>;

  constructor(device: GPUDevice) {
    super(device);

    this.ambientLightsResourceReactor = this.generateResourceReactor(
      device,
      Array(AMBIENT_LIGHT_SIZE * SAM.MAX_AMBIENT_LIGHTS_DEFAULT).fill(0)
    );

    this.directionalLightsResourceReactor = this.generateResourceReactor(
      device,
      Array(DIRECTIONAL_LIGHT_SIZE * SAM.MAX_DIRECTIONAL_LIGHTS_DEFAULT).fill(0)
    );

    this.pointLightsResourceReactor = this.generateResourceReactor(
      device,
      Array(POINT_LIGHT_SIZE * SAM.MAX_POINT_LIGHTS_DEFAULT).fill(0)
    );

    this.bindGroupLayoutReactor = new SAM.SingleDataReactor(() => {
      return this.device.createBindGroupLayout({
        entries: [
          {
            // Ambient lights
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
              type: "uniform" as const,
            },
          },
          {
            // Directional lights
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
              type: "uniform" as const,
            },
          },
          {
            // Point lights
            binding: 2,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
              type: "uniform" as const,
            },
          },
        ],
      });
    });

    this.bindGroupReactor = new SAM.SingleDataReactor(
      () =>
        createBindGroup(
          device,
          [
            this.ambientLightsResourceReactor,
            this.directionalLightsResourceReactor,
            this.pointLightsResourceReactor,
          ],
          this.bindGroupLayoutReactor
        ),
      [
        {
          reactor: this.bindGroupLayoutReactor,
          key: "data",
        },
        {
          reactor: this.ambientLightsResourceReactor,
          key: "resource",
        },
        {
          reactor: this.directionalLightsResourceReactor,
          key: "resource",
        },
        {
          reactor: this.pointLightsResourceReactor,
          key: "resource",
        },
      ]
    );
  }

  updateLights(lightChunks: SAM.LightChunk[]) {
    const ambientLightChunks = lightChunks.filter(
      (chunk) => chunk.lightType === "ambient"
    );
    const directionalLightChunks = lightChunks.filter(
      (chunk) => chunk.lightType === "directional"
    );
    const pointLightChunks = lightChunks.filter(
      (chunk) => chunk.lightType === "point"
    );

    if (ambientLightChunks.length > SAM.MAX_AMBIENT_LIGHTS_DEFAULT) {
      throw new Error("Too many ambient lights");
    }

    if (directionalLightChunks.length > SAM.MAX_DIRECTIONAL_LIGHTS_DEFAULT) {
      throw new Error("Too many directional lights");
    }

    if (pointLightChunks.length > SAM.MAX_POINT_LIGHTS_DEFAULT) {
      throw new Error("Too many point lights");
    }

    if (ambientLightChunks.length > 0) {
      this.updateEachLightChunks(
        this.device,
        ambientLightChunks,
        this.ambientLightsResourceReactor,
        AMBIENT_LIGHT_SIZE,
        SAM.MAX_AMBIENT_LIGHTS_DEFAULT
      );
    }

    if (directionalLightChunks.length > 0) {
      this.updateEachLightChunks(
        this.device,
        directionalLightChunks,
        this.directionalLightsResourceReactor,
        DIRECTIONAL_LIGHT_SIZE,
        SAM.MAX_DIRECTIONAL_LIGHTS_DEFAULT
      );
    }

    if (pointLightChunks.length > 0) {
      this.updateEachLightChunks(
        this.device,
        pointLightChunks,
        this.pointLightsResourceReactor,
        POINT_LIGHT_SIZE,
        SAM.MAX_POINT_LIGHTS_DEFAULT
      );
    }
  }

  private updateEachLightChunks(
    device: GPUDevice,
    lightChunks: SAM.LightChunk[],
    resourceReactor: SAM.NumbersResourceReactor,
    bufferSize: number,
    maxLightCount: number
  ) {
    resourceReactor.resetResource(
      device,
      () => {
        const newData = new Float32Array(maxLightCount * bufferSize);
        lightChunks.forEach((chunk, index) => {
          if (chunk.precursorReactor.data.type !== "uniform-typed-array") {
            throw new Error("Invalid light precursor data type");
          }

          const offset = index * bufferSize;
          newData.set(chunk.precursorReactor.data.value, offset);
        });

        return {
          type: "uniform-typed-array",
          value: newData,
        };
      },
      lightChunks.map((chunk) => ({
        reactor: chunk.precursorReactor,
        key: "data",
      }))
    );
  }

  private generateResourceReactor(
    device: GPUDevice,
    data: number[]
  ): SAM.NumbersResourceReactor {
    return new SAM.NumbersResourceReactor(
      device,
      () => ({
        type: "uniform-typed-array",
        value: new Float32Array(data),
      }),
      []
    );
  }
}
