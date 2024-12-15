import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";
import {
  Position,
  posToStr,
  dirToShortStr,
  dirArrayToStr,
  gridArrayToStr,
  findInstancesOf,
  applyDirection,
  NORTH,
  SOUTH,
  WEST,
  EAST,
  NONSENSE,
} from "../../common/arrayUtils";

export const ROBOT = "@";

export enum WarehouseSlot {
  WALL = "#",
  BOX = "O",
  EMPTY = ".",
}

export interface Warehouse {
  contents: WarehouseSlot[][];
  robotPosition: Position;
}

export interface Problem {
  warehouse: Warehouse;
  directions: Position[];
}

export function warehouseToStr(warehouse: Warehouse): string {
  let asStr = `Robot at ${posToStr(warehouse.robotPosition)}\n`;
  asStr += gridArrayToStr(warehouse.contents);
  asStr += "\n";

  return asStr;
}

export function problemToStr(problem: Problem) {
  let asStr = warehouseToStr(problem.warehouse);
  asStr += `Directions: ${dirArrayToStr(problem.directions)}`;
  return asStr;
}

export function calculateGpsValue([r, c]: Position): number {
  return 100 * r + c;
}

export function calculateWarehouseValue(warehouse: Warehouse): number {
  return findInstancesOf(warehouse.contents, (v) => v === WarehouseSlot.BOX)
    .map(calculateGpsValue)
    .reduce((acc, curr) => acc + curr, 0);
}

export function parseWarehouse(lines: string[]) {
  let robotPosition: Position = NONSENSE;

  const contents: WarehouseSlot[][] = lines.map((line, row) =>
    line.split("").map((value, column) => {
      if (value === ROBOT) {
        robotPosition = [row, column];
        return WarehouseSlot.EMPTY;
      } else {
        switch (value) {
          case WarehouseSlot.BOX:
            return WarehouseSlot.BOX;
          case WarehouseSlot.EMPTY:
            return WarehouseSlot.EMPTY;
          case WarehouseSlot.WALL:
            return WarehouseSlot.WALL;
        }
      }

      throw new Error("Invalid warehouse contents");
    }),
  );

  return {
    contents,
    robotPosition,
  };
}

export function directionFromStr(input: string): Position {
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

export function parseDirections(lines: string[]) {
  return lines.flatMap((l) => l.split("")).map(directionFromStr);
}

export async function parseProblem(filename: string): Promise<Problem> {
  const lines = await loadEntireFile(filename);

  const emptyLine = lines.findIndex((l) => l.length === 0);

  const warehouseLines = lines.slice(0, emptyLine);
  const directionLines = lines.slice(emptyLine);
  const warehouse = parseWarehouse(warehouseLines);
  const directions = parseDirections(directionLines);

  return {
    warehouse,
    directions,
  };
}

function getContents(warehouse: Warehouse, [r, c]: Position): WarehouseSlot {
  return warehouse.contents[r][c];
}

function setContents(warehouse: Warehouse, [r, c]: Position, value: WarehouseSlot) {
  warehouse.contents[r][c] = value;
}

export function tryToShiftBox(
  warehouse: Warehouse,
  direction: Position,
  nextSpot: Position,
) {
  let position = nextSpot;

  while (getContents(warehouse, position) !== WarehouseSlot.WALL) {
    if (getContents(warehouse, position) === WarehouseSlot.EMPTY) {
      warehouse.robotPosition = nextSpot;
      setContents(warehouse, position, WarehouseSlot.BOX);
      setContents(warehouse, nextSpot, WarehouseSlot.EMPTY);
      break;
    }
    position = applyDirection(position, direction);
  }
}

export function moveRobot(
  warehouse: Warehouse,
  into: Position
) {
  const [r, c] = warehouse.robotPosition;
  warehouse.contents[r][c] = WarehouseSlot.EMPTY;
  warehouse.robotPosition = into;
}

export function applyMove(
  warehouse: Warehouse,
  direction: Position,
): Warehouse {
  const [nr, nc] = applyDirection(warehouse.robotPosition, direction);
  const occupiedBy = warehouse.contents[nr][nc];

  switch (occupiedBy) {
    case WarehouseSlot.WALL:
      break;
    case WarehouseSlot.BOX:
      tryToShiftBox(warehouse, direction, [nr, nc]);
      break;
    case WarehouseSlot.EMPTY:
      moveRobot(warehouse, [nr, nc]);
      break;
  }

  return warehouse;
}

export function processProblem(problem: Problem): Warehouse {
  return problem.directions.reduce(
    (acc, curr) => applyMove(acc, curr),
    problem.warehouse,
  );
}

const day15: AdventFunction = async (
  filename = "./src/2024/day15/input.txt",
) => {
  const problem = await parseProblem(filename);

  const warehouseAfter = processProblem(problem);
  const part1 = calculateWarehouseValue(warehouseAfter);

  return [part1, 1];
};

export default day15;
