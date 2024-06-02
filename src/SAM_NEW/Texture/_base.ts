import * as SAM from "@site/src/SAM_NEW";

export class Texture extends SAM.Reactor {
  width: number;
  height: number;
  isLoaded: boolean;
  data: ImageBitmap | ImageBitmap[];

  constructor() {
    super();

    this.width = 0;
    this.height = 0;
    this.isLoaded = false;
  }

  async load() {
    throw new Error("Method not implemented.");
  }
}
