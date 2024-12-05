import day6 from "./index";

const TEST_INPUT_FILE = "./src/2024/day6/testInput.txt";

describe("day6", () => {
  describe("day6", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day6(TEST_INPUT_FILE);

      expect(part1).toBe(1);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day6(TEST_INPUT_FILE);

      expect(part2).toBe(1);
    });
  });
});
