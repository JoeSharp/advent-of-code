import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";

export type Multiplication = [number, number];

export function getMultiplications(line: string): Multiplication[] {
  const regex = /mul\((?<first>\d{1,3}),(?<second>\d{1,3})\)/g;
  const matches = [...line.matchAll(regex)];

  return matches
    .filter((m) => !!m.groups)
    .map((match) => {
      const { first, second } = match.groups!;
      return [parseInt(first), parseInt(second)];
    });
}

export function getCancellableMultiplications(line: string): Multiplication[] {
  const regex =
    /(?<dont>don't\(\))|(?<do>do\(\))|mul\((?<first>\d{1,3}),(?<second>\d{1,3})\)/g;
  const matches = [...line.matchAll(regex)];

  let doMult = true;
  const multiplications: Multiplication[] = [];

  matches.forEach((match) => {
    if (match.groups == undefined) return;

    if (match.groups.do) {
      doMult = true;
      return;
    }
    if (match.groups.dont) {
      doMult = false;
      return;
    }
    if (doMult) {
      const { first, second } = match.groups;
      multiplications.push([parseInt(first), parseInt(second)]);
    }
  });
  return multiplications;
}

const day3: AdventFunction = async (
  filename = "./src/2024/day03/input.txt",
) => {
  const contents = await loadEntireFile(filename);

  const line = contents.join("");

  const part1 = getMultiplications(line)
    .map(([a, b]) => a * b)
    .reduce((acc, curr) => acc + curr, 0);

  const part2 = getCancellableMultiplications(line)
    .map(([a, b]) => a * b)
    .reduce((acc, curr) => acc + curr, 0);

  return [part1, part2];
};

export default day3;
