import * as fs from "fs";
import readline from "readline";
import { AdventFunction } from "../../common/types";
import { isSamePoint, Point2D } from "../../common/geometry";

export const SAND_SOURCE: Point2D = {
  x: 500,
  y: 0,
};

export enum OccupiedBy {
  rock = "#",
  sand = "o",
  air = ".",
}

export type RockPath = Point2D[];

export function rockMapToString(
  rockMap: RockMap,
  ingressPoint: Point2D,
): string {
  const points = [ingressPoint, ...[...rockMap.contents].map(parseRockPoint)];
  const minX = points
    .map(({ x }) => x)
    .reduce((acc, curr) => (isNaN(acc) ? curr : curr < acc ? curr : acc), NaN);
  const maxX = points
    .map(({ x }) => x)
    .reduce((acc, curr) => (isNaN(acc) ? curr : curr > acc ? curr : acc), NaN);
  const minY = points
    .map(({ y }) => y)
    .reduce((acc, curr) => (isNaN(acc) ? curr : curr < acc ? curr : acc), NaN);
  const maxY = points
    .map(({ y }) => y)
    .reduce((acc, curr) => (isNaN(acc) ? curr : curr > acc ? curr : acc), NaN);

  let asString = `Lowest Point: ${rockMap.lowestPoint}, MinX: ${minX}, MaxX: ${maxX}, MinY: ${minY}, MaxY:${maxY}\n`;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      let point = { x, y };
      if (isSamePoint(point, ingressPoint)) {
        asString += "I";
      } else {
        asString += occupiedBy(rockMap, point);
      }
    }

    asString += "\n";
  }

  return asString;
}

export const rockPointToString = ({ x, y }: Point2D) => `${x},${y}`;

/**
 * Given a series of points, we need to figure out which coordinates are occupied with rock.
 * We will use a Set of string representations for all the occupied ones.
 */
export type RockMap = {
  originalContents: Set<String>;
  contents: Set<string>;
  lowestPoint: number;
};

/**
 * Identify all the points between two points.
 * Including the endpoints.
 *
 * @param pointA The first point
 * @param pointB The second point
 */
export function findPointsOnPath(pointA: Point2D, pointB: Point2D): Point2D[] {
  let minX = Math.min(pointA.x, pointB.x);
  let maxX = Math.max(pointA.x, pointB.x);
  let minY = Math.min(pointA.y, pointB.y);
  let maxY = Math.max(pointA.y, pointB.y);

  const result: Point2D[] = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      result.push({ x, y });
    }
  }

  return result;
}

/**
 * Given a set of paths, fills the gaps between them to figure out all the spaces that are occupied
 *
 * @param paths The paths to sketch out
 * @returns A map of all the occupied rock spaces
 */
export function createRockMap(paths: RockPath[]): RockMap {
  const contents = new Set<string>();
  const originalContents = new Set<string>();
  let lowestPoint = 0;

  paths.forEach((path) => {
    for (let i = 1; i < path.length; i++) {
      findPointsOnPath(path[i - 1], path[i])
        .map((p) => {
          lowestPoint = Math.max(p.y, lowestPoint);
          return rockPointToString(p);
        })
        .forEach((p) => {
          contents.add(p);
          originalContents.add(p);
        });
    }
  });

  return { contents, originalContents, lowestPoint };
}

/**
 * Decide if a space is occupied by rock or sand
 *
 * @param rockMap The rock map
 * @param point The point under evaluation
 * @returns True if that point is occupied by rock
 */
export function occupiedBy(
  { contents, originalContents }: RockMap,
  point: Point2D,
): OccupiedBy {
  const rockStr = rockPointToString(point);
  if (originalContents.has(rockStr)) {
    return OccupiedBy.rock;
  } else if (contents.has(rockStr)) {
    return OccupiedBy.sand;
  } else {
    return OccupiedBy.air;
  }
}

/**
 * Populate a spot in a rock map so it's now considered filled.
 * @param rockMap The rock map to fill in
 * @param point The point to occupy.
 */
export function occupyRockPoint({ contents }: RockMap, point: Point2D) {
  contents.add(rockPointToString(point));
}

/**
 * Locate the next point that a bit of sand will fall into.
 *
 * @param rockMap The current state of the rock
 * @param point The point the sand is currently at
 * @returns The next point for the sand to fall into
 */
export function getNextPoint(
  rockMap: RockMap,
  point: Point2D,
): Point2D | undefined {
  // Go Down, Go Down-Left, Go Down-Right
  // Find first of those spots that is not occupied
  return [point.x, point.x - 1, point.x + 1]
    .map((x) => ({ x, y: point.y + 1 }))
    .find((p) => occupiedBy(rockMap, p) === OccupiedBy.air);
}

/**
 * Take a path part and parse it into a coordinate
 * @param input The input string
 * @returns The parsed coordinate
 */
export function parseRockPoint(input: string): Point2D {
  const parts = input
    .split(",")
    .map((c) => parseInt(c, 10))
    .filter((c) => !isNaN(c));

  if (parts.length !== 2)
    throw new Error("Invalid input, wrong number of parts when split by comma");

  return {
    x: parts[0],
    y: parts[1],
  };
}

/**
 * Parse a line from the input file into a complete set of points defining the path.
 * @param input The entire line from the input file
 * @returns the parsed path
 */
export function parseRockPath(input: string): RockPath {
  return input
    .split("->")
    .map((p) => p.trim())
    .map(parseRockPoint);
}

/**
 * Load the input filename and parse out the entire rock map.
 * @param filename the file to process
 * @returns
 */
export function loadRockMap(filename: string): Promise<RockMap> {
  return new Promise<RockMap>((resolve) => {
    const paths: RockPath[] = [];

    var r = readline.createInterface({
      input: fs.createReadStream(filename),
    });
    r.on("line", (line) => {
      paths.push(parseRockPath(line));
    }).on("close", () => {
      resolve(createRockMap(paths));
    });
  });
}

/**
 * Drops a blob of sand into the given rock structure from a set point.
 * In this scenario, below the scanned structure is an abyss.
 *
 * @param rockMap The rock map on which to operate. The map is mutated by this operation
 * @param startingPoint The point at which the sand is being dropped
 * @returns Boolean to indicate if the sand settled. True = settled, False = fell into abyss
 */
export function dropSandToFallThrough(
  rockMap: RockMap,
  ingressPoint: Point2D,
): boolean {
  let currentLocation = { ...ingressPoint };

  while (currentLocation.y < rockMap.lowestPoint) {
    const nextPoint = getNextPoint(rockMap, currentLocation);

    // If there is no 'next point', the sand must have settled
    if (nextPoint === undefined) {
      occupyRockPoint(rockMap, currentLocation);
      return true;
    }

    currentLocation = nextPoint;
  }

  return false;
}

/**
 * Keeps dropping sand until a bit falls into the abyss.
 *
 * @param rockMap The rock map on which to operate, it will be mutated by this operation
 * @param ingressPoint
 */
export function dropSandUntilFallThrough(
  rockMap: RockMap,
  ingressPoint: Point2D,
): number {
  let settled = false;
  let numberOfGrains = 0;
  do {
    settled = dropSandToFallThrough(rockMap, ingressPoint);
    if (settled) {
      numberOfGrains++;
    }
  } while (settled);

  return numberOfGrains;
}

/**
 * Drops a blob of sand into the given rock structure from a set point.
 * In this scenario, there is an infinitely wide floor 2 block below the lowest measured structure.
 *
 * @param rockMap The rock map on which to operate. The map is mutated by this operation
 * @param startingPoint The point at which the sand is being dropped
 */
export function dropSandToHitFloor(rockMap: RockMap, ingressPoint: Point2D) {
  let currentLocation = { ...ingressPoint };

  while (currentLocation.y < rockMap.lowestPoint + 1) {
    const nextPoint = getNextPoint(rockMap, currentLocation);

    // If there is no 'next point', the sand must have settled
    if (nextPoint === undefined) {
      break;
    }

    currentLocation = nextPoint;
  }
  occupyRockPoint(rockMap, currentLocation);
}

/**
 * Keeps dropping sand until the ingress point is plugged
 * @param rockMap The rock map on which to operate, it will be mutated by this operation
 * @param ingressPoint
 */
export function dropSandUntilGapPlugged(
  rockMap: RockMap,
  ingressPoint: Point2D,
): number {
  let numberOfGrains = 0;
  while (occupiedBy(rockMap, ingressPoint) === OccupiedBy.air) {
    dropSandToHitFloor(rockMap, ingressPoint);
    numberOfGrains++;
  }

  return numberOfGrains;
}

export const SAND_STARTING_POINT: Point2D = {
  x: 500,
  y: 0,
};

const day14: AdventFunction = async (
  filename = "./src/2022/day14/input.txt",
) => {
  const rockMap1 = await loadRockMap(filename);
  const partOne = dropSandUntilFallThrough(rockMap1, SAND_STARTING_POINT);

  const rockMap2 = await loadRockMap(filename);
  const partTwo = dropSandUntilGapPlugged(rockMap2, SAND_STARTING_POINT);

  return [partOne, partTwo];
};

export default day14;
