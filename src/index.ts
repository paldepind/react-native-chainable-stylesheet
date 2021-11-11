import { StyleSheet } from "react-native";

function collectStyles(builder: any): any[] {
  if (builder._parent === undefined) {
    return [];
  }
  const arr = collectStyles(builder._parent);
  arr.push(builder._style);
  return arr;
}

export type Builder<T extends StyleSheet.NamedStyles<any>, R extends any[]> = {
  [K in keyof T]: Builder<T, [...R, T[K]]>;
} & { mk: () => R };

type InternalBuilder = {
  new (parent: any, style: any): InternalBuilder;
  _parent: InternalBuilder | undefined;
  _style: any;
  _build: any;
  _memo: Map<string, any>;
  prototype: any;
};

export function create<T extends StyleSheet.NamedStyles<any>>(
  o: T
): Builder<T, []> {
  // Create a new class.
  const Builder = function Builder(
    this: InternalBuilder,
    parent: InternalBuilder | undefined,
    style: any
  ) {
    this._parent = parent;
    this._style = style;
    this._build = undefined;
    this._memo = new Map<string, any>();
  } as unknown as InternalBuilder;

  // For each style name we add a getter to the class.
  for (const [name, style] of Object.entries(o)) {
    Object.defineProperty(Builder.prototype, name, {
      get: function () {
        const b = this._memo.get(name);
        if (b !== undefined) {
          return b;
        }
        const builder = new Builder(this, style);
        this._memo.set(name, builder);
        return builder;
      },
    });
  }

  // Finally we add the `mk` method.
  Builder.prototype.mk = function () {
    if (this._build !== undefined) {
      return this._build;
    }
    const build = collectStyles(this);
    this._build = build;
    return build;
  };

  return new Builder(undefined, undefined) as any;
}
