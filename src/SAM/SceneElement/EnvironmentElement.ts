import * as SAM from "@site/src/SAM";
import { SceneElement } from "./_base";
import { createBindGroup } from "./_utils";

const AMBIENT_LIGHT_SIZE = 3 + 1; /* color(3) + intensity(1) */
const DIRECTIONAL_LIGHT_SIZE =
  3 +
  1 +
  3 +
  4 +
  1; /* color(3) + intensity(1) + direction(3) + shadowOptions(4) + pad(1) */
const POINT_LIGHT_SIZE =
  3 + 1 + 3 + 1; /* color(3) + intensity(1) + position(3) + decay(1) */
const DIRECTIONAL_SHADOW_CAMERA_SIZE =
  4 * 4 +
  4 * 4 +
  3 +
  1; /* viewMatrix(16) + projectionMatrix(16) + eye(3) + pad(1) */

export class EnvironmentElement extends SceneElement {
  ambientLightsResourceReactor: SAM.NumbersResourceReactor;
  directionalLightsResourceReactor: SAM.NumbersResourceReactor;
  pointLightsResourceReactor: SAM.NumbersResourceReactor;
  directionalShadowCamerasResourceReactor: SAM.NumbersResourceReactor;
  bindGroupLayoutReactor: SAM.SingleDataReactor<GPUBindGroupLayout>;
  bindGroupReactor: SAM.SingleDataReactor<GPUBindGroup>;

  // TODO: Need to be more general
  directionalShadowDepthReactor: SAM.DepthTextureResourceReactor;
  directionalSamplerReactor: SAM.SamplerResourceReactor;

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

    this.directionalShadowCamerasResourceReactor = this.generateResourceReactor(
      device,
      Array(
        DIRECTIONAL_SHADOW_CAMERA_SIZE * SAM.MAX_DIRECTIONAL_LIGHTS_DEFAULT
      ).fill(0)
    );

    this.directionalShadowDepthReactor = new SAM.DepthTextureResourceReactor(
      device,
      () => ({
        type: "depth-texture",
        value: {
          width: 1024,
          height: 1024,
        },
      })
    );

    this.directionalSamplerReactor = new SAM.SamplerResourceReactor(
      device,
      () => ({
        type: "sampler",
        value: {
          compare: "less",
        },
      })
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
          {
            // Directional light shadow cameras
            binding: 3,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
              type: "uniform" as const,
            },
          },
          {
            // Directional shadow depth texture
            binding: 4,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
              sampleType: "depth" as const,
            },
          },
          {
            // Directional shadow sampler
            binding: 5,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {
              type: "comparison" as const,
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
            this.directionalShadowCamerasResourceReactor,
            this.directionalShadowDepthReactor,
            this.directionalSamplerReactor,
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
        {
          reactor: this.directionalShadowCamerasResourceReactor,
          key: "resource",
        },
      ]
    );
  }

  updateLights(
    lightChunks: SAM.LightChunk[],
    shadowCameraChunkMap: Map<Symbol, SAM.CameraChunk>
  ) {
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

    // Shadow Cameras

    const shadowCameraChunks = Array.from(shadowCameraChunkMap.values());
    if (shadowCameraChunks.length > 0) {
      this.updateEachShadowCameraChunks(
        this.device,
        shadowCameraChunks,
        this.directionalShadowCamerasResourceReactor,
        DIRECTIONAL_SHADOW_CAMERA_SIZE,
        SAM.MAX_DIRECTIONAL_LIGHTS_DEFAULT
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

  private updateEachShadowCameraChunks(
    device: GPUDevice,
    shadowCameraChunks: SAM.CameraChunk[],
    resourceReactor: SAM.NumbersResourceReactor,
    bufferSize: number,
    maxLightCount: number
  ) {
    resourceReactor.resetResource(
      device,
      () => {
        const newData = new Float32Array(maxLightCount * bufferSize);
        shadowCameraChunks.forEach((chunk, chunkIndex) => {
          const chunkOffset = chunkIndex * bufferSize;
          let innerOffset = 0;

          chunk.precursorReactorList.forEach((precursorReactor) => {
            if (precursorReactor.data.type !== "uniform-typed-array") {
              throw new Error("Invalid shadow camera precursor data type");
            }

            const offset = chunkOffset + innerOffset;
            newData.set(precursorReactor.data.value, offset);
            innerOffset += precursorReactor.data.value.length;
          });
        });

        return {
          type: "uniform-typed-array",
          value: newData,
        };
      },
      shadowCameraChunks.reduce((prevKeySets, chunk) => {
        const reactorKeySets = chunk.precursorReactorList.map(
          (precursorReactor) => ({
            reactor: precursorReactor,
            key: "data",
          })
        );

        return [...prevKeySets, ...reactorKeySets];
      }, [])
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
