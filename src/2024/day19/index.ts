import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";

export type Towel = string[];
export type TowelSet = Towel[];

export interface TowelProblem {
  towelSet: TowelSet;

  desired: Towel[];
}

function parseTowel(input: string): Towel {
  return input.trim().split("");
}

function parseTowelSet(input: string): TowelSet {
  return input
    .split(",")
    .map((d) => d.trim())
    .map(parseTowel) as TowelSet;
}

async function loadTowelProblem(filename: string): Promise<TowelProblem> {
  const contents = await loadEntireFile(filename);

  return {
    towelSet: parseTowelSet(contents[0]),
    desired: contents.slice(2).map(parseTowel),
  };
}

export function canMakeNextPartOfPattern(
  towel: Towel,
  desired: Towel,
  index: number,
): boolean {
  if (towel.length + index > desired.length) return false;

  for (let i = 0; i < towel.length; i++) {
    if (desired[i + index] !== towel[i]) return false;
  }

  return true;
}

export function canMakePattern(
  towelSet: TowelSet,
  desired: Towel,
  index: number = 0,
): boolean {
    console.log(`Looking to make ${desired.join(',')} from ${index}`);

  return towelSet.findIndex((towel, ti) => {
    if (canMakeNextPartOfPattern(towel, desired, index)) {
      let nextIndex = index + towel.length;
      if (nextIndex === desired.length) {
        return true;
      } else {
        return canMakePattern(towelSet, desired, nextIndex);
      }
    } else {
      return false;
    }
  }) !== -1;
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
