import day7 from "./index";

const TEST_INPUT_FILE = "./src/2024/day7/testInput.txt";

describe("day7", () => {
  describe("day7", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day7(TEST_INPUT_FILE);

      expect(part1).toBe(1);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day7(TEST_INPUT_FILE);

      expect(part2).toBe(1);
    });
  });
});
