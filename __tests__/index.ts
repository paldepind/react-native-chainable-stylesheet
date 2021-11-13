import { StyleSheet } from "react-native";
import { createChainableStylesheet } from "../src/index";

describe("createStyleBuilder", () => {
  it("can build styles", () => {
    const style = createChainableStylesheet({
      foo: { backgroundColor: "red" },
      bar: { borderColor: "black" },
      baz: { fontWeight: "500" },
    });
    const result = style.foo.bar.baz;

    expect(result.length).toEqual(3);
    expect(result[0]).toEqual({ backgroundColor: "red" });
    expect(result[1]).toEqual({ borderColor: "black" });
    expect(result[2]).toEqual({ fontWeight: "500" });

    expect(StyleSheet.flatten(result)).toEqual({
      backgroundColor: "red",
      borderColor: "black",
      fontWeight: "500",
    });
  });
  it("maintains reference equality", () => {
    const style = createChainableStylesheet({
      foo: { backgroundColor: "red" },
      bar: { borderColor: "black" },
      baz: { fontWeight: "500" },
    });
    const result1 = style.foo.bar.baz;
    const result2 = style.foo.bar.baz;
    expect(result1 === result2).toBe(true);
  });
  it("has correct type on result", () => {
    const style = createChainableStylesheet({
      foo: { backgroundColor: "red" },
      bar: { borderColor: "black" },
      baz: { fontWeight: "500" },
    });
    const result = style.foo.bar.baz;
    const color = result[1].borderColor;
    expect(color).toBe("black");
  });
  describe("extra argument", () => {
    it("accepts extra argument", () => {
      const styles = createChainableStylesheet({
        rounded: { borderRadius: 10 },
        row: { flexDirection: "row" },
      });
      const result = styles.row.rounded.and({ backgroundColor: "black" });

      expect(result.length).toEqual(2);
      expect(result[0][0]).toEqual({ flexDirection: "row" });
      expect(result[0][1]).toEqual({ borderRadius: 10 });
      expect(result[1]).toEqual({ backgroundColor: "black" });
    });
    it("keeps working as builder", () => {
      const styles = createChainableStylesheet({
        rounded: { borderRadius: 10 },
        row: { flexDirection: "row" },
      });
      const result = styles.row.and({ backgroundColor: "black" }).rounded;

      expect(result.length).toEqual(3);
      expect(result[0].length).toEqual(1);
      expect(result[0][0]).toEqual({ flexDirection: "row" });
      expect(result[1]).toEqual({ backgroundColor: "black" });
      expect(result[2]).toEqual({ borderRadius: 10 });
    });
    it("has correct type on result", () => {
      const style = createChainableStylesheet({
        foo: { backgroundColor: "red" },
        bar: { borderColor: "black" },
        baz: { fontWeight: "500" },
      });
      const result = style.foo.bar.baz;
      const color = result[1].borderColor;
      expect(color).toBe("black");
    });
    it("preserves reference equality on equal argument", () => {
      const styles = createChainableStylesheet({
        rounded: { borderRadius: 10 },
        row: { flexDirection: "row" },
      });
      const extra = { backgroundColor: "black" };
      const result1 = styles.row.rounded.and(extra);
      const result2 = styles.row.rounded.and(extra);
      expect(result1 === result2).toBe(true);
    });
  });
});
