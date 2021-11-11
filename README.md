# react-native-chainable-stylesheet

Without react-native-chainable-stylesheet 😭

```typescript
const style = StyleSheet.create({
  rounded: { borderRadius: 10 },
  row: { flexDirection: "row" },
  fullX: { width: "100%" },
  bgGray: { backgroundColor: "grey }
});

const Card = () =>
  <Text style={[style.rounded, style.row, style.fullX, style.bgGray]}>
    Foo
  </Text>
```

This is annoying because you have to type `style` over and over and over again.

With react-native-chainable-stylesheet 🥳

```typescript
const style = createChainable({
  rounded: { borderRadius: 10 },
  row: { flexDirection: "row" },
  fullX: { width: "100%" },
  bgGray: { backgroundColor: "grey }
});

const Card = () =>
  <Text style={style.rounded.row.fullX.bgGray.mk()}>
    Foo
  </Text>
```