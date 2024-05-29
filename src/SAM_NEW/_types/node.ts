import * as SAM from "@site/src/SAM_NEW";

export type BufferData = Float32Array | Uint16Array | Uint32Array;

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

export interface BindData<N extends SAM.Node> {
  label: string;
  data: BindDataList[number];
  watchKeys?: (keyof N)[];
}
