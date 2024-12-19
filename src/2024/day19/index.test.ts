import day19, {
  canMakePattern,
  loadTowelProblem,
  canMakeNextPartOfPattern,
} from "./index";

const TEST_INPUT_FILE = "./src/2024/day19/testInput.txt";

describe("day19", () => {
  it.each`
    towel         | desired                                | index | expected
    ${["f", "a"]} | ${["f", "a", "j", "o", "g"]}           | ${0}  | ${true}
    ${["f", "a"]} | ${["f", "a", "j", "o", "g"]}           | ${1}  | ${false}
    ${["j", "o"]} | ${["f", "a", "j", "o", "g"]}           | ${2}  | ${true}
    ${["j", "b"]} | ${["f", "a", "j", "o", "g"]}           | ${2}  | ${false}
    ${["j", "b"]} | ${["f", "a", "j", "o", "g", "j", "b"]} | ${2}  | ${false}
    ${["j", "b"]} | ${["f", "a", "j", "o", "g", "j", "b"]} | ${5}  | ${true}
  `(
    "canMakeNextPartOfPattern $towel in $desired at $index = $expected",
    ({ towel, desired, index, expected }) => {
      const result = canMakeNextPartOfPattern(towel, desired, index);

      expect(result).toBe(expected);
    },
  );

  it.each`
    towelSet                                          | desired                           | expected
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${["b", "r", "w", "r", "r"]}      | ${true}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${["b", "g", "g", "r"]}           | ${true}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${["g", "b", "b", "r"]}           | ${true}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${["r", "r", "b", "g", "b", "r"]} | ${true}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${["u", "b", "w", "u"]}           | ${false}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${["b", "w", "u", "r", "r", "g"]} | ${true}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${["b", "r", "g", "r"]}           | ${true}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${["b", "b", "r", "g", "w", "b"]} | ${false}
  `(
    "canMakePattern $desired with any of $towelSet = $expected",
    ({ desired, towelSet, expected }) => {
      const result = canMakePattern(towelSet, desired);

      expect(result).toBe(expected);
    },
  );

  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day19(TEST_INPUT_FILE);

    expect(part1).toBe(6);
  });

  it.skip("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day19(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
