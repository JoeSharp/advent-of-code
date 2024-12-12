import { AdventFunction } from "../../common/types";
import { loadEntireFileAsGrid } from "../../common/processFile";
import {
  Position,
  posToStr,
  distinctValues,
  fillArea,
} from "../../common/arrayUtils";

interface Plot {
  id: string;
  tiles: Position[];
  perimeter: number;
  perimeterTiles: Position[];
}

type Garden = Plot[];

function calculatePerimeter(grid: string[][], 
  tiles: Position[],
  tileFound: (pos: Position) => void): number {
  return 0;
}

export function findPlot(grid: string[][], [row, col]: Position): Plot {
  const id = grid[row][col];
  let tiles: Position[] = [];

  fillArea(
    grid,
    [row, col],
    new Set(),
    (v) => v === id,
    (tile) => tiles.push(tile)
  );

  tiles = distinctValues(tiles);


  const perimeterTiles: Position[] = [];
  const perimeter = calculatePerimeter(grid, tiles, p => perimeterTiles.push(p));

  return {
    id,
    tiles,
    perimeter,
    perimeterTiles
  };
}

export function parseGarden(grid: string[][]): Garden {
  const garden: Garden = [];

  const seenTiles: Set<string> = new Set();
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const pos = [row, col];
      const posStr = posToStr(pos);
      if (seenTiles.has(posStr)) {
        continue;
      }
      seenTiles.add(posStr);

      const plot = findPlot(grid, pos);
      plot.tiles.map(posToStr).forEach(t => seenTiles.add(t));
      garden.push(plot);
    }
  }

  return garden;
}

export function calculatePrice({ tiles, perimeter }: Plot): number {
  return tiles.length * perimeter;
}

const day12: AdventFunction = async (
  filename = "./src/2024/day12/input.txt",
) => {
  const grid = await loadEntireFileAsGrid(filename);
  const garden = parseGarden(grid);

  const part1 = garden.map(calculatePrice).reduce((acc, curr) => acc + curr, 0);

  return [part1, 1];
};

export default day12;
