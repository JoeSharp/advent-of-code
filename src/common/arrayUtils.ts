export type Position = [number, number];
export interface WalkStep {
  position: Position;
  direction: Position;
}
export const NORTH: Position = [-1, 0];
export const SOUTH: Position = [1, 0];
export const WEST: Position = [0, -1];
export const EAST: Position = [0, 1];
export const NONSENSE: Position = [-1, -1];

export function distinctValues<T>(arr: T[]): T[] {
  const seen = new Set();

  return arr
    .filter(value => {
      const asStr = JSON.stringify(value);
      if (seen.has(asStr)) return false;
      seen.add(asStr);
      return true;
    });
}


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
  grid: any[][],
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
  grid: any[][],
  position: Position,
  direction: Position,
): string {
  const [nextRow, nextCol] = applyDirection(position, direction);
  return grid[nextRow][nextCol];
}

export function findInstancesOf<T>(
  grid: T[][],
  matcher: (a: T) => boolean,
): Position[] {
  const result: Position[] = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (matcher(grid[row][col])) {
        result.push([row, col]);
      }
    }
  }

  return result;
}

function copyGrid<T>(rows: T[][]): T[][] {
  return [...rows.map((row) => [...row])];
}

const LOOPED_WALK: WalkStep[] = [];

export function arraySectionToString(
  arr: any[],
  fromIndex: number,
  length: number,
  chunkSize: number,
): string {
  let asStr = `Array of Length ${arr.length} from: ${fromIndex}, length: ${length} with chunk size ${chunkSize}\n`;

  const fromChunk = Math.floor(fromIndex / chunkSize);
  const toChunk = Math.ceil((fromIndex + length) / chunkSize);

  for (let chunk = fromChunk; chunk < toChunk; chunk++) {
    const f = chunk * chunkSize;
    const t = (chunk + 1) * chunkSize - 1;

    let row = `Chunk ${chunk} [${f}...${t}] `;
    for (let i = 0; i < chunkSize; i++) {
      if (f + i >= arr.length) break;
      row += arr[f + i] + ",";
    }

    row += "\n";
    asStr += row;
  }

  return asStr;
}
