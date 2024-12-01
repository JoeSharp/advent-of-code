import day5, {
  constructExpectedStackCountLine,
  executeStepPartOne,
  executeStepPartTwo,
  parseStackLine,
  parseStep,
  processStackLines,
} from "./index";

describe("day5", () => {
  describe("Day 5", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day5("./src/2022/day5/testInput.txt");

      expect(part1).toBe("CMZ");
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day5("./src/2022/day5/testInput.txt");

      expect(part2).toBe("MCD");
    });
  });

  describe("parseStep", () => {
    it.each`
      input                     | expected
      ${"move 1 from 2 to 1"}   | ${{ move: 1, from: 2, to: 1 }}
      ${"move 7 from 9 to 6"}   | ${{ move: 7, from: 9, to: 6 }}
      ${"move 78 from 2 to 1"}  | ${{ move: 78, from: 2, to: 1 }}
      ${"move 1 from 25 to 19"} | ${{ move: 1, from: 25, to: 19 }}
    `("$input", ({ input, expected }) => {
      const result = parseStep(input);
      expect(result).toStrictEqual(expected);
    });

    it("Throws error for invalid input", () => {
      expect(() => parseStep("foo bar car")).toThrowError();
    });
  });

  describe("parseStackLine", () => {
    it.each`
      input             | expected
      ${"    [D]    "}  | ${[null, "D", null]}
      ${"[N] [C]    "}  | ${["N", "C", null]}
      ${"[Z] [M] [P] "} | ${["Z", "M", "P"]}
    `("$input should give $expected", ({ input, expected }) => {
      const result = parseStackLine(input);
      expect(result).toStrictEqual(expected);
    });
  });

  describe("constructExpectedStackCountLine", () => {
    it("constructs correct string", () => {
      const result = constructExpectedStackCountLine(4);
      expect(result).toBe("1   2   3   4");
    });
  });

  describe("processStackLines", () => {
    it("processes a set of stack lines", () => {
      const stackLines = ["    [D]    ", "[N] [C]    ", "[Z] [M] [P] "].map(
        parseStackLine,
      );

      const stacks = processStackLines(3, stackLines);

      expect(stacks).toStrictEqual([["N", "Z"], ["D", "C", "M"], ["P"]]);
    });
  });

  describe("executeStepPartOne", () => {
    it("can move an item between stacks", () => {
      const stacks = [
        ["A", "B", "C"],
        ["D", "E", "F"],
        ["G", "H", "I"],
      ];

      executeStepPartOne({ move: 1, from: 2, to: 3 }, stacks);

      expect(stacks).toStrictEqual([
        ["A", "B", "C"],
        ["E", "F"],
        ["D", "G", "H", "I"],
      ]);
    });

    it("can move multiple items between stacks", () => {
      const stacks = [
        ["A", "B", "C"],
        ["D", "E", "F", "X", "Y", "Z"],
        ["G", "H", "I"],
      ];

      executeStepPartOne({ move: 3, from: 2, to: 3 }, stacks);

      expect(stacks).toStrictEqual([
        ["A", "B", "C"],
        ["X", "Y", "Z"],
        ["F", "E", "D", "G", "H", "I"],
      ]);
    });
  });

  describe("executeStepPartTwo", () => {
    it("can move an item between stacks", () => {
      const stacks = [
        ["A", "B", "C"],
        ["D", "E", "F"],
        ["G", "H", "I"],
      ];

      executeStepPartTwo({ move: 1, from: 2, to: 3 }, stacks);

      expect(stacks).toStrictEqual([
        ["A", "B", "C"],
        ["E", "F"],
        ["D", "G", "H", "I"],
      ]);
    });

    it("can move multiple items between stacks", () => {
      const stacks = [
        ["A", "B", "C"],
        ["D", "E", "F", "X", "Y", "Z"],
        ["G", "H", "I"],
      ];

      executeStepPartTwo({ move: 3, from: 2, to: 3 }, stacks);

      expect(stacks).toStrictEqual([
        ["A", "B", "C"],
        ["X", "Y", "Z"],
        ["D", "E", "F", "G", "H", "I"],
      ]);
    });
  });
});
