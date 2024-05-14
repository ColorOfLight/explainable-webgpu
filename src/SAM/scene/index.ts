import * as SAM from "@site/src/SAM";

export class Scene {
  meshes: SAM.Mesh[];

  constructor() {
    this.meshes = [];
  }

  add(mesh: SAM.Mesh) {
    this.meshes.push(mesh);
  }
}
