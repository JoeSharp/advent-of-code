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

export function blinkAtStonesRepeatedly(
  values: number[],
  times: number,
  cache: Map<string, number>
): number {
  if (times === 0) return 1;

  const asStr = `${values}-${times}`;
  if (cache.has(asStr)) return cache.get(asStr)!;

  const result = blinkAtStones(values)
    .map((s) => blinkAtStonesRepeatedly([s], times - 1, cache))
    .reduce((acc, curr) => acc + curr, 0);

  cache.set(asStr, result);

  return result;
}

const NUMBER_BLINKS_P1 = 25;
const NUMBER_BLINKS_P2 = 75;

const day11: AdventFunction = async (
  filename = "./src/2024/day11/input.txt",
) => {
  const contents = (await loadFirstLine(filename))
    .split(" ")
    .map((i) => parseInt(i));
  const part1 = blinkAtStonesRepeatedly(contents, NUMBER_BLINKS_P1, new Map());
  const part2 = blinkAtStonesRepeatedly(contents, NUMBER_BLINKS_P2, new Map());

  return [part1, part2];
};

export default day11;
