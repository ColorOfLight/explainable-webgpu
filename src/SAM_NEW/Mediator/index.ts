export interface MediatorWatchItem<T> {
  key: T;
  onChange: () => void;
}

export class Mediator {
  private targetObject: object | undefined;
  private originalDescriptors: Record<string, PropertyDescriptor>;

  constructor() {
    this.targetObject = {};
    this.originalDescriptors = {};
  }

  watch<T extends object>(object: T, watchItems: MediatorWatchItem<keyof T>[]) {
    if (this.targetObject != null) {
      this.unwatch();
    }

    const _values = watchItems.reduce(
      (acc, { key }) => {
        acc[key] = object[key];
        return acc;
      },
      {} as Record<keyof T, T[keyof T]>
    );

    const originalDescriptors = Object.getOwnPropertyDescriptors(object);

    watchItems.forEach(({ key, onChange }) => {
      Object.defineProperty(object, key, {
        get: () => _values[key],
        set: (value) => {
          _values[key] = value;
          onChange();
        },
      });
    });

    this.targetObject = object;
    this.originalDescriptors = originalDescriptors;
  }

  unwatch() {
    if (this.targetObject == null) {
      throw new Error("No object is being watched");
    }

    const { targetObject, originalDescriptors } = this;

    Object.defineProperties(targetObject, originalDescriptors);

    this.targetObject = undefined;
    this.originalDescriptors = {};
  }
}
