import { AdventFunction } from "../../common/types";

import {
  CROSS_DIRECTIONS,
  NORTH,
  SOUTH,
  EAST,
  WEST,
  posEqual,
  posToStr,
  Position,
  nextStepLeavesMap,
  applyDirection,
} from "../../common/arrayUtils";
import { RawMaze, loadRawMaze, EMPTY, WALL } from "../../common/mazeUtils";

interface Cheat {
  from: Position;
  to: Position;
  saves: number;
}

function indexOfPos(path: Position[], toFind: Position): number {
  return path.findIndex((p) => posEqual(p, toFind));
}

function groupCheats(cheats: Cheat[]): Map<number, Cheat[]> {
  let result: Map<number, Cheat[]> = new Map();

  cheats.forEach(cheat => {
    if (!result.has(cheat.saves)) {
      result.set(cheat.saves, []);
    }

    result.get(cheat.saves)!.push(cheat);
  });

  return result;
}

export function findCheats(contents: string[][], path: Position[]): Cheat[] {
  let cheats: Cheat[] = [];

  for (let row = 0; row < contents.length; row++) {
    for (let col = 0; col < contents[row].length; col++) {
      // Ignore edge
      if (row === 0) continue;
      if (row === contents.length - 1) continue;
      if (col === 0) continue;
      if (col === contents[row].length - 1) continue;
      if (contents[row][col] !== WALL) continue;

      [
        [NORTH, SOUTH],
        [WEST, EAST],
      ].forEach((pair) => {
        const eitherSide = pair.map((d) => applyDirection([row, col], d));
        if (eitherSide.every(([r, c]) => contents[r][c] === EMPTY)) {
          const firstIndex = indexOfPos(path, eitherSide[0]);
          const secondIndex = indexOfPos(path, eitherSide[1]);
          if (firstIndex < secondIndex) {
            cheats.push({
              from: eitherSide[0],
              to: eitherSide[1],
              saves: (secondIndex - firstIndex) - 2
            });
          } else {
            cheats.push({
              from: eitherSide[1],
              to: eitherSide[0],
              saves: (firstIndex - secondIndex) - 2
            });
          }
        }
      });
    }
  }

  return cheats;
}

// Assumes there is only one path
export function findPath({ start, end, contents }: RawMaze): Position[] {
  let route: Position[] = [];

  const seen: Set<string> = new Set();

  let position = start;
  while (!posEqual(position, end)) {
    const nextEmpty = CROSS_DIRECTIONS.filter(
      (d) => !nextStepLeavesMap(contents, position, d),
    )
      .filter((d) => {
        const otherPos = applyDirection(position, d);
        if (seen.has(posToStr(otherPos))) return false;
        const [r, c] = otherPos;
        return contents[r][c] === EMPTY;
      })
      .map((d) => applyDirection(position, d))[0];

    const asStr = posToStr(position);
    seen.add(asStr);
    route.push(position);
    position = nextEmpty;
  }
  route.push(end);

  return route;
}

function countCheats(rawMaze: RawMaze, ofAtLeast: number) {
  const path = findPath(rawMaze);
  const cheats = findCheats(rawMaze.contents, path);
  const grouped = groupCheats(cheats);

  let total = 0;
  for (let [k, v] of grouped) {
    if (k >= ofAtLeast) {
      total += v.length;
    }
  }

  return total;
}

const day20: AdventFunction = async (
  filename = "./src/2024/day20/input.txt",
) => {
  const rawMaze = await loadRawMaze(filename);
  const part1 = countCheats(rawMaze, 100);
  return [part1, 1];
};

export default day20;
