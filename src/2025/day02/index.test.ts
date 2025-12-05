import dayX, { isInvalidIdPartOne, isInvalidIdPartTwo } from "./index";

const TEST_INPUT_FILE = "./src/2025/day02/testInput.txt";

describe("day02", () => {
  it.each`
  input | expected
  ${11} | ${true}
  ${1010} | ${true}
  ${34} | ${false}
  ${87638763} | ${true}
  ${7638763} | ${false}
  `("$input isInvalidIdPartOne = $expected", ({ input, expected}) => {
    const result = isInvalidIdPartOne(input);

    expect(result).toBe(expected);
  });

  it.each`
  input | expected
  ${11} | ${true}
  ${1010} | ${true}
  ${34} | ${false}
  ${87638763} | ${true}
  ${7638763} | ${false}
  ${12341234} | ${true}
  ${123123123} | ${true}
  ${1212121212} | ${true}
  ${1111111} | ${true}
  `("$input isInvalidIdPartTwo = $expected", ({ input, expected}) => {
    const result = isInvalidIdPartTwo(input);

    expect(result).toBe(expected);
  });

  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await dayX(TEST_INPUT_FILE);

    expect(part1).toBe(1227775554);
  });

  it("handles demo input for part 2 correctly", async () => {
    const [, part2] = await dayX(TEST_INPUT_FILE);

    expect(part2).toBe(4174379265);
  });
});
