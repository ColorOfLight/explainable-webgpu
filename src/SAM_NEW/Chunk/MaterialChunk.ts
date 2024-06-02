import * as SAM from "@site/src/SAM_NEW";
import { Chunk } from "./_base";

export class MaterialChunk extends Chunk {
  precursorReactorList: SAM.SingleDataReactor<SAM.BindingResourcePrecursor>[];
  layoutEntryDataReactorList: SAM.SingleDataReactor<GPUBindGroupLayoutEntry>[];
  vertexDescriptorReactor: SAM.SingleDataReactor<GPUShaderModuleDescriptor>;
  fragmentDescriptorReactor: SAM.SingleDataReactor<GPUShaderModuleDescriptor>;

  constructor(material: SAM.Material) {
    super();

    this.precursorReactorList = this.getPrecursorList(material);
    this.layoutEntryDataReactorList = this.getLayoutEntryDataList(material);
    this.vertexDescriptorReactor = new SAM.SingleDataReactor(
      () => material.vertexDescriptor,
      [{ reactor: material, key: "vertexDescriptor" }]
    );
    this.fragmentDescriptorReactor = new SAM.SingleDataReactor(
      () => material.fragmentDescriptor,
      [{ reactor: material, key: "fragmentDescriptor" }]
    );
  }

  getPrecursorList(
    material: SAM.Material
  ): SAM.SingleDataReactor<SAM.BindingResourcePrecursor>[] {
    if (
      material instanceof SAM.BasicMaterial ||
      material instanceof SAM.SimpleStandardMaterial
    ) {
      return [
        new SAM.SingleDataReactor(
          () => ({
            type: "uniform-typed-array",
            value: material.color.toTypedArray(),
          }),
          [
            {
              reactor: material,
              key: "color",
            },
          ]
        ),
      ];
    }

    if (material instanceof SAM.NormalMaterial) {
      return [];
    }

    if (material instanceof SAM.PhongMaterial) {
      return [
        new SAM.SingleDataReactor(
          () => ({
            type: "uniform-typed-array",
            value: new Float32Array([
              ...material.color.toNumberArray(),
              material.diffuse,
              material.specular,
              material.alpha,
              ...Array(2).fill(0), // padding
            ]),
          }),
          [
            {
              reactor: material,
              key: "color",
            },
            {
              reactor: material,
              key: "diffuse",
            },
            {
              reactor: material,
              key: "specular",
            },
            {
              reactor: material,
              key: "alpha",
            },
          ]
        ),
      ];
    }

    if (material instanceof SAM.UVMaterial) {
      const patternIndex = SAM.UV_MATERIAL_PATTERNS.indexOf(material.pattern);
      if (patternIndex === -1) {
        throw new Error("Invalid UVMaterial pattern");
      }

      return [
        new SAM.SingleDataReactor(
          () => ({
            type: "uniform-typed-array",
            value: new Float32Array([patternIndex]),
          }),
          [
            {
              reactor: material,
              key: "pattern",
            },
          ]
        ),
      ];
    }

    if (material instanceof SAM.ImageTextureMaterial) {
      return [
        new SAM.SingleDataReactor(
          () => ({
            type: "sampler",
            value: material.samplerDescriptor,
          }),
          [
            {
              reactor: material,
              key: "samplerDescriptor",
            },
          ]
        ),
        new SAM.SingleDataReactor(
          () => ({
            type: "image",
            value: {
              type: "image",
              image: material.imageTexture.data,
              width: material.imageTexture.width,
              height: material.imageTexture.height,
            },
          }),
          [
            {
              reactor: material.imageTexture,
              key: "data",
            },
            {
              reactor: material.imageTexture,
              key: "width",
            },
            {
              reactor: material.imageTexture,
              key: "height",
            },
          ]
        ),
      ];
    }

    throw new Error("Unsupported material type");
  }

  getLayoutEntryDataList(
    material: SAM.Material
  ): SAM.SingleDataReactor<GPUBindGroupLayoutEntry>[] {
    if (
      material instanceof SAM.BasicMaterial ||
      material instanceof SAM.SimpleStandardMaterial ||
      material instanceof SAM.PhongMaterial ||
      material instanceof SAM.UVMaterial
    ) {
      return [
        new SAM.SingleDataReactor(() => ({
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: "uniform",
          },
        })),
      ];
    }

    if (material instanceof SAM.NormalMaterial) {
      return [];
    }

    if (material instanceof SAM.ImageTextureMaterial) {
      return [
        new SAM.SingleDataReactor(() => ({
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {},
        })),
        new SAM.SingleDataReactor(() => ({
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
        })),
      ];
    }

    throw new Error("Unsupported material type");
  }
}
