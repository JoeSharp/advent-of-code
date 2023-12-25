import { AdventFunction } from "../../common/types";
import * as fs from "fs";
import readline from "readline";
import { PriorityQueue } from "../../common/buffers";
import simpleLogger from "../../common/simpleLogger";

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

export function convertHeightValue(d: string): number {
  switch (d) {
    case STARTING_POSITION:
      return 0;
    case END_POSITION:
      return 25;
    default:
      return d.charCodeAt(0) - LOWERCASE_A;
  }
}

export function getPositionKey(row: number, column: number): string {
  return `${row}-${column}`;
}

export function createPosition(row: number, column: number): Position {
  return {
    row,
    column,
    key: getPositionKey(row, column),
  };
}

export function loadHeightMap(filename: string): Promise<HeightMap> {
  return new Promise((resolve, reject) => {
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
}

export type IdentifyValidNextSteps = (
  heightMap: HeightMap,
  position: Position
) => Position[];

export function identifyValidNextStepsGoingDown(
  heightMap: HeightMap,
  position: Position
): Position[] {
  let minNextHeight = heightMap.content[position.row][position.column] - 1;
  let positions: Position[] = [];

  // LEFT THEN RIGHT
  [position.row - 1, position.row + 1]
    .filter((row) => row >= 0 && row < heightMap.rows)
    .forEach((row) => {
      if (heightMap.content[row][position.column] >= minNextHeight) {
        positions.push(createPosition(row, position.column));
      }
    });

  // UP THEN DOWN
  [position.column - 1, position.column + 1]
    .filter((column) => column >= 0 && column <= heightMap.columns)
    .forEach((column) => {
      if (heightMap.content[position.row][column] >= minNextHeight) {
        positions.push(createPosition(position.row, column));
      }
    });

  return positions;
}

export function identifyValidNextStepsGoingUp(
  heightMap: HeightMap,
  position: Position
): Position[] {
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
}

export type RouteTable = Map<
  string,
  { viaNode: Position | undefined; distance: number }
>;

export function findShortestPathRoutingTable(
  heightMap: HeightMap,
  startPoint: Position,
  IdentifyValidNextSteps: IdentifyValidNextSteps
): RouteTable {
  // Set of keys of visited nodes
  let visited = new Set<string>();

  // The routing table, keyed on nodes
  let routeTable: RouteTable = new Map();

  // The priority queue of nodes
  let nextToVisit = new PriorityQueue<Position>();

  nextToVisit.push(startPoint, 0);
  routeTable.set(startPoint.key, {
    viaNode: undefined,
    distance: 0,
  });

  while (!nextToVisit.isEmpty()) {
    let current = nextToVisit.pop();
    simpleLogger.debug(`Visiting Node ${current.key}`);

    let routingForCurrent = routeTable.get(current.key);

    if (routingForCurrent === undefined) {
      throw new Error("Could not establish routing for current node");
    }

    const { distance: currentDistance } = routingForCurrent;

    // Find unvisited neighbours
    IdentifyValidNextSteps(heightMap, current)
      .filter((o) => !visited.has(o.key))
      .forEach((unvisitedNode) => {
        simpleLogger.debug(`Potential Next Step ${unvisitedNode.key}`);

        const unvisitedRouting = routeTable.get(unvisitedNode.key);

        // If we haven't found this node before, or its a new shorter rout
        if (
          unvisitedRouting === undefined ||
          unvisitedRouting.distance > currentDistance + 1
        ) {
          routeTable.set(unvisitedNode.key, {
            viaNode: current,
            distance: currentDistance + 1,
          });
          nextToVisit.push(unvisitedNode, currentDistance + 1);
        }
      });
  }

  return routeTable;
}

export function findShortestRouteTo(routeTable: RouteTable, end: Position) {
  // Work backwards through routing
  let wayPoint = routeTable.get(end.key);
  let route: Position[] = [];

  if (wayPoint === undefined) {
    throw new Error("No route found");
  }

  while (wayPoint?.viaNode !== undefined) {
    route.unshift(wayPoint?.viaNode);

    wayPoint = routeTable.get(wayPoint?.viaNode.key);
  }

  return route;
}

export function findShortestPathFromStart(heightMap: HeightMap): Position[] {
  const routeTable = findShortestPathRoutingTable(
    heightMap,
    heightMap.start,
    identifyValidNextStepsGoingUp
  );
  return findShortestRouteTo(routeTable, heightMap.end);
}

export function findShortestPathFromAnyLowElevation(
  heightMap: HeightMap
): Position[] {
  const routeList: Position[][] = [];
  const routeTable = findShortestPathRoutingTable(
    heightMap,
    heightMap.end,
    identifyValidNextStepsGoingDown
  );

  heightMap.content.forEach((rowContent, rowIndex) => {
    rowContent.forEach((cell, columnIndex) => {
      // Found low elevation
      if (cell === 0) {
        const startPosition = createPosition(rowIndex, columnIndex);
        try {
          const route = findShortestRouteTo(routeTable, startPosition);
          routeList.push(route);
          simpleLogger.debug(
            `Route From ${startPosition.key} to ${heightMap.end.key} is ${route
              .map((r) => r.key)
              .join(" -> ")}`
          );
        } catch (e) {
          simpleLogger.debug(
            `No route could be found from low elevation point ${startPosition.key}`
          );
        }
      }
    });
  });

  routeList.sort((a, b) => a.length - b.length);

  return routeList[0];
}

const day12: AdventFunction = async (filename = "./src/2022/day12/input.txt") => {
  const heightMap = await loadHeightMap(filename);
  const partOne = findShortestPathFromStart(heightMap);
  const partTwo = findShortestPathFromAnyLowElevation(heightMap);

  return new Promise((resolve) => {
    resolve([partOne.length, partTwo.length]);
  });
};

export default day12;
