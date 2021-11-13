import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

type Style = ViewStyle | TextStyle | ImageStyle;

/**
 * The first argument `T` describes the named styles that this builder is based
 * on. The second argument `R` is an array of styles that are already included
 * in this builder.
 */
export type StyleBuilder<
  T extends StyleSheet.NamedStyles<any>,
  R extends any[]
> = {
  [K in keyof T]: StyleBuilder<T, [...R, T[K]]>;
} & R & { and: <P extends Style>(extra: P) => StyleBuilder<T, [R, P]> };

export function createChainableStylesheet<
  T extends StyleSheet.NamedStyles<any>
>(styles: T): StyleBuilder<T, []> {
  class StyleBuilder extends Array {
    // When a new `StyleBuilder` is created based on this one by using one of
    // its getters we memorize the result in this map.
    memo!: Map<string, StyleBuilder>;
    // When a new `StyleBuilder` is created based on this one _by using the
    // `and` method we memorize the result in this weak map. We use a weak map
    // since we don't want to keep the extra argument alive. If the extra
    // argument is an object literal then the user will never supply the same
    // literal again and we would leak memory on each render by keeping it
    // alive. A weak map on the other hand, is exactly what we want. If the use
    // supplies a literal, then when the literal is GC'ed it's also removed from
    // our memorization map.
    extraMemo!: WeakMap<any, StyleBuilder>;
  }

  const createBuilder = (from: Iterable<Style | Style[]>) => {
    const builder = StyleBuilder.from(from) as StyleBuilder;
    builder.memo = new Map();
    builder.extraMemo = new WeakMap();
    return builder;
  };

  // For each style name we add a getter to the class.
  for (const [name, style] of Object.entries(styles)) {
    Object.defineProperty(StyleBuilder.prototype, name, {
      get: function (this: StyleBuilder) {
        const b = this.memo.get(name);
        if (b !== undefined) {
          return b;
        }
        const builder = createBuilder(this);
        builder.push(style);
        this.memo.set(name, builder as any);
        return builder;
      },
    });
  }

  // Finally we add the `and` method to the class.
  // @ts-ignore
  StyleBuilder.prototype.and = function (extra: Style) {
    const b = this.extraMemo.get(extra);
    if (b !== undefined) {
      return b;
    }
    // For the extra arguments memoization may not be relevant (if the user
    // passes a literal). Hence we avoid copying `this` by instead nesting the
    // already accumulated styles in an array. In this way inline literal styles
    // only leads to the allocation of a pair.
    const builder = createBuilder([this, extra]);
    this.extraMemo.set(extra, builder);
    return builder;
  };

  return createBuilder([]) as any; // TypeScript does not know that we've added the extra methods.
}
