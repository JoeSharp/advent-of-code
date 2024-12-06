import { AdventFunction } from "../../common/types";
import { loadEntireFileAsGrid } from "../../common/processFile";

export const EMPTY = ".";
export const OBSTRUCTION = "#";
export const GUARD_START = "^";

export type Position = [number, number];
export const NORTH: Position = [-1, 0];
export const SOUTH: Position = [1, 0];
export const WEST: Position = [0, -1];
export const EAST: Position = [0, 1];
export const NONSENSE: Position = [-1, -1];

export function turnRight(direction: Position): Position {
  switch (direction) {
    case NORTH:
      return EAST;
    case EAST:
      return SOUTH;
    case SOUTH:
      return WEST;
    case WEST:
      return NORTH;
  }

  return NONSENSE;
}

export function applyDirection(
  position: Position,
  direction: Position,
): Position {
  return [position[0] + direction[0], position[1] + direction[1]];
}

export function nextStepLeavesMap(
  grid: string[][],
  position: Position,
  direction: Position,
) {
  const [nextRow, nextCol] = applyDirection(position, direction);

  if (nextRow < 0 || nextRow >= grid.length) return true;

  const row = grid[nextRow];
  if (nextCol < 0 || nextCol >= row.length) return true;

  return false;
}

export function getNextBlock(
  grid: string[][],
  position: Position,
  direction: Position,
): string {
  const [nextRow, nextCol] = applyDirection(position, direction);
  return grid[nextRow][nextCol];
}

export function findStartPosition(grid: string[][]): Position {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === GUARD_START) {
        return [row, col];
      }
    }
  }

  return NONSENSE;
}

function walkGrid(grid: string[][]): Position[] {
  let walk: Position[] = [];

  let position = findStartPosition(grid);
  let direction = NORTH;

  while (!nextStepLeavesMap(grid, position, direction)) {
    walk.push(position);

    let nextBlock = getNextBlock(grid, position, direction);
    while (nextBlock === OBSTRUCTION) {
      direction = turnRight(direction);
      nextBlock = getNextBlock(grid, position, direction);
    }

    position = applyDirection(position, direction);
  }
  walk.push(position);

  return walk;
}

export function distinctPositions(positions: Position[]): Position[] {
  const seen = new Set();

  return positions.filter(position => {
    const asStr = JSON.stringify(position);
    if (seen.has(asStr)) return false;
    seen.add(asStr);
    return true;
  });
}


const day6: AdventFunction = async (filename = "./src/2024/day6/input.txt") => {
  const grid = await loadEntireFileAsGrid(filename);
  const walk = walkGrid(grid);
  const p1 = distinctPositions(walk).length;

  return [p1, 1];
};

export default day6;
