import { AdventFunction } from "../../common/types";
import { loadFileInChunks } from "../../common/processFile";
import { isDivisibleBy } from '../../common/numericUtils';

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

export function validWaysToPressA(a: number, b: number, target: number): Set<number> {
  const waysToPress: Set<number> = new Set();

  const max = Math.floor(target / a);

  for (let i=0; i<max; i++) {
    const diff = target - (a * i);
    if (isDivisibleBy(diff, b)) {
      waysToPress.add(i);
    }
  }

  return waysToPress;
}

export function calcWaysToWin(clawMachine: ClawMachine): WayToWin[] {
  const {buttonA, buttonB, prizeAt} = clawMachine;
  const waysToGetX = validWaysToPressA(buttonA.x, buttonB.x, prizeAt.x);
  const waysToGetY = validWaysToPressA(buttonA.y, buttonB.y, prizeAt.y);
  
  const waysToPressA = new Set([...waysToGetX].filter(x => waysToGetY.has(x)));

  const waysToWin: WayToWin[] = [];
  for (let a of waysToPressA) {
    const b = (prizeAt.x - (a * buttonA.x)) / buttonB.x

    waysToWin.push({a, b});
  }

  return waysToWin;
}

export const UNSOLVEABLE = 0;
export function cheapestWinCost(clawMachine: ClawMachine): number {
  let result = UNSOLVEABLE;

  const waysToWin = calcWaysToWin(clawMachine);
  for (let {a, b} of waysToWin) {
    const cost = a * TOKEN_COST_A + b * TOKEN_COST_B;
    if (result === UNSOLVEABLE) {
      result = cost;
    } else if (result > cost) {
      result = cost;
    }
  }

  return result;
}

export async function parseClawMachinesFile(filename: string): Promise<ClawMachine[]> {
  return (await loadFileInChunks(filename, 4)).map(parseClawMachine);
}

const day13: AdventFunction = async (
  filename = "./src/2024/day13/input.txt",
) => {
  const clawMachines = await parseClawMachinesFile(filename);

  const part1 = clawMachines
  .map(cheapestWinCost)
  .reduce((acc, curr) => acc + curr, 0);

  return [part1, 1];
};

export default day13;
