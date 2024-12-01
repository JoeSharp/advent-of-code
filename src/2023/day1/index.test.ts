import day1, { findDigit, findDigitText } from "./index";

describe("Day 1", () => {
  it.each`
    input       | expected
    ${"1"}      | ${1}
    ${"2stuff"} | ${2}
    ${"foo9"}   | ${-1}
    ${"bar"}    | ${-1}
  `("findDigit $input $expected", ({ input, expected }) => {
    const result = findDigit(input);

    expect(result).toBe(expected);
  });
  it.each`
    input          | expected
    ${"1"}         | ${1}
    ${"2stuff"}    | ${2}
    ${"foo9"}      | ${-1}
    ${"bar"}       | ${-1}
    ${"sixfoo9"}   | ${6}
    ${"fivebar"}   | ${5}
    ${"sevennine"} | ${7}
    ${"fooeigth"}  | ${-1}
  `("findDigitText $input $expected", ({ input, expected }) => {
    const result = findDigitText(input);

    expect(result).toBe(expected);
  });
  it("Calculates the example correctly", async () => {
    const [part1] = await day1("./src/2023/day1/testInput1.txt");
    expect(part1).toBe(142);
  });
  it("Calculates the example correctly", async () => {
    const [_, part2] = await day1("./src/2023/day1/testInput2.txt");
    expect(part2).toBe(281);
  });
});
