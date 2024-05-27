import * as SAM from "@site/src/SAM_NEW";

export class Node {
  private id: Symbol;
  isDestroyed: boolean;

  constructor(label: string) {
    this.setId(label);
    this.isDestroyed = false;
  }

  private setId(label: string) {
    this.id = Symbol(label);
  }

  getId(): Symbol {
    return this.id;
  }

  getObservableRecord(): Record<string, SAM.Observable> {
    throw new Error("Method not implemented.");
  }
}
