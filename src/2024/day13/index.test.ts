import day13, {
  calcWaysToWin,
  parseButtonBehaviour,
  parsePrizeAt,
  cheapestWinCost,
  isValidWayToWin,
  parseClawMachinesFile,
  solveSimultaneousEquations,
} from "./index";

const TEST_INPUT_FILE = "./src/2024/day13/testInput.txt";
const MAIN_INPUT_FILE = "./src/2024/day13/input.txt";

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
  const TEST_CLAW_MACHINE_3: ClawMachine = {
    buttonA: { x: 12, y: 16 },
    buttonB: { x: 5, y: 7 },
    prizeAt: { x: 56, y: 76 },
  };

  it("solveSimultaneousEquations", () => {
    const { a, b } = solveSimultaneousEquations(TEST_CLAW_MACHINE_3);
    expect(a).toBe(3);
    expect(b).toBe(4);
  });

  it("cheapestWinCost", () => {
    const result = cheapestWinCost(TEST_CLAW_MACHINE_1);

    expect(result).toBe(280);
  });

  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day13(MAIN_INPUT_FILE);

    expect(part1).toBe(35082);
  });

  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day13(TEST_INPUT_FILE);

    expect(part1).toBe(480);
  });

});
