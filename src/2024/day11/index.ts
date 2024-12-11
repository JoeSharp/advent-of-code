import { AdventFunction } from "../../common/types";
import { loadFirstLine } from "../../common/processFile";
import { splitIntoChunks } from "../../common/arrayUtils";

export function hasEvenNumberDigits(value: number): boolean {
  return value.toString().length % 2 === 0;
}

export function splitNumber(value: number): number[] {
  const asStr = value.toString();
  const mid = asStr.length / 2;

  return [asStr.slice(0, mid), asStr.slice(mid)].map((i) => parseInt(i));
}

export const FALLBACK_FACTOR = 2024;

export function nextStoneValue(value: number): number[] {
  if (value === 0) {
    return [1];
  }

  if (hasEvenNumberDigits(value)) {
    return splitNumber(value);
  }

  return [FALLBACK_FACTOR * value];
}

export function blinkAtStones(values: number[]): number[] {
  return values.flatMap(nextStoneValue);
}

const MAX_LENGTH = 1000000;

export function blinkAtStonesRepeatedly(
  values: number[],
  times: number,
): number {
  if (times === 0) return 1;

  return blinkAtStones(values)
    .map((s) => blinkAtStonesRepeatedly([s], times - 1))
    .reduce((acc, curr) => acc + curr, 0);
}

export function blinkAtStonesRepeatedlySlowAF(
  values: number[],
  times: number,
): number {
  if (times === 1) return blinkAtStones(values).length;

  if (values.length > MAX_LENGTH) {
    let total = 0;
    const chunks = splitIntoChunks(values, MAX_LENGTH);
    for (let c = 0; c < chunks.length; c++) {
      const chunkBlinked = blinkAtStones(chunks[c]);
      const score = blinkAtStonesRepeatedly(chunkBlinked, times - 1);
      total += score;
    }
    return total;
  } else {
    return blinkAtStonesRepeatedly(blinkAtStones(values), times - 1);
  }
}

const NUMBER_BLINKS_P1 = 25;
const NUMBER_BLINKS_P2 = 75;

const day11: AdventFunction = async (
  filename = "./src/2024/day11/input.txt",
) => {
  const contents = (await loadFirstLine(filename))
    .split(" ")
    .map((i) => parseInt(i));
  const part1 = blinkAtStonesRepeatedly(contents, NUMBER_BLINKS_P1);
  const part2 = blinkAtStonesRepeatedly(contents, NUMBER_BLINKS_P2);

  return [part1, part2];
};

export default day11;
