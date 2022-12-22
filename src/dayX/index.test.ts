import dayX from "./index";

describe("dayX", () => {
  describe("Day X", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await dayX("./src/dayX/testInput.txt");

      expect(part1).toBe(1);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await dayX("./src/dayX/testInput.txt");

      expect(part2).toBe(1);
    });
  });
});
