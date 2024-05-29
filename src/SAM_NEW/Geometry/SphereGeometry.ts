import * as SAM from "@site/src/SAM_NEW";
import { Geometry, GeometryOptions } from "./_base";

export interface SphereGeometryOptions extends GeometryOptions {
  widthSegments?: number;
  heightSegments?: number;
}

export class SphereGeometry extends Geometry {
  constructor(radius: number, options?: SphereGeometryOptions) {
    const widthSegments = options?.widthSegments ?? 32;
    const heightSegments = options?.heightSegments ?? 16;

    if (widthSegments < 3) {
      throw new Error("widthSegments must be greater than 3");
    }

    if (heightSegments < 2) {
      throw new Error("heightSegments must be greater than 2");
    }

    super(options);

    const sphericalCoord = new SAM.SphericalCoordinate({ radius });
    const polarStep = Math.PI / heightSegments;
    const azimuthStep = (Math.PI * 2) / widthSegments;

    // Last vertexes for each pole are not to use but exist for the better code readability.
    const vertexes: SAM.Vertex[] = Array(
      (widthSegments + 1) * (heightSegments + 1)
    );
    for (let j = 0; j < heightSegments + 1; j++) {
      const uOffset = j === 0 || j === heightSegments ? 0.5 : 0;
      const polar = polarStep * j + Math.PI / 2;
      sphericalCoord.setInclination(polar);

      for (let i = 0; i < widthSegments + 1; i++) {
        const azimuth = azimuthStep * i;
        sphericalCoord.setAzimuth(azimuth);

        const positionVector = sphericalCoord.getDestination();

        const vertex = {
          position: positionVector.toNumberArray(),
          normal: positionVector.normalize().toNumberArray(),
          texCoord: [(i + uOffset) / widthSegments, j / heightSegments] as [
            number,
            number,
          ],
        };

        vertexes[j * (widthSegments + 1) + i] = vertex;
      }
    }

    const indexes: number[] = Array(
      widthSegments * (heightSegments - 2) * 6 + widthSegments * 2 * 3
    );

    let index = 0;
    for (let j = 0; j < heightSegments; j++) {
      if (j === 0) {
        for (let i = 0; i < widthSegments; i++) {
          const top = i;
          const bottomLeft = (j + 1) * (widthSegments + 1) + i;
          const bottomRight = (j + 1) * (widthSegments + 1) + i + 1;

          indexes[index++] = top;
          indexes[index++] = bottomRight;
          indexes[index++] = bottomLeft;
        }
      } else if (j === heightSegments - 1) {
        for (let i = 0; i < widthSegments; i++) {
          const bottom = (j + 1) * (widthSegments + 1) + i;
          const topLeft = j * (widthSegments + 1) + i;
          const topRight = j * (widthSegments + 1) + i + 1;

          indexes[index++] = bottom;
          indexes[index++] = topLeft;
          indexes[index++] = topRight;
        }
      } else {
        for (let i = 0; i < widthSegments; i++) {
          const topLeft = j * (widthSegments + 1) + i;
          const topRight = j * (widthSegments + 1) + i + 1;
          const bottomLeft = (j + 1) * (widthSegments + 1) + i;
          const bottomRight = (j + 1) * (widthSegments + 1) + i + 1;

          indexes[index++] = topLeft;
          indexes[index++] = topRight;
          indexes[index++] = bottomLeft;

          indexes[index++] = bottomLeft;
          indexes[index++] = topRight;
          indexes[index++] = bottomRight;
        }
      }
    }

    this.vertexes = vertexes;
    this.indexes = indexes;
  }
}
