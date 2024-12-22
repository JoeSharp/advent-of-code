import day21, {
  calculateChainedButtons,
  extractNumeric,
  enterChainedCode,
  findDigitButton,
  findArrowButton,
} from "./index";

const TEST_INPUT_FILE = "./src/2024/day21/testInput.txt";

describe("day21", () => {
  it.each`
    input     | expected
    ${[0, 0]} | ${"7"}
    ${[0, 1]} | ${"8"}
    ${[0, 2]} | ${"9"}
    ${[1, 0]} | ${"4"}
    ${[1, 1]} | ${"5"}
    ${[1, 2]} | ${"6"}
    ${[2, 0]} | ${"1"}
    ${[2, 1]} | ${"2"}
    ${[2, 2]} | ${"3"}
    ${[3, 1]} | ${"0"}
    ${[3, 2]} | ${"A"}
  `("findDigitButton $input = $expected", ({ input, expected }) => {
    const result = findDigitButton(input);
    expect(result).toBe(expected);
  });
  it.each`
    input     | expected
    ${[0, 1]} | ${"^"}
    ${[0, 2]} | ${"A"}
    ${[1, 0]} | ${"<"}
    ${[1, 1]} | ${"v"}
    ${[1, 2]} | ${">"}
  `("findArrowButton $input = $expected", ({ input, expected }) => {
    const result = findArrowButton(input);
    expect(result).toBe(expected);
  });

  /*
    ${"029A"} | ${"<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A"}
    ${"980A"} | ${"<v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A"}
    ${"179A"} | ${"<v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A"}
    ${"456A"} | ${"<v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A"}
    */
  it.only.each`
    input     | expected
    ${"379A"} | ${"<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A"}
  `("calculates chained button presses for $input", ({ input, expected }) => {
    const result = calculateChainedButtons(input);
    const reversed = enterChainedCode(result);
    const reversedExp = enterChainedCode(expected);

    expect(result.length).toBe(expected.length);
    //console.log(`${expected}\n${result}\n`);

    expect(reversed).toBe(input);
    expect(reversedExp).toBe(input);
  });

  it.each`
    input     | expected
    ${"029A"} | ${29}
    ${"179A"} | ${179}
    ${"456A"} | ${456}
    ${"379A"} | ${379}
  `("extractNumeric for $input = $expected", ({ input, expected }) => {
    const result = extractNumeric(input);
    expect(result).toBe(expected);
  });

  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day21(TEST_INPUT_FILE);

    expect(part1).toBe(126384);
  });

  it.skip("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day21(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
