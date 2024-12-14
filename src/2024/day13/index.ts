import { AdventFunction } from "../../common/types";
import { loadFileInChunks } from "../../common/processFile";
import { lcmMultiples } from "../../common/numericUtils";

const TOKEN_COST_A = 3;
const TOKEN_COST_B = 1;

const MAX_BUTTON_PUSHES = 100;

export interface Coordinate {
  x: number;
  y: number;
}

export interface WayToWin {
  a: number;
  b: number;
}
const wayToWinToStr = ({ a, b }: WayToWin) => `${a}=${b}`;

export interface ClawMachine {
  buttonA: Coordinate;
  buttonB: Coordinate;
  prizeAt: Coordinate;
}

function parseDelta(input: string, delim: string): number {
  return parseInt(input.split(delim)[1]);
}

export function parseCoordinate(input: string, delim: string): Coordinate {
  const parts = input.split(":").map((p) => p.trim());
  const deltas = parts[1].split(",").map((p) => p.trim());

  return {
    x: parseDelta(deltas[0], delim),
    y: parseDelta(deltas[1], delim),
  };
}
export function parseButtonBehaviour(input: string): Coordinate {
  return parseCoordinate(input, "+");
}

export function parsePrizeAt(input: string): Coordinate {
  return parseCoordinate(input, "=");
}

export function parseClawMachine(lines: string[]): ClawMachine {
  const buttonA: Coordinate = parseButtonBehaviour(lines[0]);
  const buttonB: Coordinate = parseButtonBehaviour(lines[1]);
  const prizeAt: Coordinate = parsePrizeAt(lines[2]);

  return {
    buttonA,
    buttonB,
    prizeAt,
  };
}

export function solveSimultaneousEquations({
  buttonA,
  buttonB,
  prizeAt,
}: ClawMachine): WayToWin {
  const [a_x, b_x] = lcmMultiples(buttonA.x, buttonA.y);

  const prizeTerm = a_x * prizeAt.x - b_x * prizeAt.y;
  const bTerm = a_x * buttonB.x - b_x * buttonB.y;

  let b = prizeTerm / bTerm;
  let a = (prizeAt.x - b * buttonB.x) / buttonA.x;

  return { a: Math.floor(a), b: Math.floor(b) };
}

export function getCost({ a, b }: WayToWin): number {
  return a * TOKEN_COST_A + b * TOKEN_COST_B;
}

export function isFeasibleWayToWin({ a, b }: WayToWin): boolean {
  return a <= MAX_BUTTON_PUSHES && b <= MAX_BUTTON_PUSHES;
}

export const UNSOLVEABLE = 0;
export function cheapestWinCost(clawMachine: ClawMachine): number {
  const wayToWin = solveSimultaneousEquations(clawMachine);

  if (!!wayToWin && isValidWayToWin(clawMachine, wayToWin)) {
    return getCost(wayToWin);
  } else {
    return UNSOLVEABLE;
  }
}

export async function parseClawMachinesFile(
  filename: string,
): Promise<ClawMachine[]> {
  return (await loadFileInChunks(filename, 4)).map(parseClawMachine);
}

export function isValidWayToWin(clawMachine: ClawMachine, wayToWin: WayToWin) {
  if (wayToWin.a <=0 || wayToWin.b <= 0) return false;

  const x =
    clawMachine.buttonA.x * wayToWin.a + clawMachine.buttonB.x * wayToWin.b;
  const y =
    clawMachine.buttonA.y * wayToWin.a + clawMachine.buttonB.y * wayToWin.b;

  return x === clawMachine.prizeAt.x && y === clawMachine.prizeAt.y;
}

const OFFSET = 10000000000000;

function applyOffset(machine: ClawMachine): ClawMachine {
  return {
    ...machine,
    prizeAt: {
      x: machine.prizeAt.x + OFFSET,
      y: machine.prizeAt.y + OFFSET
    }
  }
}

const day13: AdventFunction = async (
  filename = "./src/2024/day13/input.txt",
) => {
  const clawMachines = await parseClawMachinesFile(filename);

  const part1 = clawMachines
    .map(cheapestWinCost)
    .reduce((acc, curr) => acc + curr, 0);

  const part2 = clawMachines
    .map(applyOffset)
    .map(cheapestWinCost)
    .reduce((acc, curr) => acc + curr, 0);

  return [part1, part2];
};

export default day13;
