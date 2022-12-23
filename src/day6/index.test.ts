import day6, { findEndOfFirstXDifferent } from "./index";

describe("day6", () => {
  describe("Day 6", () => {
    it.each`
      input                                  | expected
      ${"mjqjpqmgbljsphdztnvjfqwrcgsmlb"}    | ${7}
      ${"bvwbjplbgvbhsrlpgdmjqwftvncz"}      | ${5}
      ${"nppdvjthqldpwncqszvftbrmjlhg"}      | ${6}
      ${"nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"} | ${10}
      ${"zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"}  | ${11}
    `("$input", ({ input, expected }) => {
      const result = findEndOfFirstXDifferent(input, 4);
      expect(result).toBe(expected);
    });

    it.each`
      input                                  | expected
      ${"mjqjpqmgbljsphdztnvjfqwrcgsmlb"}    | ${19}
      ${"bvwbjplbgvbhsrlpgdmjqwftvncz"}      | ${23}
      ${"nppdvjthqldpwncqszvftbrmjlhg"}      | ${23}
      ${"nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"} | ${29}
      ${"zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"}  | ${26}
    `("$input", ({ input, expected }) => {
      const result = findEndOfFirstXDifferent(input, 14);
      expect(result).toBe(expected);
    });

    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day6("./src/day6/testInput.txt");

      expect(part1).toBe(7);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day6("./src/day6/testInput.txt");

      expect(part2).toBe(1);
    });
  });
});
