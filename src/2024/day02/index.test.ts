import day2, { xor, allOneDirection, parseListOfNumbers } from "./index";

const TEST_INPUT_FILE = "./src/2024/day02/testInput.txt";

describe("day2", () => {
  describe("xor", () => {
    it.each`
      a        | b        | expected
      ${false} | ${false} | ${false}
      ${false} | ${true}  | ${true}
      ${true}  | ${false} | ${true}
      ${true}  | ${true}  | ${false}
    `("a: $a XOR b: $b = $expected", ({ a, b, expected }) => {
      const result = xor(a, b);
      expect(result).toBe(expected);
    });
  });
  describe("allOneDirection", () => {
    it.each`
      input              | expected
      ${[1, 2, 3, 4]}    | ${true}
      ${[1, 2, 5, 4]}    | ${false}
      ${[4, 3, 2, 1]}    | ${true}
      ${[4, 3, 5, 2, 1]} | ${false}
    `("${input}: ${expected}", ({ input, expected }) => {
      const result = allOneDirection(input);
      expect(result).toBe(expected);
    });
  });

  describe("parts", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day2(TEST_INPUT_FILE);

      expect(part1).toBe(2);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day2(TEST_INPUT_FILE);

      expect(part2).toBe(4);
    });
  });
});
