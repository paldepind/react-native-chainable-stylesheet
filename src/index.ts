import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

function collectStyles(builder: any): any[] {
  if (builder._parent === undefined) {
    return [];
  }
  const arr = collectStyles(builder._parent);
  arr.push(builder._style);
  return arr;
}

type Style = ViewStyle | TextStyle | ImageStyle;

export type StyleBuilder<
  T extends StyleSheet.NamedStyles<any>,
  R extends any[]
> = {
  [K in keyof T]: StyleBuilder<T, [...R, T[K]]>;
} & { mk: (extra?: Style) => R };

type InternalBuilder = {
  new (parent: any, style: any): InternalBuilder;
  _parent: InternalBuilder | undefined;
  _style: any;
  _build: any;
  _memo: Map<string, any>;
  _extra: any;
  prototype: any;
};

export function createChainableStylesheet<
  T extends StyleSheet.NamedStyles<any>
>(o: T): StyleBuilder<T, []> {
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
  Builder.prototype.mk = function (extra: Style) {
    if (this._build !== undefined && this._extra === extra) {
      return this._build;
    }
    const build = collectStyles(this);
    this._build = build;
    this._extra = extra;
    return extra !== undefined ? [build, extra] : build;
  };

  return new Builder(undefined, undefined) as any;
}
