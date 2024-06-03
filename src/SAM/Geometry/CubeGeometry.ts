import * as SAM from "@site/src/SAM";
import { Geometry, GeometryOptions } from "./_base";
import { generateCubePlaneVertexes, generatePlaneIndexes } from "./_utils";

export interface CubeGeometryOptions extends GeometryOptions {
  colors?: {
    front: SAM.Color;
    back: SAM.Color;
    top: SAM.Color;
    bottom: SAM.Color;
    left: SAM.Color;
    right: SAM.Color;
  };
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
}

export class CubeGeometry extends Geometry {
  constructor(
    width: number,
    height: number,
    depth: number,
    options?: CubeGeometryOptions
  ) {
    super(options);

    const defaultColor = new SAM.Color(1, 1, 1);

    const frontColor = options?.colors?.front || defaultColor;
    const backColor = options?.colors?.back || defaultColor;
    const topColor = options?.colors?.top || defaultColor;
    const bottomColor = options?.colors?.bottom || defaultColor;
    const leftColor = options?.colors?.left || defaultColor;
    const rightColor = options?.colors?.right || defaultColor;

    const widthSegments = options?.widthSegments ?? 1;
    const heightSegments = options?.heightSegments ?? 1;
    const depthSegments = options?.depthSegments ?? 1;

    const frontVertexes = generateCubePlaneVertexes(
      new SAM.Vector3(1, 0, 0),
      new SAM.Vector3(0, 1, 0),
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      frontColor
    );
    const backVertexes = generateCubePlaneVertexes(
      new SAM.Vector3(-1, 0, 0),
      new SAM.Vector3(0, 1, 0),
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      backColor
    );
    const topVertexes = generateCubePlaneVertexes(
      new SAM.Vector3(1, 0, 0),
      new SAM.Vector3(0, 0, -1),
      width,
      depth,
      height,
      widthSegments,
      depthSegments,
      topColor
    );
    const bottomVertexes = generateCubePlaneVertexes(
      new SAM.Vector3(1, 0, 0),
      new SAM.Vector3(0, 0, 1),
      width,
      depth,
      height,
      widthSegments,
      depthSegments,
      bottomColor
    );
    const leftVertexes = generateCubePlaneVertexes(
      new SAM.Vector3(0, 0, 1),
      new SAM.Vector3(0, 1, 0),
      depth,
      height,
      width,
      depthSegments,
      heightSegments,
      leftColor
    );
    const rightVertexes = generateCubePlaneVertexes(
      new SAM.Vector3(0, 0, -1),
      new SAM.Vector3(0, 1, 0),
      depth,
      height,
      width,
      depthSegments,
      heightSegments,
      rightColor
    );

    this.vertexes = [
      ...frontVertexes,
      ...backVertexes,
      ...topVertexes,
      ...bottomVertexes,
      ...leftVertexes,
      ...rightVertexes,
    ];

    let indexOffset = 0;

    const frontIndexes = generatePlaneIndexes(
      widthSegments,
      heightSegments,
      indexOffset
    );
    indexOffset += frontVertexes.length;

    const backIndexes = generatePlaneIndexes(
      widthSegments,
      heightSegments,
      indexOffset
    );
    indexOffset += backVertexes.length;

    const topIndexes = generatePlaneIndexes(
      widthSegments,
      depthSegments,
      indexOffset
    );
    indexOffset += topVertexes.length;

    const bottomIndexes = generatePlaneIndexes(
      widthSegments,
      depthSegments,
      indexOffset
    );
    indexOffset += bottomVertexes.length;

    const leftIndexes = generatePlaneIndexes(
      depthSegments,
      heightSegments,
      indexOffset
    );
    indexOffset += leftVertexes.length;

    const rightIndexes = generatePlaneIndexes(
      depthSegments,
      heightSegments,
      indexOffset
    );

    this.indexes = [
      ...frontIndexes,
      ...backIndexes,
      ...topIndexes,
      ...bottomIndexes,
      ...leftIndexes,
      ...rightIndexes,
    ];
  }
}
