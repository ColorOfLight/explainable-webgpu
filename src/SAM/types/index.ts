type UniformDataList = [
  {
    type: "typedArray";
    value: Float32Array | Int32Array | Uint32Array;
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

export interface UniformItem {
  label: string;
  data: UniformDataList[number];
}
