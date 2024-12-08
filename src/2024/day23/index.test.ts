import day23 from "./index";

const TEST_INPUT_FILE = "./src/2024/day23/testInput.txt";

describe("day23", () => {
  describe("day23", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day23(TEST_INPUT_FILE);

      expect(part1).toBe(1);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day23(TEST_INPUT_FILE);

      expect(part2).toBe(1);
    });
  });
});
