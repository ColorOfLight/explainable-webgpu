import * as SAM from "@site/src/SAM";
import { Geometry } from "./_base";

export class SimpleTriangleGeometry extends Geometry {
  constructor(size: number) {
    super();

    this.vertexes = [
      { position: [size, size, 0], color: new SAM.Color([1, 0, 0, 1]) },
      { position: [-size, -size, 0], color: new SAM.Color([0, 1, 0, 1]) },
      { position: [size, -size, 0], color: new SAM.Color([0, 0, 1, 1]) },
    ];

    this.indexes = SAM.generateNumberArray(this.vertexes.length);
  }
}
