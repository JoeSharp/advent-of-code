import day13, {
  calcWaysToWin,
  parseButtonBehaviour,
  parsePrizeAt,
  cheapestWinCost,
  validateWayToWin,
  parseClawMachinesFile
} from "./index";

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
  const TEST_CLAW_MACHINE_2: ClawMachine = {
    buttonA: { x: 50, y: 78 },
    buttonB: { x: 80, y: 26 },
    prizeAt: { x: 5740, y: 3718 },
  };

  it.each`
    machine
    ${TEST_CLAW_MACHINE_2}
    ${TEST_CLAW_MACHINE_1}
  `("waysToWin", ({ machine }) => {
    const result = calcWaysToWin(machine);
    expect(result).toHaveLength(1);
  });

  it("cheapestWinCost", () => {
    const result = cheapestWinCost(TEST_CLAW_MACHINE_1);

    expect(result).toBe(280);
  });

  it("generates working results for part 1", async () => {
    const clawMachines = await parseClawMachinesFile(TEST_INPUT_FILE);
    clawMachines.forEach((clawMachine) => {
      const waysToWin = calcWaysToWin(clawMachine);

      expect(waysToWin.length).toBeLessThan(2);

      if (waysToWin.length > 0) {
        const wayToWin = waysToWin[0];

        const result = validateWayToWin(clawMachine, wayToWin);
        expect(result).toBeTruthy();
      }
    });
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
