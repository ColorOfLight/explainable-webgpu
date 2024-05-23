import { Texture } from "./_base";
import { loadImageBitmap } from "./_utils";

export interface ImageTextureOptions {
  width?: number;
  height?: number;
}

export class ImageTexture extends Texture {
  data: ImageBitmap;
  imagePath: string;

  constructor(imagePath: string, options?: ImageTextureOptions) {
    super();

    this.imagePath = imagePath;
    this.width = options?.width ?? 0;
    this.height = options?.height ?? 0;
  }

  async load() {
    const imageBitmap = await loadImageBitmap(this.imagePath, { flipY: true });

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
