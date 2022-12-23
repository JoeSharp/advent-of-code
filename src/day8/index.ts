import * as fs from "fs";
import readline from "readline";
import { AdventFunction } from "../common/types";

export type TreeGrid = {
  rows: number;
  columns: number;
  content: number[][];
};

export const readGridOfNumbers = (filename: string): Promise<TreeGrid> => {
  const grid: TreeGrid = {
    rows: 0,
    columns: 0,
    content: [],
  };
  return new Promise((resolve) => {
    var r = readline.createInterface({
      input: fs.createReadStream(filename),
    });
    r.on("line", (line) => {
      let row = line.split("").map((i) => parseInt(i, 10));
      if (grid.columns === 0) {
        grid.columns = row.length;
      }
      grid.content.push(row);
      grid.rows++;
    }).on("close", () => {
      resolve(grid);
    });
  });
};
type TreeGenerator = (
  grid: TreeGrid,
  row: number,
  column: number
) => Generator<number>;

export function* goLeft(
  grid: TreeGrid,
  row: number,
  column: number
): Generator<number> {
  for (let c = column - 1; c >= 0; c--) {
    yield grid.content[row][c];
  }
}
export function* goRight(
  grid: TreeGrid,
  row: number,
  column: number
): Generator<number> {
  for (let c = grid.columns - 1; c > column; c--) {
    yield grid.content[row][c];
  }
}

export function* goUp(
  grid: TreeGrid,
  row: number,
  column: number
): Generator<number> {
  for (let r = row - 1; r >= 0; r--) {
    yield grid.content[r][column];
  }
}

export function* goDown(
  grid: TreeGrid,
  row: number,
  column: number
): Generator<number> {
  for (let r = grid.rows - 1; r > row; r--) {
    yield grid.content[r][column];
  }
}

export const findBlockingTree =
  (
    generator: TreeGenerator
  ): ((grid: TreeGrid, row: number, column: number) => boolean) =>
  (grid, row, column) =>
    ![...generator(grid, row, column)].find(
      (otherTree) => otherTree >= grid.content[row][column]
    );

export const isTreeVisibleFromLeft = findBlockingTree(goLeft);
export const isTreeVisibleFromRight = findBlockingTree(goRight);
export const isTreeVisibleFromTop = findBlockingTree(goUp);
export const isTreeVisibleFromBottom = findBlockingTree(goDown);

export const isTreeVisible = (
  grid: TreeGrid,
  row: number,
  column: number
): boolean => {
  return (
    isTreeVisibleFromLeft(grid, row, column) ||
    isTreeVisibleFromRight(grid, row, column) ||
    isTreeVisibleFromTop(grid, row, column) ||
    isTreeVisibleFromBottom(grid, row, column)
  );
};

export const countVisibleTrees = (grid: TreeGrid): number => {
  let visibleTrees = 0;

  for (let row = 0; row < grid.rows; row++) {
    for (let column = 0; column < grid.columns; column++) {
      if (isTreeVisible(grid, row, column)) {
        visibleTrees++;
      }
    }
  }

  return visibleTrees;
};

// How many visible from outside the grid?

const day8: AdventFunction = async (filename = "./src/day8/input.txt") => {
  const grid = await readGridOfNumbers(filename);

  const partOne = countVisibleTrees(grid);

  return [partOne, 1];
};

export default day8;
