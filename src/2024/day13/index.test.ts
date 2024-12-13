import day13, { calcWaysToWin, parseButtonBehaviour, parsePrizeAt, minTokens, validWaysToPressA } from "./index";

const TEST_INPUT_FILE = "./src/2024/day13/testInput.txt";

describe("day13", () => {
  it("parseButtonBehaviour", () => {
    const result = parseButtonBehaviour("Button A: X+94, Y+34");

    expect(result).toStrictEqual({
      x: 94,
      y: 34,
    });
  });

  it("parsePrizeAt", () => {
    const result = parsePrizeAt("Prize: X=12748, Y=12176");

    expect(result).toStrictEqual({
      x: 12748,
      y: 12176,
    });
  });

  const TEST_CLAW_MACHINE_1: ClawMachine = {
    buttonA: { x: 94, y: 34 },
    buttonB: { x: 22, y: 67 },
    prizeAt: { x: 8400, y: 5400 },
  };

  it("validWaysToPressA", () => {
    const {buttonA, buttonB, prizeAt} = TEST_CLAW_MACHINE_1;
    const result = validWaysToPressA(buttonA.x, buttonB.x, prizeAt.x);

    expect(result.has(80)).toBeTruthy();
  });

  it('waysToWin', () => {
    const result = calcWaysToWin(TEST_CLAW_MACHINE_1);

    console.log(result);
    expect(result).toBeDefined();
  });

  it("minTokens", () => {
    const result = minTokens(TEST_CLAW_MACHINE_1);

    expect(result).toBe(280);
  });

  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day13(TEST_INPUT_FILE);

    expect(part1).toBe(480);
  });

  it.skip("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day13(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
