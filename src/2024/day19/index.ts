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
  alreadyMade: Map<string, number> = new Map(),
  cantMake: string[] = [],
  index: number = 0,
): number {
  const lookingToMake = desired.slice(index);

  if (alreadyMade.has(lookingToMake)) {
    return alreadyMade.get(lookingToMake) || 0;
  }

  if (cantMake.includes(lookingToMake)) {
    return 0;
  }

  let waysToMake = 0;

  for (let towel of towelSet) {
    if (canMakeNextPartOfPattern(towel, desired, index)) {
      let nextIndex = index + towel.length;
      if (nextIndex === desired.length) {
        waysToMake++;
      } else {
        waysToMake += canMakePattern(
          towelSet,
          desired,
          alreadyMade,
          cantMake,
          nextIndex,
        );
      }
    }
  }

  if (waysToMake === 0) {
    cantMake.push(lookingToMake);
  }

  alreadyMade.set(lookingToMake, waysToMake);

  return waysToMake;
}

const day19: AdventFunction = async (
  filename = "./src/2024/day19/input.txt",
) => {
  const problem = await loadTowelProblem(filename);
  const solutions = problem.desired.map((d) =>
    canMakePattern(problem.towelSet, d),
  );
  const p1 = solutions.filter((s) => s > 0).length;
  const p2 = solutions.reduce((acc, curr) => acc + curr, 0);

  return [p1, p2];
};

export default day19;
