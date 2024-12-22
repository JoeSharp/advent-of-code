import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";
import {
  Position,
  posEqual,
  dirToShortStr,
  dirFromShortStr,
  applyDirection,
  NORTH,
  SOUTH,
  EAST,
  WEST,
} from "../../common/arrayUtils";

export const BUTTON_A = "A";
export const EMPTY_BUTTON = ".";

function fromToStr(from: string, to: string): string {
  return `${from}-${to}`;
}

export function findButton(
  button: Position,
  buttons: Map<string, Position>,
): string {
  for (let [k, v] of buttons) {
    if (posEqual(button, v)) {
      return k;
    }
  }

  throw new Error(`Cannot find button at location ${dirToShortStr(button)}`);
}

export function findDigitButton(button: Position): string {
  return findButton(button, digitLocations);
}
export function findArrowButton(button: Position): string {
  return findButton(button, arrowLocations);
}

// Avoid bottom left
const digitLocations: Map<string, Position> = new Map();
digitLocations.set("0", [3, 1]);
digitLocations.set(BUTTON_A, [3, 2]);
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
arrowLocations.set(dirToShortStr(NORTH), [0, 1]);
arrowLocations.set(BUTTON_A, [0, 2]);
arrowLocations.set(dirToShortStr(WEST), [1, 0]);
arrowLocations.set(dirToShortStr(SOUTH), [1, 1]);
arrowLocations.set(dirToShortStr(EAST), [1, 2]);

function posDiff(a: Position, b: Position): Position {
  return a.map((av, ai) => b[ai] - av) as Position;
}

const dirForDigitsCache: Map<string, string[]> = new Map();
// Top Row
dirForDigitsCache.set(fromToStr("9", "0"), "<vvv".split(""));
dirForDigitsCache.set(fromToStr("9", BUTTON_A), "vvv".split(""));
dirForDigitsCache.set(fromToStr("8", "0"), "vvv".split(""));
dirForDigitsCache.set(fromToStr("8", BUTTON_A), ">vvv".split(""));
dirForDigitsCache.set(fromToStr("7", "0"), ">vvv".split(""));
dirForDigitsCache.set(fromToStr("7", BUTTON_A), ">>vvv".split(""));
// And back, avoiding space
dirForDigitsCache.set(fromToStr("0", "7"), "^^^<".split(""));
dirForDigitsCache.set(fromToStr(BUTTON_A, "7"), "^^^<<".split(""));

// MIddle row
dirForDigitsCache.set(fromToStr("6", "0"), "<vv".split(""));
dirForDigitsCache.set(fromToStr("6", BUTTON_A), "vv".split(""));
dirForDigitsCache.set(fromToStr("5", "0"), "vv".split(""));
dirForDigitsCache.set(fromToStr("5", BUTTON_A), ">vv".split(""));
dirForDigitsCache.set(fromToStr("4", "0"), ">vv".split(""));
dirForDigitsCache.set(fromToStr("4", BUTTON_A), ">>vv".split(""));
//
// And back, avoiding space
dirForDigitsCache.set(fromToStr("0", "4"), "^^<".split(""));
dirForDigitsCache.set(fromToStr(BUTTON_A, "4"), "^^<<".split(""));

// Third row
dirForDigitsCache.set(fromToStr("3", "0"), "<v".split(""));
dirForDigitsCache.set(fromToStr("3", BUTTON_A), "v".split(""));
dirForDigitsCache.set(fromToStr("2", "0"), "v".split(""));
dirForDigitsCache.set(fromToStr("2", BUTTON_A), ">v".split(""));
dirForDigitsCache.set(fromToStr("1", "0"), ">v".split(""));
dirForDigitsCache.set(fromToStr("1", BUTTON_A), ">>v".split(""));
//
// And back, avoiding space
dirForDigitsCache.set(fromToStr("0", "1"), "^<".split(""));
dirForDigitsCache.set(fromToStr(BUTTON_A, "1"), "^<<".split(""));

const dirForDirCache: Map<string, string[]> = new Map();
// Left to A and UP
dirForDirCache.set(fromToStr("<", "^"), ">^".split(""));
dirForDirCache.set(fromToStr("<", BUTTON_A), ">>^".split(""));
// UP and A to LEFT
dirForDirCache.set(fromToStr("^", "<"), "v<".split(""));
dirForDirCache.set(fromToStr(BUTTON_A, "<"), "v<<".split(""));

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

  if (!aLocation || !bLocation)
    throw new Error(`Could not find location for a: ${a} and b:${b}`);

  const [vert, horz] = posDiff(aLocation, bLocation);

  const vertDirection = vert > 0 ? SOUTH : NORTH;
  const horzDirection = horz > 0 ? EAST : WEST;

  for (let i = 0; i < Math.abs(horz); i++) {
    result.push(dirToShortStr(horzDirection));
  }
  for (let i = 0; i < Math.abs(vert); i++) {
    result.push(dirToShortStr(vertDirection));
  }

  cache.set(asStr, result);

  return result;
}

export function enterCode(
  buttons: string[],
  destButtons: Map<string, Position>,
): string[] {
  let result: string[] = [];

  let currentDest = BUTTON_A;
  let destPosition = destButtons.get(currentDest);
  if (!destPosition)
    throw new Error(`Could not found a position ${currentDest}`);

  buttons.map((button) => {
    if (button === BUTTON_A) {
      result.push(currentDest);
    } else {
      const direction = dirFromShortStr(button);
      destPosition = applyDirection(destPosition!, direction);
      currentDest = findButton(destPosition, destButtons);
    }
  });

  return result;
}

export function enterDigitCode(code: string[]) {
  return enterCode(code, digitLocations);
}

export function enterArrowCode(code: string[]) {
  return enterCode(code, arrowLocations);
}

export function calcDigitsToEnterCode(
  code: string[],
  buttonLocations: Map<string, Position>,
  cache: Map<string, string[]>,
): string[] {
  let result: string[] = [];
  let current = BUTTON_A;

  for (let i = 0; i < code.length; i++) {
    getFromAtoB(current, code[i], buttonLocations, cache).forEach((b) =>
      result.push(b),
    );

    result.push(BUTTON_A);

    current = code[i];
  }
  return result;
}

export function calcButtonsToHitDigits(digits: string[]): string[] {
  return calcDigitsToEnterCode(digits, digitLocations, dirForDigitsCache);
}

export function calButtonsToHitDirections(directions: string[]): string[] {
  return calcDigitsToEnterCode(directions, arrowLocations, dirForDirCache);
}

export function enterChainedCode(code: string): string {
  const robot2 = enterArrowCode(code.split(""));
  const robot1 = enterArrowCode(robot2);
  const pinCode = enterDigitCode(robot1);
  console.log("Calc Button Presses", {
    code,
    pinCode,
    robot1,
    robot2,
  });
  return pinCode.join("");
}

export function calculateChainedButtons(pinCode: string): string {
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
  const sequence = calculateChainedButtons(pinCode);
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
