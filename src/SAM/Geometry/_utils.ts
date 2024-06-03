import * as SAM from "@site/src/SAM";

export function generateCubePlaneVertexes(
  right: SAM.Vector3,
  up: SAM.Vector3,
  rightSize: number,
  upSize: number,
  frontSize: number,
  widthSegments: number,
  heightSegments: number,
  color?: SAM.Color
): SAM.Vertex[] {
  const vertexCount = (widthSegments + 1) * (heightSegments + 1);
  const vertexes = new Array(vertexCount);
  const front = right.cross(up);

  for (let j = 0; j < heightSegments + 1; j++) {
    for (let i = 0; i < widthSegments + 1; i++) {
      const xPos = rightSize * (i / widthSegments - 1 / 2);
      const yPos = upSize * (j / heightSegments - 1 / 2);

      const positionVector: SAM.Vector3 = right
        .multiplyScalar(xPos)
        .add(up.multiplyScalar(yPos))
        .add(front.multiplyScalar(frontSize / 2));

      vertexes[j * (widthSegments + 1) + i] = {
        position: positionVector.toNumberArray(),
        normal: front.toNumberArray(),
        texCoord: [i / widthSegments, j / heightSegments],
        color,
      };
    }
  }

  return vertexes;
}

export function generatePlaneIndexes(
  rightSegments: number,
  upSegments: number,
  offset: number = 0
): number[] {
  const indexCount = rightSegments * upSegments * 6;
  const indexes = new Array(indexCount);

  let index = 0;
  for (let j = 0; j < upSegments; j++) {
    for (let i = 0; i < rightSegments; i++) {
      const leftBottom = j * (rightSegments + 1) + i;
      const rightBottom = j * (rightSegments + 1) + i + 1;
      const leftTop = (j + 1) * (rightSegments + 1) + i;
      const rightTop = (j + 1) * (rightSegments + 1) + i + 1;

      indexes[index++] = leftBottom + offset;
      indexes[index++] = rightBottom + offset;
      indexes[index++] = leftTop + offset;

      indexes[index++] = rightBottom + offset;
      indexes[index++] = rightTop + offset;
      indexes[index++] = leftTop + offset;
    }
  }

  return indexes;
}
