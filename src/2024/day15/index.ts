import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";
import {
  Position,
  posToStr,
  dirArrayToStr,
  gridArrayToStr,
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

export function applyDirection(
  warehouse: Warehouse,
  direction: Position,
): Warehouse {
  return warehouse;
}

export function processProblem(problem: Problem): Warehouse {
  return problem.directions.reduce(
    (acc, curr) => applyDirection(acc, curr),
    problem.warehouse,
  );
}

const day15: AdventFunction = async (
  filename = "./src/2024/day15/input.txt",
) => {
  const problem = await parseProblem(filename);

  const warehouseAfter = processProblem(problem);

  return [1, 1];
};

export default day15;
