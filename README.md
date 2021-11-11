# react-native-chainable-stylesheet

`StyleSheet.create` + chainable API = easier composition & better performance.

## The Problem

### Without react-native-chainable-stylesheet 😭

In React Native, styling components with many small reusable style objects
quickly gets tedious:

```jsx
const styles = StyleSheet.create({
  rounded: { borderRadius: 10 },
  row: { flexDirection: "row" },
  fullX: { width: "100%" },
  bgGray: { backgroundColor: "grey" },
  shadow: { shadowColor: "black", /* ... */ }
});

const Card = () =>
  <View style={[styles.rounded, styles.row, styles.fullX, styles.bgGray, styles.shadow]}>
    ...
  </View>
```

You have to repeat the `styles` name over and over and over again.

### With react-native-chainable-stylesheet 🥳

With react-native-chainable-stylesheet multiple style objects can be composed
insanely easily through simple chaining:

```jsx
const styles = createChainable({
  rounded: { borderRadius: 10 },
  row: { flexDirection: "row" },
  fullX: { width: "100%" },
  bgGray: { backgroundColor: "grey" },
  shadow: { shadowColor: "black", /* ... */ }
});

const Card = () =>
  <View style={styles.rounded.row.fullX.bgGray.shadow.mk()}>
    ...
  </View>
```

The `styles` object created by `createChainable` includes chainable methods for
all the style object—with TypeScript auto-completion at every step.

Not only is this less typing, it is also more efficient. Combining styles with
arrays creates garbage and doesn't maintain reference equality:

```javascript
[style.rounded, style.row, style.fullX, style.bgGray] ===
[style.rounded, style.row, style.fullX, style.bgGray] // false
```

Hence each render of the component will result in a newly allocated array that
does not preserve reference equality between renders. This means extra work for
the garbage collector and extra work for React Native.

On the other hand, the styles returned by the chainable API are memoized. The
same sequence of method calls always return the same object:

```javascript
style.rounded.row.fullX.bgGray.mk() ===
  style.rounded.row.fullX.bgGray().mk() // true
```

This completely avoids allocation of new style objects and speeds up React
Native diffing by maintaining reference equality(*).

(*) Admittedly the performance improvements are probably completely negligible
in the grand scheme of an app.

## Features

* Easily compose styles with chaining.
* Favors small composable styles.
* Extremely simple and lightweight.
* Highly performant with memoized styles.
* Full TypeScript support with auto-completion.
* Works with Hermes.
* No use of proxies or other fancy hacks.

## API Documentation

### `createChainable(style)`

The argument `style` can be everything also accepted by React Natives
`StyleSheet.create`.