import * as SAM from "@site/src/SAM_NEW";
import { SceneElement } from "./_base";
import { createBindGroupLayout, createBindGroup } from "./_utils";

export interface EnvironmentElementUpdateOptions {
  lightChunks: SAM.LightChunk[];
}

export class EnvironmentElement extends SceneElement {
  ambientLightsBufferReactor: SAM.GPUBufferReactor;
  directionalLightsBufferReactor: SAM.GPUBufferReactor;
  pointLightsBufferReactor: SAM.GPUBufferReactor;
  bindGroupLayoutReactor: SAM.SingleDataReactor<GPUBindGroupLayout>;
  bindGroupReactor: SAM.SingleDataReactor<GPUBindGroup>;

  constructor(device: GPUDevice) {
    super(device);

    this.ambientLightsBufferReactor = this.generateBufferReactor(
      device,
      /* color(3) + intensity(1) */
      Array((3 + 1) * SAM.MAX_AMBIENT_LIGHTS_DEFAULT).fill(0)
    );

    this.directionalLightsBufferReactor = this.generateBufferReactor(
      device,
      /* color(3) + intensity(1) + direction(3) + pad(1) */
      Array((3 + 1 + 3 + 1) * SAM.MAX_DIRECTIONAL_LIGHTS_DEFAULT).fill(0)
    );

    this.pointLightsBufferReactor = this.generateBufferReactor(
      device,
      /* color(3) + intensity(1) + position(3) + decay(1) */
      Array((3 + 1 + 3 + 1) * SAM.MAX_POINT_LIGHTS_DEFAULT).fill(0)
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
            this.ambientLightsBufferReactor,
            this.directionalLightsBufferReactor,
            this.pointLightsBufferReactor,
          ],
          this.bindGroupLayoutReactor
        ),
      [
        {
          reactor: this.bindGroupLayoutReactor,
          key: "data",
        },
        {
          reactor: this.ambientLightsBufferReactor,
          key: "buffer",
        },
        {
          reactor: this.directionalLightsBufferReactor,
          key: "buffer",
        },
        {
          reactor: this.pointLightsBufferReactor,
          key: "buffer",
        },
      ]
    );
  }

  update(options: EnvironmentElementUpdateOptions) {
    const ambientLightChunks = options.lightChunks.filter(
      (chunk) => chunk.lightType === "ambient"
    );
    // const directionalLightChunks = options.lightChunks.filter(
    //   (chunk) => chunk.lightType === "directional"
    // );
    // const pointLightChunks = options.lightChunks.filter(
    //   (chunk) => chunk.lightType === "point"
    // );

    if (ambientLightChunks.length > SAM.MAX_AMBIENT_LIGHTS_DEFAULT) {
      throw new Error("Too many ambient lights");
    }

    if (ambientLightChunks.length > 0) {
      this.ambientLightsBufferReactor.resetBuffer(
        this.device,
        () => {
          const newData = new Float32Array(
            SAM.MAX_AMBIENT_LIGHTS_DEFAULT * (3 + 1)
          );
          ambientLightChunks.forEach((chunk, index) => {
            const offset = index * (3 + 1);
            newData.set(chunk.bufferDataReactor.data.value, offset);
          });

          return {
            type: "uniform-typed-array",
            value: newData,
          };
        },
        ambientLightChunks.map((chunk) => ({
          reactor: chunk.bufferDataReactor,
          key: "data",
        }))
      );
    }
  }

  private generateBufferReactor(
    device: GPUDevice,
    data: number[]
  ): SAM.GPUBufferReactor {
    return new SAM.GPUBufferReactor(
      device,
      () => ({
        type: "uniform-typed-array",
        value: new Float32Array(data),
      }),
      []
    );
  }
}
