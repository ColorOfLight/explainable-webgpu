import * as SAM from "@site/src/SAM";
import { Geometry, Vertex } from "./_base";

export interface CubeGeometryOptions {
  colors?: {
    front: SAM.Color;
    back: SAM.Color;
    top: SAM.Color;
    bottom: SAM.Color;
    left: SAM.Color;
    right: SAM.Color;
  };
}

export class CubeGeometry extends Geometry {
  constructor(
    width: number,
    height: number,
    depth: number,
    options?: CubeGeometryOptions
  ) {
    super();

    const x = width / 2;
    const y = height / 2;
    const z = depth / 2;

    const defaultColor = new SAM.Color([1, 1, 1, 1]);

    const frontColor = options?.colors?.front || defaultColor;
    const backColor = options?.colors?.back || defaultColor;
    const topColor = options?.colors?.top || defaultColor;
    const bottomColor = options?.colors?.bottom || defaultColor;
    const leftColor = options?.colors?.left || defaultColor;
    const rightColor = options?.colors?.right || defaultColor;

    const frontVertexes: Vertex[] = [
      { position: [-x, -y, z], color: frontColor },
      { position: [x, -y, z], color: frontColor },
      { position: [-x, y, z], color: frontColor },
      { position: [x, y, z], color: frontColor },
      { position: [-x, y, z], color: frontColor },
      { position: [x, -y, z], color: frontColor },
    ];

    const backVertexes: Vertex[] = [
      { position: [-x, -y, -z], color: backColor },
      { position: [-x, y, -z], color: backColor },
      { position: [x, -y, -z], color: backColor },
      { position: [x, y, -z], color: backColor },
      { position: [x, -y, -z], color: backColor },
      { position: [-x, y, -z], color: backColor },
    ];

    const topVertexes: Vertex[] = [
      { position: [-x, y, -z], color: topColor },
      { position: [-x, y, z], color: topColor },
      { position: [x, y, -z], color: topColor },
      { position: [x, y, z], color: topColor },
      { position: [x, y, -z], color: topColor },
      { position: [-x, y, z], color: topColor },
    ];

    const bottomVertexes: Vertex[] = [
      { position: [-x, -y, -z], color: bottomColor },
      { position: [x, -y, -z], color: bottomColor },
      { position: [-x, -y, z], color: bottomColor },
      { position: [x, -y, z], color: bottomColor },
      { position: [-x, -y, z], color: bottomColor },
      { position: [x, -y, -z], color: bottomColor },
    ];

    const leftVertexes: Vertex[] = [
      { position: [-x, -y, -z], color: leftColor },
      { position: [-x, -y, z], color: leftColor },
      { position: [-x, y, -z], color: leftColor },
      { position: [-x, y, z], color: leftColor },
      { position: [-x, y, -z], color: leftColor },
      { position: [-x, -y, z], color: leftColor },
    ];

    const rightVertexes: Vertex[] = [
      { position: [x, -y, -z], color: rightColor },
      { position: [x, y, -z], color: rightColor },
      { position: [x, -y, z], color: rightColor },
      { position: [x, y, z], color: rightColor },
      { position: [x, -y, z], color: rightColor },
      { position: [x, y, -z], color: rightColor },
    ];

    this.vertexes = [
      ...frontVertexes,
      ...backVertexes,
      ...topVertexes,
      ...bottomVertexes,
      ...leftVertexes,
      ...rightVertexes,
    ];

    this.indexes = SAM.generateNumberArray(this.vertexes.length);
  }
}
