import { AdventFunction } from "../common/types";
import * as fs from "fs";
import readline from "readline";
import { PriorityQueue } from "../common/buffers";

export interface Position {
  key: string;
  row: number;
  column: number;
}

const STARTING_POSITION = "S";
const END_POSITION = "E";
const LOWERCASE_A = "a".charCodeAt(0);

export type HeightMap = {
  rows: number;
  columns: number;
  start: Position;
  end: Position;
  content: number[][];
};

export const convertHeightValue = (d: string): number => {
  switch (d) {
    case STARTING_POSITION:
      return 0;
    case END_POSITION:
      return 25;
    default:
      return d.charCodeAt(0) - LOWERCASE_A;
  }
};

export const createPosition = (row: number, column: number): Position => ({
  row,
  column,
  key: `${row}-${column}`,
});

export const loadHeightMap = (filename: string): Promise<HeightMap> =>
  new Promise((resolve, reject) => {
    let start: Position | undefined;
    let end: Position | undefined;
    const content: number[][] = [];

    var r = readline.createInterface({
      input: fs.createReadStream(filename),
    });
    r.on("line", (line) => {
      content.push(
        line.split("").map((d, column) => {
          switch (d) {
            case STARTING_POSITION:
              start = createPosition(content.length, column);
              break;
            case END_POSITION:
              end = createPosition(content.length, column);
              break;
          }

          return convertHeightValue(d);
        })
      );
    }).on("close", () => {
      if (content.length === 0) {
        reject("Not enough content lines");
        return;
      }
      if (start === undefined) {
        reject("Did not find start position");
        return;
      }
      if (end === undefined) {
        reject("Did not find end position");
        return;
      }

      resolve({
        start,
        end,
        rows: content.length,
        columns: content[0].length,
        content,
      });
    });
  });

export const identifyValidNextSteps = (
  heightMap: HeightMap,
  position: Position
): Position[] => {
  let maxNextHeight = heightMap.content[position.row][position.column] + 1;
  let positions: Position[] = [];

  // LEFT THEN RIGHT
  [position.row - 1, position.row + 1]
    .filter((row) => row >= 0 && row < heightMap.rows)
    .forEach((row) => {
      if (heightMap.content[row][position.column] <= maxNextHeight) {
        positions.push(createPosition(row, position.column));
      }
    });

  // UP THEN DOWN
  [position.column - 1, position.column + 1]
    .filter((column) => column >= 0 && column < heightMap.columns)
    .forEach((column) => {
      if (heightMap.content[position.row][column] <= maxNextHeight) {
        positions.push(createPosition(position.row, column));
      }
    });

  return positions;
};

export const findShortestPath = (heightMap: HeightMap): Position[] => {
  let visited = new Set<string>();
  let routeTable = new Map<
    string,
    {
      viaNode: string;
      distance: number;
    }
  >();
  let nextToVisit = new PriorityQueue<Position>();

  nextToVisit.push(heightMap.start, 0);

  while (!nextToVisit.isEmpty()) {
    let current = nextToVisit.pop();

    // Find unvisited neighbours
    let potentialNextSteps = identifyValidNextSteps(heightMap, current).filter(
      (o) => !visited.has(o.key)
    );
  }

  return [];
};

const day12: AdventFunction = async (filename = "./src/day12/input.txt") => {
  const heightMap = await loadHeightMap(filename);
  const shortestPath = findShortestPath(heightMap);

  return new Promise((resolve) => {
    resolve([shortestPath.length, 1]);
  });
};

export default day12;
