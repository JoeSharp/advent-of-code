import day8, { readGridOfNumbers } from "./index";

describe("day8", () => {
  describe("Day 8", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day8("./src/day8/testInput.txt");

      expect(part1).toBe(1);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day8("./src/day8/testInput.txt");

      expect(part2).toBe(1);
    });
  });

  describe("readGridOfNumbers", () => {
    it("handles test input", async () => {
      const grid = await readGridOfNumbers("./src/day8/testInput.txt");

      expect(grid).toStrictEqual([
        [3, 0, 3, 7, 3],
        [2, 5, 5, 1, 2],
        [6, 5, 3, 3, 2],
        [3, 3, 5, 4, 9],
        [3, 5, 3, 9, 0],
      ]);
    });
  });
});
