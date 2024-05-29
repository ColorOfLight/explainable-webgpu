import * as SAM from "@site/src/SAM_NEW";

export class Observable {
  mediator: SAM.Mediator<Observable>;

  constructor() {
    this.mediator = new SAM.Mediator(this as Observable);
  }
}
