import { AdventFunction } from "../../common/types";
import {
  Position,
  findInstancesOf,
  nextStepLeavesMap,
  applyDirection,
  distinctValues,
  NORTH,
  SOUTH,
  WEST,
  EAST,
} from "../../common/arrayUtils";
import { loadFileAsDigitGrid } from "../../common/processFile";

const LAST_VALUE = 9;

export function takeSteps(
  grid: number[][],
  position: Position,
  found: (pos: Position) => void,
) {
  const thisValue = grid[position[0]][position[1]];

  [NORTH, SOUTH, WEST, EAST]
    .filter((dir) => !nextStepLeavesMap(grid, position, dir))
    .map((dir) => applyDirection(position, dir))
    .filter(([row, col]) => grid[row][col] === thisValue + 1)
    .forEach((nextPos) => {
      if (grid[nextPos[0]][nextPos[1]] == LAST_VALUE) {
        found(nextPos);
      } else {
        takeSteps(grid, nextPos, found);
      }
    });
}

export function evaluateTrailhead(grid: number[][], start: Position): number {
  let positionsReached: Position[] = [];
  takeSteps(grid, start, p => positionsReached.push(p));
  return distinctValues(positionsReached).length;
}

export function evaluateHikeRating(grid: number[][], start: Position): number {
  let positionsReached: Position[] = [];
  takeSteps(grid, start, p => positionsReached.push(p));
  return positionsReached.length;
}


export function calculateTrailheads(grid: number[][]): number {
  return findInstancesOf(grid, (x) => x === 0)
    .map((sp) => evaluateTrailhead(grid, sp))
    .reduce((acc, curr) => acc + curr, 0);
}

export function calculateHikeRatings(grid: number[][]): number {
  return findInstancesOf(grid, (x) => x === 0)
    .map((sp) => evaluateHikeRating(grid, sp))
    .reduce((acc, curr) => acc + curr, 0);
}

const day10: AdventFunction = async (
  filename = "./src/2024/day10/input.txt",
) => {
      const grid = await loadFileAsDigitGrid(filename);
  const part1 = calculateTrailheads(grid);
  const part2 = calculateHikeRatings(grid);

  return [part1, part2];
};

export default day10;
