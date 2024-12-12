import { AdventFunction } from "../../common/types";
import { loadEntireFileAsGrid } from "../../common/processFile";
import {
  Position,
  posToStr,
  distinctValues,
  applyDirection,
  nextStepLeavesMap,
  floodFill,
  turnLeft,
  turnRight,
  posEqual,
  NORTH,
  SOUTH,
  EAST,
  WEST,
} from "../../common/arrayUtils";

interface Plot {
  id: string;
  tiles: Position[];
  perimeter: number;
  sides: number;
  perimeterTiles: Position[];
}

type Garden = Plot[];

function calculateSides(
grid: string[][],
id: string,
tiles: Position[]): number {
  let sides = 1;

  // Come back to this later maybe
  return 1;
  if (tiles.length === 1) return 4;

  let startPos = tiles[0];
  let pos = tiles[0];
  let dir = EAST;

  // walk EAST until you go off end
  // each step
  // // look ahead
  // if it goes off map, turn right, +1 sides
  // // if it's you, turn left
  // if not turn right, +1 sides
  // keep going till you come back on yourself
  do {
    console.log('Walking', {pos, dir});
    let nextPos = applyDirection(pos, dir);
    if (nextStepLeavesMap(grid, pos, dir)) {
      sides++;
      dir = turnRight(dir);
    } else if (grid[nextPos[0]][nextPos[1]] === id) {
      // What if there is a diagonal connection between two plots?
      sides++;
      dir = turnLeft(dir);
    } else {
      // Check to the right is you
      let dirRight = turnRight(dir);
      let toTheRight = applyDirection(pos, dirRight);
      if (grid[toTheRight[0]][toTheRight[1]] !== id) {
        dir = dirRight;
        sides++;
      }
      pos = applyDirection(pos, dir);
    }
  } while(!posEqual(pos, startPos));

  return sides;
}

function calculatePerimeter(
  grid: string[][],
  id: string,
  tiles: Position[],
  tileFound: (pos: Position) => void,
): number {
  let perimeter = 0;

  tiles.forEach((tile) => {
    [NORTH, SOUTH, EAST, WEST].forEach((dir) => {
      if (nextStepLeavesMap(grid, tile, dir)) {
        perimeter++;
      } else {
        const [r, c] = applyDirection(tile, dir);
        if (grid[r][c] !== id) {
          perimeter++;
          tileFound([r, c]);
        }
      }
    });
  });

  return perimeter;
}

export function findPlot(grid: string[][], [row, col]: Position): Plot {
  const id = grid[row][col];
  let tiles: Position[] = [];

  floodFill(
    grid,
    [row, col],
    new Set(),
    (v) => v === id,
    (tile) => tiles.push(tile),
  );

  tiles = distinctValues(tiles);

  const perimeterTiles: Position[] = [];
  const perimeter  = calculatePerimeter(grid, id, tiles, (p) =>
    perimeterTiles.push(p),
  );
  const sides = calculateSides(grid, id, tiles);

  return {
    id,
    tiles,
    perimeter,
    sides,
    perimeterTiles,
  };
}

export function parseGarden(grid: string[][]): Garden {
  const garden: Garden = [];

  const seenTiles: Set<string> = new Set();
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const pos: Position = [row, col];
      const posStr = posToStr(pos);
      if (seenTiles.has(posStr)) {
        continue;
      }
      seenTiles.add(posStr);

      const plot = findPlot(grid, pos);
      plot.tiles.map(posToStr).forEach((t) => seenTiles.add(t));
      garden.push(plot);
    }
  }

  return garden;
}

export function calculatePrice1({ tiles, perimeter }: Plot): number {
  return tiles.length * perimeter;
}

export function calculatePrice2({ tiles, sides }: Plot): number {
  return tiles.length * sides;
}

const day12: AdventFunction = async (
  filename = "./src/2024/day12/input.txt",
) => {
  const grid = await loadEntireFileAsGrid(filename);
  const garden = parseGarden(grid);

  const part1 = garden
    .map(calculatePrice1)
    .reduce((acc, curr) => acc + curr, 0);
  const part2 = garden
    .map(calculatePrice2)
    .reduce((acc, curr) => acc + curr, 0);

  return [part1, part2];
};

export default day12;
