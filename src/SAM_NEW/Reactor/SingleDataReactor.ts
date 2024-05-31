import { Reactor } from "./_base";

export class SingleDataReactor<D> extends Reactor {
  data: D;
  requestedHandlers: { reactor: Reactor; label: Symbol[] }[];

  constructor(
    setter: () => D,
    reactorKeySets?: { reactor: Reactor; key: PropertyKey }[]
  ) {
    super();
    this.data = setter();
    this.requestedHandlers = [];

    if (reactorKeySets != null) {
      reactorKeySets.forEach(({ reactor, key }) => {
        const label = reactor.registerHandler(key, () => {
          this.data = setter();
        });

        this.requestedHandlers.push({ reactor, label: [label] });
      });
    }
  }
}
