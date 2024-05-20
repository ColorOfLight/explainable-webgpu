import * as SAM from "@site/src/SAM";

export interface LightSet {
  ambients: SAM.AmbientLight[];
}
export class Scene {
  meshes: SAM.Mesh[];
  lightSet: LightSet;

  constructor() {
    this.meshes = [];
    this.lightSet = {
      ambients: [],
    };
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

    throw new Error("Unsupported object type");
  }
}
