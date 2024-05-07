import { Mesh } from "../mesh";

export class Scene {
  meshes: Mesh[];

  constructor() {
    this.meshes = [];
  }

  add(mesh: Mesh) {
    this.meshes.push(mesh);
  }
}
