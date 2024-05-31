type Handler = {
  label: symbol;
  onChange: () => void;
};

export class Reactor {
  private reactorHandlerMap: Map<PropertyKey, Handler[]>;
  private parentReactorHandlers: {
    reactor: Reactor;
    key: PropertyKey;
    handlerLabel: Handler["label"];
  }[];

  constructor() {
    this.reactorHandlerMap = new Map();
    this.parentReactorHandlers = [];
  }

  registerHandler(key: PropertyKey, onKeyChange: Handler["onChange"]): symbol {
    const symbol = Symbol(typeof key === "symbol" ? key.toString() : key);

    if (!this.reactorHandlerMap.has(key)) {
      this.reactorHandlerMap.set(key, []);
      this.registerKeyDispatcher(key);
    }

    this.reactorHandlerMap
      .get(key)
      .push({ label: symbol, onChange: onKeyChange });

    return symbol;
  }

  registerToParentReactor(
    reactor: Reactor,
    key: PropertyKey,
    onKeyChange: Handler["onChange"]
  ): void {
    const handlerLabel = reactor.registerHandler(key, onKeyChange);
    this.parentReactorHandlers.push({ reactor, key, handlerLabel });
  }

  deregisterParentHandlers(): void {
    this.parentReactorHandlers.forEach(({ reactor, key, handlerLabel }) => {
      reactor.deregisterHandler(key, handlerLabel);
    });
    this.parentReactorHandlers = [];
  }

  private deregisterHandler(key: PropertyKey, symbol: Symbol): void {
    const handlers = this.reactorHandlerMap.get(key);

    if (handlers == null) {
      throw new Error("No handlers registered for key");
    }

    const handlerIndex = handlers.findIndex(
      (handler) => handler.label === symbol
    );

    if (handlerIndex == -1) {
      throw new Error("No handler registered with that symbol");
    }

    delete handlers[handlerIndex];
  }

  private registerKeyDispatcher(key: PropertyKey) {
    let _value = this[key];

    Object.defineProperty(this, key, {
      get: () => {
        return _value;
      },
      set: (value) => {
        _value = value;

        this.reactorHandlerMap.get(key).forEach((handler) => {
          handler.onChange();
        });
      },
    });
  }
}
