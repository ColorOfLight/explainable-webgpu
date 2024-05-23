type MaterialBindDataList = [
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

export interface MaterialBindData {
  label: string;
  data: MaterialBindDataList[number];
}
