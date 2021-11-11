import { create } from "../src/index";

describe("test", () => {
  it("can test", () => {
    const style = create({
      foo: { backgroundColor: "red" },
      bar: { borderColor: "black" },
      baz: { fontWeight: "500" },
    });
    const result = style.foo.bar.baz.mk();
    expect(result).toEqual([
      { backgroundColor: "red" },
      { borderColor: "black" },
      { fontWeight: "500" },
    ]);
  });
  it("maintains reference equality", () => {
    const style = create({
      foo: { backgroundColor: "red" },
      bar: { borderColor: "black" },
      baz: { fontWeight: "500" },
    });
    const result1 = style.foo.bar.baz.mk();
    const result2 = style.foo.bar.baz.mk();
    expect(result1 === result2).toBe(true);
  });
  it("has correct type on result", () => {
    const style = create({
      foo: { backgroundColor: "red" },
      bar: { borderColor: "black" },
      baz: { fontWeight: "500" },
    });
    const result = style.foo.bar.baz.mk();
    const color = result[1].borderColor;
    expect(color).toBe("black");
  });
});
