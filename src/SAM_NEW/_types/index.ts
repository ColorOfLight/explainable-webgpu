import * as SAM from "@site/src/SAM_NEW";

export type BufferDataRecord = Record<string, BufferData>;

export interface Vertex {
  position: [number, number, number]; // xyz
  normal: [number, number, number]; // xyz
  texCoord: [number, number]; // texCoord
  color?: SAM.Color;
}

type BindDataList = [
  {
    type: "float32Array";
    getValue: () => Float32Array;
    visibility: GPUShaderStageFlags;
  },
  {
    type: "vertex";
    getValue: () => Float32Array;
  },
  {
    type: "index";
    getValue: () => Uint16Array;
  },

  // TODO: Implement these types
  // {
  //   type: "sampler";
  //   descriptor: GPUSamplerDescriptor;
  // },
  // {
  //   type: "image";
  //   value: ImageBitmap;
  //   width: number;
  //   height: number;
  // },
];

// export interface BindData<N extends SAM.Node> {
//   label: string;
//   data: BindDataList[number];
//   watchKeys?: (keyof N)[];
// }

export type BufferData =
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

export type LightType = "ambient" | "directional" | "point";
