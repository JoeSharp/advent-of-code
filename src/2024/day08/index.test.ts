import day8 from "./index";

const TEST_INPUT_FILE = "./src/2024/day8/testInput.txt";

describe("day8", () => {
  describe("day8", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day8(TEST_INPUT_FILE);

      expect(part1).toBe(14);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day8(TEST_INPUT_FILE);

      expect(part2).toBe(34);
    });
  });
});
