import day14 from "./index";

describe("day14", () => {
  describe("day14", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day14("./src/day14/testInput.txt");

      expect(part1).toBe(1);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day14("./src/day14/testInput.txt");

      expect(part2).toBe(1);
    });
  });
});
