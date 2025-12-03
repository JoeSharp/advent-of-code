import dayX, { parseDialTurn, turnDial } from "./index";

const TEST_INPUT_FILE = "./src/2025/day01/testInput.txt";

describe("day01", () => {
  it.each`
    input    | expected
    ${"R43"} | ${{ direction: 1, amount: 43 }}
    ${"L78"} | ${{ direction: -1, amount: 78 }}
  `("$input", ({ input, expected }) => {
    const result = parseDialTurn(input);

    expect(result).toStrictEqual(expected);
  });

  it.each`
    value | turn                             | expected
    ${4}  | ${{ direction: 1, amount: 54 }}  | ${58}
    ${45} | ${{ direction: -1, amount: 13 }} | ${32}
    ${99} | ${{ direction: 1, amount: 2 }}   | ${1}
    ${2}  | ${{ direction: -1, amount: 5 }}  | ${97}
  `(
    "$value -> $turn.direction by $turn.amount = $expected",
    ({ value, turn, expected }) => {
      const result = turnDial({ value, landZero: 0, passZero: 0 }, turn);

      expect(result.value).toBe(expected);
    }
  );

  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await dayX(TEST_INPUT_FILE);

    expect(part1).toBe(3);
  });

  it.only("handles demo input for part 2 correctly", async () => {
    const [, part2] = await dayX(TEST_INPUT_FILE);

    expect(part2).toBe(6);
  });
});
