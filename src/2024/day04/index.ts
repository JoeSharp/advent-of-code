import { AdventFunction } from "../../common/types";
import { loadEntireFileAsGrid } from "../../common/processFile";

export function getGridItemsFrom(
  grid: string[][],
  startRow: number,
  startCol: number,
  length: number,
  dirRow: number,
  dirCol: number,
): string[] {
  let result = [];

  let row = startRow;
  let col = startCol;
  for (let i = 0; i < length; i++) {
    if (row >= grid.length || row < 0) {
      break;
    }
    const rowContents = grid[row];
    if (col >= rowContents.length || col < 0) {
      break;
    }
    result.push(rowContents[col]);

    row += dirRow;
    col += dirCol;
  }

  return result;
}

export function countInstancesOfWordAt(
  word: string,
  grid: string[][],
  startRow: number,
  startCol: number,
): number {
  let found = 0;

  for (let rowDir = -1; rowDir <= 1; rowDir++) {
    for (let colDir = -1; colDir <= 1; colDir++) {
      const items = getGridItemsFrom(
        grid,
        startRow,
        startCol,
        word.length,
        rowDir,
        colDir,
      );
      const wordAt = items.join("");
      if (word === wordAt) {
        found++;
      }
    }
  }

  return found;
}

export function countWords(word: string, grid: string[][]) {
  let found = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      found += countInstancesOfWordAt(word, grid, row, col);
    }
  }
  return found;
}

export function getCrossWords(
  grid: string[][],
  midRow: number,
  midCol: number,
): string[] {
  const topLeftToBR = [
    grid[midRow - 1][midCol - 1],
    grid[midRow][midCol],
    grid[midRow + 1][midCol + 1],
  ].join("");
  const bottomLeftToRT = [
    grid[midRow - 1][midCol + 1],
    grid[midRow][midCol],
    grid[midRow + 1][midCol - 1],
  ].join("");
  return [topLeftToBR, bottomLeftToRT];
}

function reverseWord(input: string): string {
  return input.split("").reverse().join("");
}

export function countCrossWords(word: string, grid: string[][]): number {
  let found = 0;
  const midLetter = word[Math.floor(word.length / 2)];
  const wordReversed = reverseWord(word);

  for (let row = 1; row < grid.length - 1; row++) {
    for (let col = 1; col < grid[row].length - 1; col++) {
      if (grid[row][col] == midLetter) {
        const crossWords = getCrossWords(grid, row, col);
        if (crossWords.every((cw) => cw === word || cw === wordReversed)) {
          found++;
        }
      }
    }
  }

  return found;
}

const day4: AdventFunction = async (
  filename = "./src/2024/day04/input.txt",
) => {
  const grid = await loadEntireFileAsGrid(filename);
  const part1 = countWords("XMAS", grid);
  const part2 = countCrossWords("MAS", grid);

  return [part1, part2];
};

export default day4;
