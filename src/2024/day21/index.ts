import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";
import {
  Position,
  dirToShortStr,
  dirFromShortStr,
  NORTH,
  SOUTH,
  EAST,
  WEST,
} from "../../common/arrayUtils";

export const BUTTON_A = "A";

function fromToStr(from: string, to: string): string {
  return `${from}-${to}`;
}

// Avoid bottom left
const digitLocations: Map<string, Position> = new Map();
digitLocations.set(BUTTON_A, [3, 2]);
digitLocations.set("0", [3, 1]);
digitLocations.set("1", [2, 0]);
digitLocations.set("2", [2, 1]);
digitLocations.set("3", [2, 2]);
digitLocations.set("4", [1, 0]);
digitLocations.set("5", [1, 1]);
digitLocations.set("6", [1, 2]);
digitLocations.set("7", [0, 0]);
digitLocations.set("8", [0, 1]);
digitLocations.set("9", [0, 2]);

// Avoid top left
const arrowLocations: Map<string, Position> = new Map();
arrowLocations.set(BUTTON_A, [0, 2]);
arrowLocations.set(dirToShortStr(NORTH), [0, 1]);
arrowLocations.set(dirToShortStr(WEST), [1, 0]);
arrowLocations.set(dirToShortStr(SOUTH), [1, 1]);
arrowLocations.set(dirToShortStr(EAST), [1, 2]);

function posDiff(a: Position, b: Position): Position {
  return a.map((av, ai) => b[ai] - av) as Position;
}

const dirForDigitsCache: Map<string, string[]> = new Map();
const dirForDirCache: Map<string, string[]> = new Map();

export function getFromAtoB(
  a: string,
  b: string,
  buttonLocations: Map<string, Position>,
  cache: Map<string, string[]>,
): string[] {
  const asStr = fromToStr(a, b);
  if (cache.has(asStr)) {
    return cache.get(asStr) || [];
  }
  const result: string[] = [];

  const aLocation = buttonLocations.get(a);
  const bLocation = buttonLocations.get(b);

  if (!aLocation || !bLocation) throw new Error(`Could not find location for a: ${a} and b:${b}`);

  const [vert, horz] = posDiff(aLocation, bLocation);

  const vertDirection = vert > 0 ? SOUTH : NORTH;
  const horzDirection = horz > 0 ? EAST : WEST;

  for (let i = 0; i < Math.abs(vert); i++) {
    result.push(dirToShortStr(vertDirection));
  }
  for (let i = 0; i < Math.abs(horz); i++) {
    result.push(dirToShortStr(horzDirection));
  }

  cache.set(asStr, result);

  return result;
}

export function enterCode(
  code: string[],
  buttonLocations: Map<string, Position>,
  cache: Map<string, string[]>,
): string[] {
  let result: string[] = [];
  let current = BUTTON_A;

  for (let i = 0; i < code.length; i++) {
    const forTransition = getFromAtoB(current, code[i], buttonLocations, cache);
    forTransition.forEach((b) => result.push(b));
    result.push(BUTTON_A);

    current = code[i];
  }
  return result;
}

export function calcButtonsToHitDigits(digits: string[]): string[] {
  return enterCode(digits, digitLocations, dirForDigitsCache);
}

export function calButtonsToHitDirections(directions: string[]): string[] {
  return enterCode(directions, arrowLocations, dirForDirCache);
}

export function calculateButtonPresses(pinCode: string): string {
  const digits = pinCode.split("");

  const robot1 = calcButtonsToHitDigits(digits);
  const robot2 = calButtonsToHitDirections(robot1);
  const robot3 = calButtonsToHitDirections(robot2);
  console.log("Calc Button Presses", { pinCode, robot1, robot2, robot3 });

  return robot3.join("");
}

export function extractNumeric(pinCode: string): number {
  return parseInt(pinCode.replaceAll("A", ""));
}

export function calculateComplexity(pinCode: string): number {
  const sequence = calculateButtonPresses(pinCode);
  const numericPart = extractNumeric(pinCode);
  console.log("Calculate Complexity", {
    pinCode,
    sequence,
    len: sequence.length,
    numericPart,
  });

  return sequence.length * numericPart;
}

const day21: AdventFunction = async (
  filename = "./src/2024/day21/input.txt",
) => {
  const part1 = (await loadEntireFile(filename))
    .map((d) => calculateComplexity(d))
    .reduce((acc, curr) => acc + curr, 0);

  return [part1, 1];
};

export default day21;
