type Handler = {
  label: symbol;
  onChange: () => void;
};

export class Reactor {
  private reactorHandlerMap: Map<PropertyKey, Handler[]>;

  constructor() {
    this.reactorHandlerMap = new Map();
  }

  registerHandler(key: PropertyKey, onKeyChange: Handler["onChange"]): Symbol {
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

  deregisterHandler(key: PropertyKey, symbol: Symbol): void {
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
