import * as SAM from "@site/src/SAM";

export class Node extends SAM.Reactor {
  private id: symbol;
  isDestroyed: boolean;

  constructor(label: string) {
    super();

    this.setId(label);
    this.isDestroyed = false;
  }

  private setId(label: string) {
    this.id = Symbol(label);
  }

  getId(): symbol {
    return this.id;
  }
}
