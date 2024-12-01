import simpleLogger from "../../common/simpleLogger";
import { loadEntireFile } from '../../common/processFile';

import * as fs from "fs";
import readline from "readline";
import { AdventFunction } from "../../common/types";

const NOT_FOUND = -1;

type FinderFn = (line: string) => number;

export const findDigit: FinderFn = (input: string): number => {
  const result = parseInt(input[0]);
  if (isNaN(result)) {
    return NOT_FOUND;
  }
  return result;
}

const DIGITS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine'
]

export const findDigitText: FinderFn = (input: string): number => {
  let result = findDigit(input);

  if (result !== NOT_FOUND) return result;

  return DIGITS.findIndex(digit => input.startsWith(digit));
}

function findFirstLast(line: string, findFn: FinderFn): [number, number] {
  let first = NOT_FOUND;
  let last = NOT_FOUND;

  for (let i=0; i<line.length; i++) {
    const digit = findFn(line.slice(i));
    if (digit !== NOT_FOUND) {
      if (first === NOT_FOUND) {
        first = digit;
      }
      last = digit;
    }
  }

  return [first, last];
}

function calculateCalibration(lines: string[], findFn: FinderFn): number {
  return lines
    .map(line => findFirstLast(line, findFn))
    .map(([a, b]) => a * 10 +  b)
    .reduce((acc, curr) => acc + curr, 0);
}

const day1: AdventFunction = async (filename = "./src/2023/day1/input.txt") => {
  const lines = await loadEntireFile(filename);

  const part1 = calculateCalibration(lines, findDigit);
  const part2 = calculateCalibration(lines, findDigitText);

  return [part1, part2];
};
  

export default day1;
