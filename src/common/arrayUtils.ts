export type Position = [number, number];
export interface WalkStep {
  position: Position;
  direction: Position;
}
export const NORTH: Position = [-1, 0];
export const NORTH_WEST: Position = [-1, -1];
export const NORTH_EAST: Position = [-1, 1];
export const SOUTH: Position = [1, 0];
export const SOUTH_WEST: Position = [1, -1];
export const SOUTH_EAST: Position = [1, 1];
export const WEST: Position = [0, -1];
export const EAST: Position = [0, 1];
export const NONSENSE: Position = [-1, -1];
export const ALL_DIRECTIONS = [
  NORTH,
  NORTH_WEST,
  NORTH_EAST,
  SOUTH,
  SOUTH_WEST,
  SOUTH_EAST,
  WEST,
  EAST,
];
export const CROSS_DIRECTIONS = [NORTH, SOUTH, EAST, WEST];

export function countInstances<T>(arr: T[]): Map<T, number> {
  const result: Map<T, number> = new Map();

  arr.forEach((value) => {
    const count = result.get(value) || 0;
    result.set(value, count + 1);
  });

  return result;
}

export function countSameNeighbours(grid: string[][], pos: Position): number {
  const value = grid[pos[0]][pos[1]];

  return ALL_DIRECTIONS.filter((dir) => !nextStepLeavesMap(grid, pos, dir))
    .map((dir) => applyDirection(pos, dir))
    .map(([r, c]) => grid[r][c])
    .filter((v) => v === value).length;
}

export function dirToShortStr(dir: Position): string {
  if (posEqual(dir, NORTH)) return "^";
  if (posEqual(dir, SOUTH)) return "v";
  if (posEqual(dir, WEST)) return "<";
  if (posEqual(dir, EAST)) return ">";
  if (posEqual(dir, NORTH_WEST)) return "↖️";
  if (posEqual(dir, NORTH_EAST)) return "↗️";
  if (posEqual(dir, SOUTH_WEST)) return "↙️";
  if (posEqual(dir, SOUTH_EAST)) return "↘️";
  return ".";
}

export function dirFromShortStr(input: string): Position {
  switch (input) {
    case "^":
      return NORTH;
    case "v":
      return SOUTH;
    case "<":
      return WEST;
    case ">":
      return EAST;
  }

  return NONSENSE;
}

export function dirToStr(dir: Position): string {
  if (posEqual(dir, NORTH)) return "NORTH";
  if (posEqual(dir, NORTH_WEST)) return "NORTH_WEST";
  if (posEqual(dir, NORTH_EAST)) return "NORTH_EAST";
  if (posEqual(dir, SOUTH)) return "SOUTH";
  if (posEqual(dir, SOUTH_WEST)) return "SOUTH_WEST";
  if (posEqual(dir, SOUTH_EAST)) return "SOUTH_EAST";
  if (posEqual(dir, WEST)) return "WEST";
  if (posEqual(dir, EAST)) return "EAST";
  return "UNKNOWN";
}

export function gridArrayToStr(arr: any[][]): string {
  return arr.map((row) => row.join("")).join("\n");
}

export function posToStr([r, c]: Position): string {
  return `${r},${c}`;
}

export function posAndDirToStr(pos: Position, dir: Position): string {
  return `${posToStr(pos)}-${dirToStr(dir)}`;
}

export function floodFill<T>(
  grid: T[][],
  position: Position,
  alreadyEvaluated: Set<string>,
  valueMatcher: (v: T) => boolean,
  tileFound: (pos: Position) => void,
) {
  tileFound(position);
  alreadyEvaluated.add(posToStr(position));
  CROSS_DIRECTIONS.filter((dir) => !nextStepLeavesMap(grid, position, dir))
    .map((dir) => applyDirection(position, dir))
    .filter((pos) => {
      const posStr = posToStr(pos);
      const evaluated = alreadyEvaluated.has(posStr);
      alreadyEvaluated.add(posStr);
      return !evaluated;
    })
    .filter(([r, c]) => valueMatcher(grid[r][c]))
    .forEach((nextPos) => {
      tileFound(nextPos);
      floodFill(grid, nextPos, alreadyEvaluated, valueMatcher, tileFound);
    });
}

export function distinctValues<T>(arr: T[]): T[] {
  const seen = new Set();

  return arr.filter((value) => {
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
export function turnLeft(direction: Position): Position {
  switch (direction) {
    case NORTH:
      return WEST;
    case EAST:
      return NORTH;
    case SOUTH:
      return EAST;
    case WEST:
      return SOUTH;
  }
  return NONSENSE;
}

export function posEqual(a: Position, b: Position): boolean {
  return a[0] === b[0] && a[1] === b[1];
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

export function walkGrid<T>(
  grid: T[][],
  path: Position[],
  position: Position,
  nextStepValid: (currPos: Position, nextPos: Position) => boolean,
  isAtEnd: (pos: Position) => boolean,
  pathFound: (path: Position[]) => void,
) {
  [NORTH, SOUTH, WEST, EAST]
    .filter((dir) => !nextStepLeavesMap(grid, position, dir))
    .map((dir) => applyDirection(position, dir))
    .filter((nextPos) => nextStepValid(position, nextPos))
    .forEach((nextPos) => {
      const newPath = [...path, position];
      if (isAtEnd(nextPos)) {
        pathFound([...path, position, nextPos]);
      } else {
        walkGrid(
          grid,
          [...path, position],
          nextPos,
          nextStepValid,
          isAtEnd,
          pathFound,
        );
      }
    });
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

export function splitIntoChunks<T>(arr: T[], chunkSize: number): T[][] {
  const output: T[][] = [];
  const chunks = Math.ceil(arr.length / chunkSize);

  for (let i = 0; i < chunks; i++) {
    output.push(arr.slice(i * chunkSize, (i + 1) * chunkSize));
  }

  return output;
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
