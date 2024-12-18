import { AdventFunction } from "../../common/types";
import { loadEntireFile } from '../../common/processFile';
import { Position } from '../../common/arrayUtils';

export const GRID_SIZE = 71; // 0 -> 70 inclusive

enum MemoryCell {
  EMPTY = '.',
  CORRUPTED = '#'
}

export function create2dArray<T>(rows: number, columns: number, value: T): T[][] {
  const result: MemoryCell[][] = [];

  for (let r=0; r<rows; r++) {
    const row: T[] = [];
    for (let c=0; c<columns; c++) {
      row.push(value);
    }
    result.push(row);
  }

  return result;
}

export function simulateCorruption(gridSize: number, corrupted: Position[], iterations: number): MemoryCell[][] {
  const memory: MemoryCell[][] = create2dArray(gridSize, gridSize, MemoryCell.EMPTY);

  for (let i=0; i<iterations; i++) {
    const [r, c] = corrupted[i];

    memory[r][c] = MemoryCell.CORRUPTED;
  }

  return memory;
}

export function parseCoordinate(input: string): Position {
  return input.split(',').map(d => parseInt(d)) as Position;
}

export async function loadCoordinates(filename: string): Position[] {
  return (await loadEntireFile(filename)).map(parseCoordinate);
}

const day18: AdventFunction = async (
  filename = "./src/2024/day18/input.txt",
) => {
  return [1, 1];
};

export default day18;
