import { splitStringIntoChunks } from "./stringUtils";

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
});
