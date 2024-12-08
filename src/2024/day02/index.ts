import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";
import { parseListOfNumbers } from "../../common/stringUtils";

export function xor(a: boolean, b: boolean): boolean {
  if (a && b) return false;
  if (!a && !b) return false;
  return true;
}

export function allOneDirection(input: number[]): boolean {
  let increaseSeen: boolean = false;
  let decreaseSeen: boolean = false;

  for (let i = 1; i < input.length; i++) {
    if (input[i] > input[i - 1]) {
      increaseSeen = true;
    } else if (input[i] < input[i - 1]) {
      decreaseSeen = true;
    }
  }

  return xor(increaseSeen, decreaseSeen);
}

export function changeWithinBounds(
  input: number[],
  lowerInclusive: number,
  upperInclusive: number,
): boolean {
  for (let i = 1; i < input.length; i++) {
    const diff = Math.abs(input[i] - input[i - 1]);
    if (diff < lowerInclusive) return false;
    if (diff > upperInclusive) return false;
  }
  return true;
}

export function isSafe(input: number[]): boolean {
  const dir = allOneDirection(input);
  const diffBounds = changeWithinBounds(input, 1, 3);
  return dir && diffBounds;
}

export function isSafeWithDampener(input: number[]): boolean {
  if (isSafe(input)) return true;

  for (let i = 0; i < input.length; i++) {
    const modified = input.filter((_, j) => j != i);
    if (isSafe(modified)) return true;
  }

  return false;
}

const day2: AdventFunction = async (filename = "./src/2024/day2/input.txt") => {
  const lists = (await loadEntireFile(filename)).map(parseListOfNumbers);
  const part1 = lists.filter(isSafe).length;
  const part2 = lists.filter(isSafeWithDampener).length;

  return [part1, part2];
};

export default day2;
