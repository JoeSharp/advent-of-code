import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";

export interface TowelProblem {
  towelSet: string[];

  desired: string[];
}

function parseTowelSet(input: string): string[] {
  return input.split(",").map((d) => d.trim());
}

async function loadTowelProblem(filename: string): Promise<TowelProblem> {
  const contents = await loadEntireFile(filename);

  return {
    towelSet: parseTowelSet(contents[0]),
    desired: contents.slice(2),
  };
}

export function canMakeNextPartOfPattern(
  towel: string,
  desired: string,
  index: number,
): boolean {
  if (towel.length + index > desired.length) return false;

  for (let i = 0; i < towel.length; i++) {
    if (desired[i + index] !== towel[i]) return false;
  }

  return true;
}

export function canMakePattern(
  towelSet: string[],
  desired: string,
  cantMake: string[] = [],
  index: number = 0,
): boolean {
  const lookingToMake = desired.slice(index);

  if (cantMake.includes(lookingToMake)) {
    return false;
  }

  for (let towel of towelSet) {
    if (canMakeNextPartOfPattern(towel, desired, index)) {
      let nextIndex = index + towel.length;
      if (nextIndex === desired.length) {
        return true;
      } else {
        const r = canMakePattern(towelSet, desired, cantMake, nextIndex);
        if (r) return true;
      }
    }
  };

  console.log('Wasnt able to make', lookingToMake);
  cantMake.push(lookingToMake);

  return false;
}

async function part1(filename: string): Promise<number> {
  const problem = await loadTowelProblem(filename);
  return problem.desired.filter((d) => canMakePattern(problem.towelSet, d))
    .length;
}

const day19: AdventFunction = async (
  filename = "./src/2024/day19/input.txt",
) => {
  const p1 = await part1(filename);

  return [p1, 1];
};

export default day19;
