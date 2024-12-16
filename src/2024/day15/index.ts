import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";
import {
  Position,
  posEqual,
  posToStr,
  dirToShortStr,
  gridArrayToStr,
  findInstancesOf,
  applyDirection,
  turnRight,
  turnLeft,
  NORTH,
  SOUTH,
  WEST,
  EAST,
  NONSENSE,
} from "../../common/arrayUtils";

export enum WarehouseSlot {
  ROBOT = "@",
  WALL = "#",
  BOX = "O",
  BOX_LEFT = "[",
  BOX_RIGHT = "]",
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

export function expandWarehouse(warehouse: Warehouse): Warehouse {
  let robotPosition: Position = NONSENSE;

  const contents: WarehouseSlot[][] = warehouse.contents.map((line, row) => {
    return line.flatMap((value, col) => {
      switch (value) {
        case WarehouseSlot.ROBOT:
          robotPosition = [row, col * 2] as Position;
          return [WarehouseSlot.ROBOT, WarehouseSlot.EMPTY];
        case WarehouseSlot.WALL:
          return [WarehouseSlot.WALL, WarehouseSlot.WALL];
        case WarehouseSlot.BOX:
          return [WarehouseSlot.BOX_LEFT, WarehouseSlot.BOX_RIGHT];
        case WarehouseSlot.EMPTY:
          return [WarehouseSlot.EMPTY, WarehouseSlot.EMPTY];
      }
      return [WarehouseSlot.EMPTY, WarehouseSlot.EMPTY];
    });
  });

  return {
    robotPosition,
    contents,
  };
}

export function warehouseToStr(warehouse: Warehouse): string {
  let asStr = `Robot at ${posToStr(warehouse.robotPosition)}\n`;
  asStr += gridArrayToStr(warehouse.contents);
  asStr += "\n";
  return asStr;
}

export function problemToStr(problem: Problem) {
  let asStr = warehouseToStr(problem.warehouse);
  asStr += `Directions: ${problem.directions.map((d) => dirToShortStr(d)).join("")}`;
  return asStr;
}

export function calculateGpsValue([r, c]: Position): number {
  return 100 * r + c;
}

function isBox(value: WarehouseSlot): boolean {
  if (value === WarehouseSlot.BOX) return true;
  if (value === WarehouseSlot.BOX_LEFT) return true;
  return false;
}

export function calculateWarehouseValue(warehouse: Warehouse): number {
  return findInstancesOf(warehouse.contents, isBox)
    .map(calculateGpsValue)
    .reduce((acc, curr) => acc + curr, 0);
}

export function parseWarehouse(lines: string[]) {
  let robotPosition: Position = NONSENSE;

  const contents: WarehouseSlot[][] = lines.map((line, row) =>
    line.split("").map((value, column) => {
      if (value === WarehouseSlot.ROBOT) {
        robotPosition = [row, column];
        return WarehouseSlot.ROBOT;
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

function setContents(
  warehouse: Warehouse,
  [r, c]: Position,
  value: WarehouseSlot,
) {
  warehouse.contents[r][c] = value;
}

function getOtherHalfOfBox(
  direction: Position,
  nextSpot: Position,
  occupiedBy: WarehouseSlot,
  isNorth: boolean,
) {
  let dirToOtherHalf: Position;
  if (occupiedBy === WarehouseSlot.BOX_LEFT) {
    if (isNorth) {
      dirToOtherHalf = turnRight(direction);
    } else {
      dirToOtherHalf = turnLeft(direction);
    }
  } else {
    if (isNorth) {
      dirToOtherHalf = turnLeft(direction);
    } else {
      dirToOtherHalf = turnRight(direction);
    }
  }

  return applyDirection(nextSpot, dirToOtherHalf);
}

interface FutureSlot {
  position: Position;
  value: WarehouseSlot;
}

function canMoveForward(
  warehouse: Warehouse,
  direction: Position,
  nextSpot: Position,
  occupiedBy: WarehouseSlot,
  prepMove: (move: FutureSlot) => void,
  vacate: (pos: Position) => void,
): boolean {
  const positions: Position[] = [nextSpot];
  if (posEqual(NORTH, direction)) {
    positions.push(getOtherHalfOfBox(direction, nextSpot, occupiedBy, true));
  }
  if (posEqual(SOUTH, direction)) {
    positions.push(getOtherHalfOfBox(direction, nextSpot, occupiedBy, false));
  }

  return positions.every((p) => {
    vacate(p);
    let next = applyDirection(p, direction);
    let nContent = getContents(warehouse, next);
    switch (nContent) {
      case WarehouseSlot.WALL:
        return false;
      case WarehouseSlot.EMPTY: {
        prepMove({ position: next, value: getContents(warehouse, p) });
        return true;
      }
      case WarehouseSlot.BOX_RIGHT:
      case WarehouseSlot.BOX_LEFT: {
        prepMove({ position: next, value: getContents(warehouse, p) });
        return canMoveForward(
          warehouse,
          direction,
          next,
          nContent,
          prepMove,
          vacate,
        );
      }
    }
  });
}

export function tryToShiftDoubleBox(
  warehouse: Warehouse,
  direction: Position,
  nextSpot: Position,
  occupiedBy: WarehouseSlot,
) {
  const moves: FutureSlot[] = [];
  const vacated: Position[] = [];

  if (
    canMoveForward(
      warehouse,
      direction,
      nextSpot,
      occupiedBy,
      (m) => moves.push(m),
      (v) => vacated.push(v),
    )
  ) {
    moves.forEach(({ position, value }) =>
      setContents(warehouse, position, value),
    );
    vacated
      .filter(
        (v) =>
          !moves.map(({ position }) => position).some((p) => posEqual(p, v)),
      )
      .forEach((v) => setContents(warehouse, v, WarehouseSlot.EMPTY));

    moveRobot(warehouse, nextSpot);
  }
}

export function tryToShiftSingleBox(
  warehouse: Warehouse,
  direction: Position,
  nextSpot: Position,
  occupiedBy: WarehouseSlot,
) {
  let position = nextSpot;

  let contents = occupiedBy;

  while (getContents(warehouse, position) !== WarehouseSlot.WALL) {
    if (getContents(warehouse, position) === WarehouseSlot.EMPTY) {
      setContents(warehouse, position, WarehouseSlot.BOX);
      moveRobot(warehouse, nextSpot);
      break;
    }
    position = applyDirection(position, direction);
  }
}

export function moveRobot(warehouse: Warehouse, into: Position) {
  const [r, c] = warehouse.robotPosition;
  warehouse.contents[r][c] = WarehouseSlot.EMPTY;
  warehouse.contents[into[0]][into[1]] = WarehouseSlot.ROBOT;

  warehouse.robotPosition = into;
}

function applyMove(warehouse: Warehouse, direction: Position) {
  const nextPosition = applyDirection(warehouse.robotPosition, direction);
  const occupiedBy = getContents(warehouse, nextPosition);

  switch (occupiedBy) {
    case WarehouseSlot.WALL:
      return;
    case WarehouseSlot.BOX:
      tryToShiftSingleBox(warehouse, direction, nextPosition, occupiedBy);
      return;
    case WarehouseSlot.BOX_LEFT:
    case WarehouseSlot.BOX_RIGHT:
      tryToShiftDoubleBox(warehouse, direction, nextPosition, occupiedBy);
      return;
    case WarehouseSlot.EMPTY:
      moveRobot(warehouse, nextPosition);
      return;
  }
}

export function processProblem(warehouse: Warehouse, directions: Position[]) {
  directions.forEach((direction) => applyMove(warehouse, direction));
}

const day15: AdventFunction = async (
  filename = "./src/2024/day15/input.txt",
) => {
  const { warehouse, directions } = await parseProblem(filename);
  const expandedWarehouse = expandWarehouse(warehouse);

  processProblem(warehouse, directions);
  const part1 = calculateWarehouseValue(warehouse);

  processProblem(expandedWarehouse, directions);
  const part2 = calculateWarehouseValue(expandedWarehouse);

  return [part1, part2];
};

export default day15;
