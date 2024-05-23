export class Texture {
  width: number;
  height: number;
  isLoaded: boolean;
  data: ImageBitmap | ImageBitmap[];

  constructor() {
    this.width = 0;
    this.height = 0;
    this.isLoaded = false;
  }

  async load() {
    throw new Error("Method not implemented.");
  }
}
