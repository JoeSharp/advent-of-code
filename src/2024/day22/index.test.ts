import day22, { calculateNextSecretNumber } from "./index";

const TEST_INPUT_FILE = "./src/2024/day22/testInput.txt";

describe("day22", () => {
  it.each`
    input       | expected
    ${123}      | ${15887950}
    ${15887950} | ${16495136}
    ${16495136} | ${527345}
    ${527345}   | ${704524}
    ${704524}   | ${1553684}
  `(
    "calculates next secret number for $input = $expected",
    ({ input, expected }) => {
      const result = calculateNextSecretNumber(input);

      expect(result).toBe(expected);
    },
  );

  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day22(TEST_INPUT_FILE);

    expect(part1).toBe(1);
  });

  it.skip("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day22(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
