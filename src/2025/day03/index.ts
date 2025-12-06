import { intoDigits, sum } from "../../common/numericUtils";
import { loadEntireFile } from "../../common/processFile";
import simpleLogger from "../../common/simpleLogger";
import { AdventFunction } from "../../common/types";

function parseBatteries(input: string): number[] {
  return input.split('')
    .map(l => parseInt(l, 10));
}

function containsCombination(batteries: number[], joltage: number): boolean {
  const joltageDigits = intoDigits(joltage, 2);

  let indexOfTens = batteries.indexOf(joltageDigits[0]);
  let indexOfUnits = batteries.lastIndexOf(joltageDigits[1]);

  if (indexOfTens === -1) return false;
  if (indexOfUnits === -1) return false;
  if (indexOfUnits <= indexOfTens) return false;

  return true;
}

function findHighestJoltage(batteries: number[]): number {
  simpleLogger.info(`Finding Highest Joltage in ${batteries}`)
  for (let joltage = 99; joltage > 0; joltage--) {
    if (containsCombination(batteries, joltage)) {
      simpleLogger.info(`Found ${joltage}`)
      return joltage;
    }
  }

  simpleLogger.info("Could not find anything")
  return 0;
}


const dayX: AdventFunction = async (
  filename = "./src/2025/day03/input.txt"
) => {
  const part1 = (await loadEntireFile(filename))
    .map(parseBatteries)
    .map(findHighestJoltage)
    .reduce(sum, 0);

  return [part1, 1];
};

export default dayX;
