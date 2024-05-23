export interface LoadImageBitmapOptions {
  flipY?: boolean;
}

export async function loadImageBitmap(
  imagePath: string,
  options?: LoadImageBitmapOptions
): Promise<ImageBitmap> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imagePath;

    // Set cross-origin if the image is hosted on a different domain
    // image.crossOrigin = "anonymous";

    image.onload = () => {
      createImageBitmap(image, {
        imageOrientation: options?.flipY ? "flipY" : "none",
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
