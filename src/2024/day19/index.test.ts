import day19, {
  canMakePattern,
  loadTowelProblem,
  canMakeNextPartOfPattern,
} from "./index";

const TEST_INPUT_FILE = "./src/2024/day19/testInput.txt";

describe("day19", () => {
  it.each`
    towel         | desired        | index | expected
    ${"fa"} | ${"fajog"}   | ${0}  | ${true}
    ${"fa"} | ${"fajog"}   | ${1}  | ${false}
    ${"jo"} | ${"fajog"}   | ${2}  | ${true}
    ${"jb"} | ${"fajog"}   | ${2}  | ${false}
    ${"jb"} | ${"fajogjb"} | ${2}  | ${false}
    ${"jb"} | ${"fajogjb"} | ${5}  | ${true}
  `(
    "canMakeNextPartOfPattern $towel in $desired at $index = $expected",
    ({ towel, desired, index, expected }) => {
      const result = canMakeNextPartOfPattern(towel, desired, index);

      expect(result).toBe(expected);
    },
  );

  it.each`
    towelSet                                          | desired     | expected
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${"brwrr"}  | ${2}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${"bggr"}   | ${1}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${"gbbr"}   | ${4}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${"rrbgbr"} | ${6}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${"ubwu"}   | ${0}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${"bwurrg"} | ${1}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${"brgr"}   | ${2}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${"bbrgwb"} | ${0}
    ${["r", "wr", "b", "g", "bwu", "rb", "gb", "br"]} | ${"bwurrg"} | ${1}
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

  it("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day19(TEST_INPUT_FILE);

    expect(part2).toBe(16);
  });
});
