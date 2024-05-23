import { Texture } from "./_base";
import { loadImageBitmap } from "./_utils";

export interface CubeMapFaceImagePaths {
  px: string;
  nx: string;
  py: string;
  ny: string;
  pz: string;
  nz: string;
}

export class CubeMapTexture extends Texture {
  faceImagePaths: CubeMapFaceImagePaths;
  data: ImageBitmap[];

  constructor(faceImagePaths: CubeMapFaceImagePaths) {
    super();

    this.faceImagePaths = faceImagePaths;
  }

  async load() {
    const sortedImagePaths = [
      this.faceImagePaths.px,
      this.faceImagePaths.nx,
      this.faceImagePaths.py,
      this.faceImagePaths.ny,
      this.faceImagePaths.pz,
      this.faceImagePaths.nz,
    ];

    const faceImagePromises = sortedImagePaths.map((imagePath) =>
      loadImageBitmap(imagePath)
    );

    const faceImages = await Promise.all(faceImagePromises);

    const firstImageWidth = faceImages[0].width;
    if (faceImages.some((image) => image.width !== firstImageWidth)) {
      throw new Error("All face images must have the same width.");
    }

    const firstImageHeight = faceImages[0].height;
    if (faceImages.some((image) => image.height !== firstImageHeight)) {
      throw new Error("All face images must have the same height.");
    }

    this.data = faceImages;
    this.isLoaded = true;

    if (this.width === 0) {
      this.width = faceImages[0].width;
    }

    if (this.height === 0) {
      this.height = faceImages[0].height;
    }
  }

  getData() {
    if (!this.isLoaded) {
      throw new Error("Texture is not loaded yet.");
    }

    return this.data;
  }
}
