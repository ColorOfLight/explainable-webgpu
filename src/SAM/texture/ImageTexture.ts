import { Texture } from "./_base";

export interface ImageTextureOptions {
  width?: number;
  height?: number;
}

async function loadImageBitmap(imagePath: string): Promise<ImageBitmap> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imagePath;

    // Set cross-origin if the image is hosted on a different domain
    // image.crossOrigin = "anonymous";

    image.onload = () => {
      createImageBitmap(image, {
        imageOrientation: "flipY",
      })
        .then((imageBitmap) => {
          resolve(imageBitmap);
        })
        .catch((error) => {
          reject(error);
        });
    };

    image.onerror = () => {
      reject(new Error(`Failed to load image at path: ${imagePath}`));
    };
  });
}

export class ImageTexture extends Texture {
  imagePath: string;

  constructor(imagePath: string, options?: ImageTextureOptions) {
    super();

    this.imagePath = imagePath;
    this.width = options?.width ?? 0;
    this.height = options?.height ?? 0;
  }

  async load() {
    const imageBitmap = await loadImageBitmap(this.imagePath);

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
