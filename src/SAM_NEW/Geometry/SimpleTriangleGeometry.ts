import * as SAM from "@site/src/SAM_NEW";
import { Geometry, GeometryOptions } from "./_base";

export interface SimpleTriangleGeometryOptions extends GeometryOptions {}

export class SimpleTriangleGeometry extends Geometry {
  constructor(size: number, options?: SimpleTriangleGeometryOptions) {
    super(options);

    this.vertexes = [
      {
        position: [size, size, 0],
        color: new SAM.Color(1, 0, 0),
        normal: [0, 0, 1],
        texCoord: [1, 1],
      },
      {
        position: [-size, -size, 0],
        color: new SAM.Color(0, 1, 0),
        normal: [0, 0, 1],
        texCoord: [0, 0],
      },
      {
        position: [size, -size, 0],
        color: new SAM.Color(0, 0, 1),
        normal: [0, 0, 1],
        texCoord: [1, 0],
      },
    ];

    this.indexes = SAM.generateNumberArray(this.vertexes.length);
  }

  testVertexes(size: number = 3) {
    this.vertexes = [
      {
        position: [size, size, 0],
        color: new SAM.Color(1, 0, 0),
        normal: [0, 0, 1],
        texCoord: [1, 1],
      },
      {
        position: [-size, -size, 0],
        color: new SAM.Color(0, 1, 0),
        normal: [0, 0, 1],
        texCoord: [0, 0],
      },
    ];
  }
}
