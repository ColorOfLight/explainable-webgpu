import { Geometry, GeometryOptions } from "./_base";
import { generatePlaneIndexes } from "./_utils";

export interface PlaneGeometryOptions extends GeometryOptions {
  widthSegments?: number;
  heightSegments?: number;
}

export class PlaneGeometry extends Geometry {
  constructor(width: number, height: number, options?: PlaneGeometryOptions) {
    super(options);

    const widthSegments = options?.widthSegments ?? 1;
    const heightSegments = options?.heightSegments ?? 1;
    const vertexCount = (widthSegments + 1) * (heightSegments + 1);

    this.vertexes = new Array(vertexCount);

    for (let j = 0; j < heightSegments + 1; j++) {
      for (let i = 0; i < widthSegments + 1; i++) {
        const x = -width / 2 + (i * width) / widthSegments;
        const y = -height / 2 + (j * height) / heightSegments;

        this.vertexes[j * (widthSegments + 1) + i] = {
          position: [x, y, 0],
          normal: [0, 0, 1],
          texCoord: [i / widthSegments, j / heightSegments],
        };
      }
    }

    this.indexes = generatePlaneIndexes(widthSegments, heightSegments);
  }
}
