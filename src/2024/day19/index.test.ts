import day19 from "./index";

const TEST_INPUT_FILE = "./src/2024/day19/testInput.txt";

describe("day19", () => {
  describe("day19", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day19(TEST_INPUT_FILE);

      expect(part1).toBe(1);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day19(TEST_INPUT_FILE);

      expect(part2).toBe(1);
    });
  });
});
