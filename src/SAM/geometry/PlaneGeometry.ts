import * as SAM from "@site/src/SAM";
import { Geometry } from "./_base";

export interface PlaneGeometryOptions {
  widthSegments?: number;
  heightSegments?: number;
}

export class PlaneGeometry extends Geometry {
  constructor(width: number, height: number, options?: PlaneGeometryOptions) {
    super();

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
        };
      }
    }

    this.indexes = new Array(widthSegments * heightSegments * 6);

    let index = 0;
    for (let j = 0; j < heightSegments; j++) {
      for (let i = 0; i < widthSegments; i++) {
        const leftBottom = j * (widthSegments + 1) + i;
        const rightBottom = j * (widthSegments + 1) + i + 1;
        const leftTop = (j + 1) * (widthSegments + 1) + i;
        const rightTop = (j + 1) * (widthSegments + 1) + i + 1;

        this.indexes[index++] = leftBottom;
        this.indexes[index++] = rightBottom;
        this.indexes[index++] = leftTop;

        this.indexes[index++] = rightBottom;
        this.indexes[index++] = rightTop;
        this.indexes[index++] = leftTop;
      }
    }
  }
}
