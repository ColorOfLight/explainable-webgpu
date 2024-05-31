import { Reactor } from "./_base";

export class SingleDataReactor<D> extends Reactor {
  data: D;

  constructor(
    setter: () => D,
    reactorKeySets?: { reactor: Reactor; key: PropertyKey }[]
  ) {
    super();
    this.data = setter();

    if (reactorKeySets != null) {
      reactorKeySets.forEach(({ reactor, key }) => {
        this.registerToParentReactor(reactor, key, () => {
          this.data = setter();
        });
      });
    }
  }
}
