import day3, { splitInHalf, getPriority, findCommonElement } from ".";

describe("Day 3", () => {
  describe("Day 3", () => {
    it("Calculates the example correctly", async () => {
      const [part1, part2] = await day3("./src/day3/testInput.txt");
      expect(part1).toBe(157);
      expect(part2).toBe(70);
    });
  });
  describe("splitInHalf", () => {
    it("Throws error for zero length string", () => {
      expect(() => splitInHalf("")).toThrowError();
    });
    it("Throws error for odd length string", () => {
      expect(() => splitInHalf("abcde")).toThrowError();
    });

    it("correctly splits string of 2 chars", () => {
      const [r1, r2] = splitInHalf("ab");
      expect(r1).toBe("a");
      expect(r2).toBe("b");
    });

    it("correctly splits string of 6 chars", () => {
      const [r1, r2] = splitInHalf("abcdef");
      expect(r1).toBe("abc");
      expect(r2).toBe("def");
    });
  });

  // Lowercase item types a through z have priorities 1 through 26.
  // Uppercase item types A through Z have priorities 27 through 52.
  describe("getPriority", () => {
    it.each`
      item   | expected
      ${"a"} | ${1}
      ${"e"} | ${5}
      ${"z"} | ${26}
      ${"A"} | ${27}
      ${"E"} | ${31}
      ${"Z"} | ${52}
    `("$item -> $expected", ({ item, expected }) => {
      const result = getPriority(item);
      expect(result).toBe(expected);
    });

    it("Throws error for strings of length !== 1", () => {
      expect(() => getPriority("foo")).toThrowError();
    });
  });

  describe("findCommonElement", () => {
    it.each`
      inputs                              | expected
      ${["abc", "ade"]}                   | ${"a"}
      ${["POIU", "IHJK"]}                 | ${"I"}
      ${["POIU", "IHJK", "JIRZ"]}         | ${"I"}
      ${["ABCD", "UIPD", "MNBD", "ZXCD"]} | ${"D"}
      ${["abc", "def"]}                   | ${undefined}
    `("$inputs share '$expected'", ({ inputs, expected }) => {
      const result = findCommonElement(inputs);
      expect(result).toBe(expected);
    });
  });
});
