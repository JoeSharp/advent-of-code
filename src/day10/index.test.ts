import day10, { CommandType, parseCommand } from "./index";

describe("day10", () => {
  describe("Day X", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day10("./src/day10/testInput.txt");

      expect(part1).toBe(13140);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day10("./src/day10/testInput.txt");

      expect(part2).toBe(1);
    });
  });

  describe("parseCommand", () => {
    it.each`
      input         | expected
      ${"noop"}     | ${{ type: CommandType.noop }}
      ${"addx 8"}   | ${{ type: CommandType.addx, amount: 8 }}
      ${"addx -98"} | ${{ type: CommandType.addx, amount: -98 }}
    `("$input", ({ input, expected }) => {
      const result = parseCommand(input);
      expect(result).toStrictEqual(expected);
    });
  });
});
