import { AdventFunction } from "../../common/types";
import { loadEntireFileAsGrid } from "../../common/processFile";
import {
  Position,
  posToStr,
  dirToStr,
  dirToShortStr,
  posAndDirToStr,
  distinctValues,
  applyDirection,
  nextStepLeavesMap,
  countSameNeighbours,
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

function printWalk(grid: string[][], pos: Position, dir: Position) {
  let asStr = "Direction " + dirToStr(dir) + "\n";
  for (let row = 0; row < grid.length; row++) {
    let rowStr = grid[row]
      .map((value, col) => {
        if (posEqual([row, col], pos)) return dirToShortStr(dir);
        return value;
      })
      .join("");
    asStr += rowStr + "\n";
  }

  console.log(asStr);
}

function toTheSideIsUs(
  grid: string[][],
  id: string,
  pos: Position,
  dir: Position,
  turn: (d: Position) => Position,
): boolean {
  let dirTurn = turn(dir);
  let result = false;
  if (!nextStepLeavesMap(grid, pos, dirTurn)) {
    let toSide = applyDirection(pos, dirTurn);
    if (grid[toSide[0]][toSide[1]] === id) {
      result = true;
    }
  }
  return result;
}

function calculateSidesWithWalk(
  grid: string[][],
  id: string,
  tiles: Position[],
): number {
  let sides = 0;

  if (tiles.length <= 2) return 4;

  let seen: Set<string> = new Set();
  let startPos = tiles[0];
  let pos = tiles[0];
  let dir = EAST;

  //console.log('Looking for Perimeter of ', {id});
  do {
    seen.add(posAndDirToStr(pos, dir));

    //printWalk(grid, pos, dir);
    if (nextStepLeavesMap(grid, pos, dir)) {
      // Have we reached the far edge of the map?
      sides++;
      let toLeftIsUs = toTheSideIsUs(grid, id, pos, dir, turnLeft);
      let toRightIsUs = toTheSideIsUs(grid, id, pos, dir, turnRight);

      if (toLeftIsUs) {
        dir = turnLeft(dir);
        //console.log('Come back on self, turn left');
        pos = applyDirection(pos, dir);
      } else {
        dir = turnRight(dir);
        //console.log('Turn Right, off edge');
      }
    } else {
      let nextPos = applyDirection(pos, dir);
      // Check to the right is you
      let dirLeft = turnLeft(dir);

      let toTheLeftIsUs = toTheSideIsUs(grid, id, pos, dir, turnLeft);

      if (toTheLeftIsUs) {
        //console.log('Turn left to stay within ourselves');
        dir = dirLeft;
        pos = applyDirection(pos, dir);
        sides++;
      } else {
        if (grid[nextPos[0]][nextPos[1]] === id) {
          //console.log('Straight on');
          pos = applyDirection(pos, dir);
        } else {
          sides++;
          dir = turnRight(dir);
          //console.log('Turn Right to stay within self');
        }
      }
    }
  } while (!seen.has(posAndDirToStr(pos, dir)));

  return sides;
}

function calculateSides(
  grid: string[][],
  id: string,
  tiles: Position[],
): number {
  let sides = 0;

  tiles.forEach(tile => {
    const sameNeighbours = countSameNeighbours(grid, tile);
    switch (sameNeighbours) {
      case 2:
        sides += 2;
        break;
      case 3:
        sides++;
        break;
      case 7:
        sides++;
        break;
    }
  });

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
  const perimeter = calculatePerimeter(grid, id, tiles, (p) =>
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
