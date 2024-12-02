import { splitStringIntoChunks, parseListOfNumbers } from "./stringUtils";

describe("stringUtils", () => {
  describe("splitStringIntoChunks", () => {
    it("splits a string correctly", () => {
      const result = splitStringIntoChunks("abcdefghi", 3);
      expect(result).toStrictEqual(["abc", "def", "ghi"]);
    });

    it("splits a string that has leftovers, ignores leftovers", () => {
      const result = splitStringIntoChunks("abcdefghijk", 3);
      expect(result).toStrictEqual(["abc", "def", "ghi", "jk"]);
    });
  });

  describe("parseListOfNumbers", () => {
    it.each`
      input                  | expected
      ${"1 2 3 8 7 3"}       | ${[1, 2, 3, 8, 7, 3]}
      ${"11 26 39 807 73 3"} | ${[11, 26, 39, 807, 73, 3]}
      ${"a 26 b 807 73 3"}   | ${[26, 807, 73, 3]}
    `("${input} = ${expected}", ({ input, expected }) => {
      const result = parseListOfNumbers(input);
      expect(result).toStrictEqual(expected);
    });
  });
});
