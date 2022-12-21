import {
  anyRangeOverlap,
  oneRangeContainsAnother,
  parseRange,
  parseRanges,
  rangeIsContainedBy,
} from ".";

describe("day4", () => {
  describe("parseRange", () => {
    it("parses range correctly", () => {
      const result = parseRange("5-8");

      expect(result).toStrictEqual({
        from: 5,
        to: 8,
      });
    });

    it("throws error for invalid input correctly", () => {
      expect(() => parseRange("foo-bar-car")).toThrowError();
    });

    it("throws error for ranges that go backwards", () => {
      expect(() => parseRange("8-5")).toThrowError();
    });
  });

  describe("parseRanges", () => {
    it("parses ranges correctly", () => {
      const result = parseRanges("18-86,17-85");

      expect(result).toStrictEqual([
        { from: 18, to: 86 },
        { from: 17, to: 85 },
      ]);
    });
  });

  describe("rangeIsContainedBy", () => {
    it.each`
      name                       | rangeA                 | rangeB                  | expected
      ${"First contains second"} | ${{ from: 5, to: 15 }} | ${{ from: 7, to: 10 }}  | ${true}
      ${"Shared start"}          | ${{ from: 5, to: 15 }} | ${{ from: 5, to: 8 }}   | ${true}
      ${"Shared End"}            | ${{ from: 5, to: 15 }} | ${{ from: 11, to: 15 }} | ${true}
      ${"Overlap Start"}         | ${{ from: 5, to: 15 }} | ${{ from: 3, to: 7 }}   | ${false}
      ${"Overlap End"}           | ${{ from: 5, to: 15 }} | ${{ from: 13, to: 17 }} | ${false}
      ${"No Overlap"}            | ${{ from: 5, to: 15 }} | ${{ from: 19, to: 27 }} | ${false}
    `("$name", ({ rangeA, rangeB, expected }) => {
      const result = rangeIsContainedBy(rangeA, rangeB);
      expect(result).toBe(expected);
    });
  });

  describe("oneRangeContainsAnother", () => {
    it.each`
      name                       | rangeA                 | rangeB                 | expected
      ${"First contains second"} | ${{ from: 5, to: 15 }} | ${{ from: 5, to: 8 }}  | ${true}
      ${"Second contains first"} | ${{ from: 5, to: 8 }}  | ${{ from: 5, to: 15 }} | ${true}
      ${"No containment"}        | ${{ from: 5, to: 8 }}  | ${{ from: 9, to: 20 }} | ${false}
    `("$name", ({ rangeA, rangeB, expected }) => {
      const result = oneRangeContainsAnother(rangeA, rangeB);
      expect(result).toBe(expected);
    });
  });

  describe("anyRangeOverlap", () => {
    it.each`
      name                       | rangeA                 | rangeB                  | expected
      ${"First contains second"} | ${{ from: 5, to: 15 }} | ${{ from: 5, to: 8 }}   | ${true}
      ${"Overlap Start"}         | ${{ from: 5, to: 15 }} | ${{ from: 3, to: 9 }}   | ${true}
      ${"Overlap End"}           | ${{ from: 5, to: 15 }} | ${{ from: 13, to: 20 }} | ${true}
      ${"No Overlap"}            | ${{ from: 5, to: 15 }} | ${{ from: 19, to: 28 }} | ${false}
    `("$name", ({ rangeA, rangeB, expected }) => {
      const result = anyRangeOverlap(rangeA, rangeB);
      expect(result).toBe(expected);
    });
  });
});
