import dayX, { loadRightAndLeftLists }  from "./index";

const TEST_INPUT_FILE = "./src/2024/day1/testInput.txt";

describe("day1", () => {
  describe("day1", () => {
    it("Loads right and left number lists correctly", async () => {
      const [left, right] = await loadRightAndLeftLists(TEST_INPUT_FILE); 

      expect(left).toStrictEqual([3,4,2,1,3,3]);
      expect(right).toStrictEqual([4,3,5,3,9,3]);
    });

    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await dayX(TEST_INPUT_FILE);

      expect(part1).toBe(11);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await dayX(TEST_INPUT_FILE);

      expect(part2).toBe(31);
    });
  });
});
