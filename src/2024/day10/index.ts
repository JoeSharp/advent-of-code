import { AdventFunction } from "../../common/types";
import {
  Position,
  findInstancesOf,
  nextStepLeavesMap,
  applyDirection,
  distinctValues,
  walkGrid,
  NORTH,
  SOUTH,
  WEST,
  EAST,
} from "../../common/arrayUtils";
import { loadFileAsDigitGrid } from "../../common/processFile";

const START_VALUE = 0;
const END_VALUE = 9;

export function takeSteps(
  grid: number[][],
  position: Position,
  found: (pos: Position[]) => void,
) {
  walkGrid(
    grid,
    [],
    position,
    (curr, next) => grid[next[0]][next[1]] === grid[curr[0]][curr[1]] + 1,
    (pos) => grid[pos[0]][pos[1]] === END_VALUE,
    (path) => found(path),
  );
}

export function evaluateTrailhead(grid: number[][], start: Position): number {
  let paths: Position[][] = [];
  takeSteps(grid, start, (p) => paths.push(p));
  return distinctValues(paths.map((p) => p[p.length - 1])).length;
}

export function evaluateHikeRating(grid: number[][], start: Position): number {
  let paths: Position[][] = [];
  takeSteps(grid, start, (p) => paths.push(p));
  return positionsReached.length;
}

export function calculateTrailheads(grid: number[][]): number {
  return findInstancesOf(grid, (x) => x === START_VALUE)
    .map((sp) => evaluateTrailhead(grid, sp))
    .reduce((acc, curr) => acc + curr, 0);
}

export function calculateHikeRatings(grid: number[][]): number {
  return findInstancesOf(grid, (x) => x === START_VALUE)
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
