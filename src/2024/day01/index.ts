import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";
import { numericSort } from "../../common/numericUtils";

export async function loadRightAndLeftLists(
  filename: string,
): Promise<[number[], number[]]> {
  const lines = await loadEntireFile(filename);

  const left: number[] = [];
  const right: number[] = [];

  lines
    .map((l) => l.split(" "))
    .forEach((parts) => {
      const [l, r] = parts
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
        .map((p) => parseInt(p));
      left.push(l);
      right.push(r);
    });

  return [left, right];
}

function calculateDistance(left: number[], right: number[]): number {
  let distance = 0;

  const sortedLeft = [...left].sort(numericSort);
  const sortedRight = [...right].sort(numericSort);

  return sortedLeft
    .map((l, i) => l - sortedRight[i])
    .map(Math.abs)
    .reduce((acc, curr) => acc + curr, 0);
}

function calculateSimilarity(left: number[], right: number[]) {
  return left
    .map((l) => l * right.filter((r) => r == l).length)
    .reduce((acc, curr) => acc + curr, 0);
}

const day1: AdventFunction = async (filename = "./src/2024/day01/input.txt") => {
  const [left, right] = await loadRightAndLeftLists(filename);
  const part1 = calculateDistance(left, right);
  const part2 = calculateSimilarity(left, right);

  return [part1, part2];
};

export default day1;
