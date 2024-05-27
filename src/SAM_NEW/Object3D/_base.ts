import * as SAM from "@site/src/SAM_NEW";

export class Object3D extends SAM.Node {
  transformMatrix: SAM.Matrix4;

  constructor(label?: string) {
    super(label ?? "Object3D");

    this.transformMatrix = new SAM.Matrix4();
    this.transformMatrix.setIdentity();
  }

  getBindDataList(): SAM.BindData[] {
    return [
      {
        label: "transformMatrix",
        data: {
          type: "numberArray",
          value: this.transformMatrix.toRenderingData(),
        },
      },
    ];
  }

  setTranslate(vector: SAM.Vector3): void {
    this.transformMatrix.setTranslate(vector);
  }

  setScale(vector: SAM.Vector3): void {
    this.transformMatrix.setScale(vector);
  }

  setRotateX(angle: number): void {
    this.transformMatrix.setRotateX(angle);
  }

  setRotateY(angle: number): void {
    this.transformMatrix.setRotateY(angle);
  }

  setRotateZ(angle: number): void {
    this.transformMatrix.setRotateZ(angle);
  }
}

export class Mesh extends Object3D {
  geometry: SAM.Geometry;
  material: SAM.Material;

  constructor(geometry: SAM.Geometry, material: SAM.Material, label?: string) {
    super(label ?? "Mesh");
    this.geometry = geometry;
    this.material = material;
  }
}
