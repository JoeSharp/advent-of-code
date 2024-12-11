import day11, {
  hasEvenNumberDigits,
  splitNumber,
  blinkAtStones,
  blinkAtStonesRepeatedly,
} from "./index";

const MAIN_INPUT_FILE = "./src/2024/day11/input.txt";
const TEST_INPUT_FILE = "./src/2024/day11/testInput.txt";

describe("day11", () => {
  it.each`
    input                    | expected
    ${[0, 1, 10, 99, 999]}   | ${[1, 2024, 1, 0, 9, 9, 2021976]}
    ${[253, 0, 2024, 14168]} | ${[512072, 1, 20, 24, 28676032]}
  `("blinkAtStones $input => $expected", ({ input, expected }) => {
    const result = blinkAtStones(input);

    expect(result).toStrictEqual(expected);
  });

  it.each`
    input        | times | expected
    ${[125, 17]} | ${6}  | ${22}
  `("blinkAtStones $input => $expected", ({ input, times, expected }) => {
    const result = blinkAtStonesRepeatedly(input, times);

    expect(result).toBe(expected);
  });

  it.each`
    input   | expected
    ${1}    | ${false}
    ${45}   | ${true}
    ${398}  | ${false}
    ${2987} | ${true}
  `("hasEvenNumberDigits $input = $expected", ({ input, expected }) => {
    const result = hasEvenNumberDigits(input);

    expect(result).toBe(expected);
  });

  it.each`
    input   | expected
    ${34}   | ${[3, 4]}
    ${1000} | ${[10, 0]}
    ${4567} | ${[45, 67]}
  `("splitNumber $input = $expected", ({ input, expected }) => {
    const result = splitNumber(input);

    expect(result).toStrictEqual(expected);
  });

  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day11(TEST_INPUT_FILE);

    expect(part1).toBe(55312);
  });

  it("handles main input for part 1 correctly", async () => {
    const [part1] = await day11(MAIN_INPUT_FILE);

    expect(part1).toBe(202019);
  });

  it.skip("handles main input for part 2 correctly", async () => {
    const [, part2] = await day11(MAIN_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
