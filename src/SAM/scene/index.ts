import * as SAM from "@site/src/SAM";

export interface LightSet {
  ambients: SAM.AmbientLight[];
  directionals: SAM.DirectionalLight[];
  points: SAM.PointLight[];
}

export interface SceneEnvironment {
  cubeMapTexture: SAM.CubeMapTexture;
  vertexPositionBufferData: Float32Array;
  indexBufferData: Uint16Array;
  indexCount: number;
  vertexByteSize: number;
}

export class Scene {
  meshes: SAM.Mesh[];
  lightSet: LightSet;
  environment: SceneEnvironment | undefined;

  constructor() {
    this.meshes = [];
    this.lightSet = {
      ambients: [],
      directionals: [],
      points: [],
    };
    this.environment = undefined;
  }

  add(object: unknown) {
    if (object instanceof SAM.Mesh) {
      this.meshes.push(object);
      return;
    }

    if (object instanceof SAM.AmbientLight) {
      if (this.lightSet.ambients.length >= SAM.MAX_AMBIENT_LIGHTS_DEFAULT) {
        throw new Error(
          `You can use up to ${SAM.MAX_AMBIENT_LIGHTS_DEFAULT} ambient lights in a scene.`
        );
      }

      this.lightSet.ambients.push(object);
      return;
    }

    if (object instanceof SAM.DirectionalLight) {
      if (
        this.lightSet.directionals.length >= SAM.MAX_DIRECTIONAL_LIGHTS_DEFAULT
      ) {
        throw new Error(
          `You can use up to ${SAM.MAX_DIRECTIONAL_LIGHTS_DEFAULT} directional lights in a scene.`
        );
      }

      this.lightSet.directionals.push(object);
      return;
    }

    if (object instanceof SAM.PointLight) {
      if (this.lightSet.points.length >= SAM.MAX_POINT_LIGHTS_DEFAULT) {
        throw new Error(
          `You can use up to ${SAM.MAX_POINT_LIGHTS_DEFAULT} point lights in a scene.`
        );
      }

      this.lightSet.points.push(object);
      return;
    }

    throw new Error("Unsupported object type");
  }

  setEnvironment(cubeMapTexture: SAM.CubeMapTexture): void {
    const cubeGeometry = new SAM.CubeGeometry(2, 2, 2);

    this.environment = {
      cubeMapTexture,
      vertexPositionBufferData: cubeGeometry.getVertexPositionBufferData(),
      indexBufferData: cubeGeometry.getIndexBufferData(),
      vertexByteSize: 3 * 4,
      indexCount: cubeGeometry.getIndexCount(),
    };
  }

  getEnvironment(): SceneEnvironment | undefined {
    return this.environment;
  }
}
