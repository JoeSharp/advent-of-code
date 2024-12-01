import day10, { CommandType, composeImage, parseCommand } from "./index";

describe("day10", () => {
  describe("Day X", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day10("./src/2022/day10/testInput.txt");

      expect(part1).toBe(13140);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day10("./src/2022/day10/testInput.txt");

      expect(part2).toStrictEqual(
        "\n" +
          [
            "##..##..##..##..##..##..##..##..##..##..",
            "###...###...###...###...###...###...###.",
            "####....####....####....####....####....",
            "#####.....#####.....#####.....#####.....",
            "######......######......######......###.", // The site things this last one should be a #?
            "#######.......#######.......#######.....",
          ].join("\n"),
      );
    });
  });

  describe("composeImage", () => {
    it("works on test data", async () => {
      const result = await composeImage("./src/2022/day10/testInput.txt", 40);
      expect(result).toStrictEqual([
        "##..##..##..##..##..##..##..##..##..##..",
        "###...###...###...###...###...###...###.",
        "####....####....####....####....####....",
        "#####.....#####.....#####.....#####.....",
        "######......######......######......###.",
        "#######.......#######.......#######.....",
      ]);
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
