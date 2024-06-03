import * as SAM from "@site/src/SAM";
import { Texture } from "./_base";

export interface ImageTextureOptions {
  width?: number;
  height?: number;
}

export class ImageTexture extends Texture {
  data: ImageBitmap;
  private imagePath: string;

  constructor(imagePath: string, options?: ImageTextureOptions) {
    super();

    this.imagePath = imagePath;
    this.width = options?.width ?? 0;
    this.height = options?.height ?? 0;
  }

  async load() {
    const imageBitmap = await SAM.loadImageBitmap(this.imagePath, {
      flipY: true,
    });

    this.data = imageBitmap;
    this.isLoaded = true;

    if (this.width === 0) {
      this.width = imageBitmap.width;
    }

    if (this.height === 0) {
      this.height = imageBitmap.height;
    }
  }
}
