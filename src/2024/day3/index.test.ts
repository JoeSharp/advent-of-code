import day3 from "./index";

const TEST_INPUT_FILE_1 = "./src/2024/day3/testInput1.txt";
const TEST_INPUT_FILE_2 = "./src/2024/day3/testInput2.txt";

describe("day3", () => {
  describe("day3", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day3(TEST_INPUT_FILE_1);

      expect(part1).toBe(161);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day3(TEST_INPUT_FILE_2);

      expect(part2).toBe(48);
    });
  });
});
