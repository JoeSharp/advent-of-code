import { AdventFunction } from "../../common/types";
import { loadEntireFileAsGrid } from '../../common/processFile';

export const EMPTY_CELL = '.';

export type Position = [number, number]
export type LocationMap = Map<string, Position[]>;

export function getLocationMap(grid: string[][]): LocationMap {
  const map: LocationMap = new Map();

  for (let row=0; row<grid.length; row++) {
    for (let col=0; col<grid[row].length; col++) {
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
  return [
    b[0] - a[0],
    b[1] - a[1]
  ]
}

function vecAdd(a: Position, b: Position): Position {
  return [
    a[0] + b[0],
    a[1] + b[1]
  ];
}

function getAntinodes(grid: string[][], key: string, nodes: Position[]): Position[] {
  const antinodes: Position[] = [];

  for (let i=0; i<nodes.length; i++) {
    for (let j=0; j<nodes.length; j++) {
      if (i === j) continue;
      
      const a=nodes[i];
      const b=nodes[j];

      const diff = vecSub(a, b);
      
      antinodes.push(vecSub(a, diff));
      antinodes.push(vecAdd(b, diff));
    }
  }


  return antinodes;
}

export function distinctPositions(positions: Position[]): Position[] {
  const seen = new Set();

  return positions
    .filter(position => {
      const asStr = JSON.stringify(position);
      if (seen.has(asStr)) return false;
      seen.add(asStr);
      return true;
    });
}

function isOnMap(grid: string[][], position: Position): boolean {
  const rows = grid.length;
  const cols = grid[0].length;

  return position[0] >= 0 && position[0] < rows && position[1] >= 0 && position[1] < cols;
}

function copyGrid(rows: string[][]): string[][] {
  return [...rows.map((row) => [...row])];
}
function debug(_grid: string[][], antinodes: Position[]) {
  const grid = copyGrid(_grid);

  antinodes.forEach(([row, col]) => grid[row][col] = '#');

  console.log('Debug Grid');
  let str = '';
  for (let row=0; row<grid.length; row++) {
    str += (grid[row].join('')) + '\n';
  }
  console.log(str);

}

const day8: AdventFunction = async (filename = "./src/2024/day8/input.txt") => {
  const grid = await loadEntireFileAsGrid(filename);

  // Create a map
  // * Key = frequency
  // * Value = list of nodes and locations
  //
  // For each key
  // For each pair of nodes
  // Calculate diff from a->b, add to b
  // Calculate diff from b->a, add to a
  // Add to list of antinodes
  // Filter by those on the map
  const locMap = getLocationMap(grid);
  const antinodes = [...locMap.entries()]
    .flatMap(([k, v]) => getAntinodes(grid, k, v))
    .filter(an => isOnMap(grid, an));

  console.log('All Antinodes', JSON.stringify(antinodes));
  console.log('Distinct Antinodes', JSON.stringify(distinctPositions(antinodes)));
  debug(grid, antinodes);

  const part1 = distinctPositions(antinodes).length;

  return [part1, 1];
};

export default day8;
