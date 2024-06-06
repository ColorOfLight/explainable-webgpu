import * as SAM from "@site/src/SAM";

export interface Vertex {
  position: [number, number, number]; // xyz
  normal: [number, number, number]; // xyz
  texCoord: [number, number]; // texCoord
  color?: SAM.Color;
}

export type NumbersResourcePrecursor =
  | {
      type: "uniform-typed-array";
      value: Float32Array | Uint32Array | Int32Array;
    }
  | {
      type: "vertex";
      value: Float32Array;
    }
  | {
      type: "index";
      value: Uint16Array;
    };

export type ImageResourcePrecursor = {
  type: "image";
  value: {
    image: ImageBitmap;
    width: number;
    height: number;
  };
};

export type CubeImageResourcePrecursor = {
  type: "cube-image";
  value: {
    images: ImageBitmap[];
    width: number;
    height: number;
  };
};

export type DepthTextureResourcePrecursor = {
  type: "depth-texture";
  value: {
    width: number;
    height: number;
  };
};

export type SamplerResourcePrecursor = {
  type: "sampler";
  value: GPUSamplerDescriptor;
};

export type BindingResourcePrecursor =
  | NumbersResourcePrecursor
  | ImageResourcePrecursor
  | CubeImageResourcePrecursor
  | SamplerResourcePrecursor
  | DepthTextureResourcePrecursor;

export type LightType = "ambient" | "directional" | "point";

export interface GeometryPipelineData {
  topology: GPUPrimitiveTopology;
  vertexBufferLayout: GPUVertexBufferLayout;
}

export interface MaterialPipelineData {
  depthWriteEnabled: boolean;
}

export interface PipelineData
  extends GeometryPipelineData,
    MaterialPipelineData {}
