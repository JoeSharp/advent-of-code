import day5 from "./index";

const TEST_INPUT_FILE = "./src/2024/day5/testInput.txt";

describe("day5", () => {
  describe("day5", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day5(TEST_INPUT_FILE);

      expect(part1).toBe(1);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day5(TEST_INPUT_FILE);

      expect(part2).toBe(1);
    });
  });
});
