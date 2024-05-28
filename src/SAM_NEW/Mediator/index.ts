export interface MediatorWatchItem<T> {
  key: T;
  onChange: () => void;
}

export class Mediator<O extends object> {
  private targetObject: O | undefined;
  private watchers: Map<keyof O, { originalDescriptor: PropertyDescriptor }>;

  constructor(object: O) {
    this.targetObject = object;
    this.watchers = new Map();
  }

  watch(watchItem: MediatorWatchItem<keyof O>) {
    if (this.watchers.get(watchItem.key) != null) {
      const prevDescriptor = Object.getOwnPropertyDescriptor(
        this.targetObject,
        watchItem.key
      );

      Object.defineProperty(this.targetObject, watchItem.key, {
        get: () => prevDescriptor.get(),
        set: (value) => {
          prevDescriptor.set(value);
          watchItem.onChange();
        },
      });

      return;
    }

    let _value = this.targetObject[watchItem.key];

    const originalDescriptor = Object.getOwnPropertyDescriptor(
      this.targetObject,
      watchItem.key
    );

    Object.defineProperty(this.targetObject, watchItem.key, {
      get: () => _value,
      set: (value) => {
        _value = value;
        watchItem.onChange();
      },
    });

    this.watchers.set(watchItem.key, { originalDescriptor });
  }

  watchAll(watchItems: MediatorWatchItem<keyof O>[]) {
    watchItems.forEach((watchItem) => this.watch(watchItem));
  }

  unwatch(key: keyof O) {
    const { originalDescriptor } = this.watchers.get(key);

    Object.defineProperty(this.targetObject, key, originalDescriptor);

    this.watchers.delete(key);
  }

  unwatchAll() {
    this.watchers.forEach((_, key) => this.unwatch(key));
  }
}
