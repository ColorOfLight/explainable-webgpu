import * as SAM from "@site/src/SAM_NEW";

export type BufferData = Float32Array | Uint16Array | Uint32Array;

export type BufferDataRecord = Record<string, BufferData>;

export interface Vertex {
  position: [number, number, number]; // xyz
  normal: [number, number, number]; // xyz
  texCoord: [number, number]; // texCoord
  color?: SAM.Color;
}

export interface Observable<U extends () => unknown = () => unknown> {
  label: string;
  object: object;
  keys: string[];
  getUpdatedValue: U;
}

export interface BufferDataObservable<
  U extends () => BufferData = () => BufferData,
> extends Observable<U> {}
export interface RawValueObservable<U extends () => Record<string, unknown>>
  extends Observable<U> {}

type BindDataList = [
  {
    type: "numberArray";
    value: number[];
  },
  {
    type: "sampler";
    descriptor: GPUSamplerDescriptor;
  },
  {
    type: "image";
    value: ImageBitmap;
    width: number;
    height: number;
  },
];

export interface BindData {
  label: string;
  data: BindDataList[number];
}
