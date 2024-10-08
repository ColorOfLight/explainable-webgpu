import * as SAM from "@site/src/SAM";

export const RESOURCE_CLASS_MAP: Record<
  SAM.BindingResourcePrecursor["type"],
  typeof SAM.BindResourceReactor
> = {
  "uniform-typed-array": SAM.NumbersResourceReactor,
  vertex: SAM.NumbersResourceReactor,
  index: SAM.NumbersResourceReactor,
  image: SAM.ImageResourceReactor,
  "cube-image": SAM.CubeImageResourceReactor,
  sampler: SAM.SamplerResourceReactor,
};
