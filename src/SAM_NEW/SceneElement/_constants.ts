import * as SAM from "@site/src/SAM_NEW";

export const RESOURCE_CLASS_MAP: Record<
  SAM.BindingResourcePrecursor["type"],
  typeof SAM.BindResourceReactor
> = {
  "uniform-typed-array": SAM.NumbersResourceReactor,
  vertex: SAM.NumbersResourceReactor,
  index: SAM.NumbersResourceReactor,
  image: SAM.ImageResourceReactor,
  sampler: SAM.SamplerResourceReactor,
};
