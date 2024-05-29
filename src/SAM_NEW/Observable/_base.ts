import * as SAM from "@site/src/SAM_NEW";

export class Observable {
  mediator: SAM.Mediator<this>;

  constructor() {
    this.mediator = new SAM.Mediator(this);
  }
}
