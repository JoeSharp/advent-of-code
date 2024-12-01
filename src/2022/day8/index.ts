import * as fs from "fs";
import readline from "readline";
import simpleLogger from "../../common/simpleLogger";
import { AdventFunction } from "../../common/types";

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
  column: number,
) => Generator<number>;

export function* goLeft(
  grid: TreeGrid,
  row: number,
  column: number,
): Generator<number> {
  for (let c = column - 1; c >= 0; c--) {
    yield grid.content[row][c];
  }
}
export function* goRight(
  grid: TreeGrid,
  row: number,
  column: number,
): Generator<number> {
  for (let c = column + 1; c < grid.columns; c++) {
    yield grid.content[row][c];
  }
}

export function* goUp(
  grid: TreeGrid,
  row: number,
  column: number,
): Generator<number> {
  for (let r = row - 1; r >= 0; r--) {
    yield grid.content[r][column];
  }
}

export function* goDown(
  grid: TreeGrid,
  row: number,
  column: number,
): Generator<number> {
  for (let r = row + 1; r < grid.rows; r++) {
    yield grid.content[r][column];
  }
}

export const findBlockingTree =
  (
    generator: TreeGenerator,
  ): ((grid: TreeGrid, row: number, column: number) => boolean) =>
  (grid, row, column) =>
    ![...generator(grid, row, column)].find(
      (otherTree) => otherTree >= grid.content[row][column],
    );

export const isTreeVisibleFromLeft = findBlockingTree(goLeft);
export const isTreeVisibleFromRight = findBlockingTree(goRight);
export const isTreeVisibleFromTop = findBlockingTree(goUp);
export const isTreeVisibleFromBottom = findBlockingTree(goDown);

export const scenicScore =
  (
    generator: TreeGenerator,
  ): ((grid: TreeGrid, row: number, column: number) => number) =>
  (grid, row, column) => {
    let thisTree = grid.content[row][column];
    simpleLogger.debug(`Scoring Tree ${row}, ${column}, value: ${thisTree}`);
    let score = 0;
    var iter = generator(grid, row, column);

    for (let c of [...iter]) {
      simpleLogger.debug(`Seen Tree ${c}`);
      score++;

      if (c >= thisTree) {
        simpleLogger.debug("This tree blocks any further ones");
        return score;
      }
    }
    simpleLogger.debug(`Score: ${score}`);
    return score;
  };

export const scenicScoreLeft = scenicScore(goLeft);
export const scenicScoreRight = scenicScore(goRight);
export const scenicScoreUp = scenicScore(goUp);
export const scenicScoreDown = scenicScore(goDown);

export const isTreeVisible = (
  grid: TreeGrid,
  row: number,
  column: number,
): boolean => {
  return (
    isTreeVisibleFromLeft(grid, row, column) ||
    isTreeVisibleFromRight(grid, row, column) ||
    isTreeVisibleFromTop(grid, row, column) ||
    isTreeVisibleFromBottom(grid, row, column)
  );
};

export function* yieldVisibleTrees(
  grid: TreeGrid,
): Generator<{ row: number; column: number }> {
  for (let row = 0; row < grid.rows; row++) {
    for (let column = 0; column < grid.columns; column++) {
      if (isTreeVisible(grid, row, column)) {
        yield { row, column };
      }
    }
  }
}

/**
 * A tree's scenic score is found by multiplying together its viewing distance
 * in each of the four directions.
 * @param grid The tree grid
 * @param row The row of the tree under consiration
 * @param column The column of the tree under consideration
 * @returns The score
 */
export const calculateScenicScore = (
  grid: TreeGrid,
  row: number,
  column: number,
): number =>
  [scenicScoreLeft, scenicScoreRight, scenicScoreUp, scenicScoreDown].reduce(
    (acc, curr) => acc * curr(grid, row, column),
    1,
  );

// How many visible from outside the grid?
export const countVisibleTrees = (grid: TreeGrid) =>
  [...yieldVisibleTrees(grid)].length;

const day8: AdventFunction = async (filename = "./src/2022/day8/input.txt") => {
  const grid = await readGridOfNumbers(filename);

  const visibleTrees = [...yieldVisibleTrees(grid)];
  const partOne = visibleTrees.length;

  const scenicScores = visibleTrees
    .map(({ row, column }) => calculateScenicScore(grid, row, column))
    .sort((a, b) => b - a);

  return [partOne, scenicScores[0]];
};

export default day8;
