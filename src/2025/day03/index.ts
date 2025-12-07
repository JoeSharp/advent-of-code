import { fromDigits, intoDigits, sum } from "../../common/numericUtils";
import { loadEntireFile } from "../../common/processFile";
import simpleLogger from "../../common/simpleLogger";
import { AdventFunction } from "../../common/types";

const NO_INDEX = -1;

function parseBatteries(input: string): number[] {
  return input.split("").map((l) => parseInt(l, 10));
}

function findHighest(input: number[]): [number, number] {
  let highest = 0;
  let index = NO_INDEX;

  for (let i = 0; i < input.length; i++) {
    if (input[i] > highest) {
      highest = input[i];
      index = i;
    }
  }

  //simpleLogger.info(
  //`Finding highest in ${input} which is input[${index}] = ${highest}`
  //);
  return [highest, index];
}

function findHighestJoltage(batteries: number[], batteryCount: number): number {
  let highestJoltage = 0;
  let remainingBatteries = [...batteries];

  //simpleLogger.info(`Finding ${batteryCount} in ${batteries}`);

  for (let i = batteryCount - 1; i >= 0; i--) {
    //simpleLogger.info(
    //`remaining batteries ${remainingBatteries} and we still need ${i} more batteries after this`
    //);
    let leftMostDigits =
      i > 0 ? remainingBatteries.slice(0, -i) : remainingBatteries;
    let [value, index] = findHighest(leftMostDigits);
    highestJoltage *= 10;
    highestJoltage += value;
    remainingBatteries = remainingBatteries.slice(index + 1);
  }

  //simpleLogger.info(
  //`Finding ${batteryCount} in ${batteries} yields = ${highestJoltage}`
  //);

  return highestJoltage;
}

const dayX: AdventFunction = async (
  filename = "./src/2025/day03/input.txt"
) => {
  const part1 = (await loadEntireFile(filename))
    .map(parseBatteries)
    .map((b) => findHighestJoltage(b, 2))
    .reduce(sum, 0);
  const part2 = (await loadEntireFile(filename))
    .map(parseBatteries)
    .map((b) => findHighestJoltage(b, 12))
    .reduce(sum, 0);

  return [part1, part2];
};

export default dayX;
