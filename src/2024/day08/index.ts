import { AdventFunction } from "../../common/types";
import { loadEntireFileAsGrid } from "../../common/processFile";

export const EMPTY_CELL = ".";

export type Position = [number, number];
export type LocationMap = Map<string, Position[]>;

interface Antenna {
  name: string;
  locations: Position[];
  antinodes: Position[];
}

export function getLocationMap(grid: string[][]): LocationMap {
  const map: LocationMap = new Map();

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const key = grid[row][col];
      if (key === EMPTY_CELL) continue;

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key)!.push([row, col]);
    }
  }

  return map;
}

function vecSub(a: Position, b: Position): Position {
  return [a[0] - b[0], a[1] - b[1]];
}

function vecAdd(a: Position, b: Position): Position {
  return [a[0] + b[0], a[1] + b[1]];
}

function getAntinodes(
  grid: string[][],
  key: string,
  nodes: Position[],
  resonant: boolean,
): Position[] {
  const antinodes: Position[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;

      const a = nodes[i];
      const b = nodes[j];

      if (resonant) {
        antinodes.push(a);
        antinodes.push(b);
      }

      const diff = vecSub(b, a);
      let an0 = vecSub(a, diff);
      let an1 = vecAdd(b, diff);

      do {
        if (isOnMap(grid, an0)) {
          antinodes.push(an0);
          an0 = vecSub(an0, diff);
        } else {
          break;
        }
      } while (resonant);
      do {
        if (isOnMap(grid, an1)) {
          antinodes.push(an1);
          an1 = vecAdd(an1, diff);
        } else {
          break;
        }
      } while (resonant);
    }
  }

  return antinodes;
}

export function distinctPositions(positions: Position[]): Position[] {
  const seen = new Set();

  return positions.filter((position) => {
    const asStr = JSON.stringify(position);
    if (seen.has(asStr)) {
      return false;
    }
    seen.add(asStr);
    return true;
  });
}

function isOnMap(grid: string[][], position: Position): boolean {
  const rows = grid.length;
  const cols = grid[0].length;

  return (
    position[0] >= 0 &&
    position[0] < rows &&
    position[1] >= 0 &&
    position[1] < cols
  );
}

function copyGrid(rows: string[][]): string[][] {
  return [...rows.map((row) => [...row])];
}

function printGrid(grid: string[][]) {
  let str = "";
  for (let row = 0; row < grid.length; row++) {
    str += grid[row].join("") + "\n";
  }
  console.log(str);
}

function printAntenna(_grid: string[][], antenna: Antenna) {
  const grid = copyGrid(_grid);

  console.log("Antenna", antenna.name);
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] !== antenna.name) {
        grid[row][col] = EMPTY_CELL;
      }
    }
  }
  antenna.antinodes
    .filter((an) => isOnMap(grid, an))
    .forEach(([row, col]) => {
      grid[row][col] = "#";
    });

  printGrid(grid);
}

function debugAll(_grid: string[][], antinodes: Position[]) {
  const grid = copyGrid(_grid);

  antinodes.forEach(([row, col]) => {
    grid[row][col] = "#";
  });

  printGrid(grid);
}

const day8: AdventFunction = async (
  filename = "./src/2024/day08/input.txt",
) => {
  const grid = await loadEntireFileAsGrid(filename);

  const locMap = getLocationMap(grid);

  const antinodes: Position[] = [...locMap.entries()]
    .map(([k, v]) => ({
      name: k,
      locations: v,
      antinodes: getAntinodes(grid, k, v, false),
    }))
    .flatMap(({ antinodes }) => antinodes);

  const antinodesResonant: Position[] = [...locMap.entries()]
    .map(([k, v]) => ({
      name: k,
      locations: v,
      antinodes: getAntinodes(grid, k, v, true),
    }))
    .flatMap(({ antinodes }) => antinodes);

  const part1 = distinctPositions(antinodes).length;
  const part2 = distinctPositions(antinodesResonant).length;

  return [part1, part2];
};

export default day8;
