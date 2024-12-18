import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";
import {
  applyDirection,
  nextStepLeavesMap,
  gridArrayToStr,
  CROSS_DIRECTIONS,
  posToStr,
  Position,
  NONSENSE,
} from "../../common/arrayUtils";
import { PriorityQueue } from "../../common/buffers";

export const START_POSITION: Position = [0, 0];

enum MemoryCell {
  EMPTY = ".",
  CORRUPTED = "#",
}

export function create2dArray<T>(
  rows: number,
  columns: number,
  value: T,
): T[][] {
  const result: T[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: T[] = [];
    for (let c = 0; c < columns; c++) {
      row.push(value);
    }
    result.push(row);
  }

  return result;
}

export function simulateCorruption(
  gridSize: number,
  corrupted: Position[],
  iterations: number,
): MemoryCell[][] {
  const memory: MemoryCell[][] = create2dArray(
    gridSize,
    gridSize,
    MemoryCell.EMPTY,
  );

  for (let i = 0; i < iterations; i++) {
    const [r, c] = corrupted[i];

    memory[r][c] = MemoryCell.CORRUPTED;
  }

  return memory;
}

interface NodeCost {
  cost: number;
  via: Position;
}

function getNeighbours(memory: MemoryCell[][], position: Position): Position[] {
  return CROSS_DIRECTIONS.filter((d) => !nextStepLeavesMap(memory, position, d))
    .map((d) => applyDirection(position, d))
    .filter(([r, c]) => memory[r][c] === MemoryCell.EMPTY);
}

export function findBestRoute(
  start: Position,
  end: Position,
  memory: MemoryCell[][],
): Position[] {
  console.log("Find Best Route");
  console.log(gridArrayToStr(memory));

  // Mark all nodes as infinity, except start
  const unvisited: PriorityQueue<Position> = new PriorityQueue();
  const reached: Map<string, NodeCost> = new Map();
  for (let r = 0; r < memory.length; r++) {
    for (let c = 0; c < memory.length; c++) {
      if (!(r === 0 && c === 0) && memory[r][c] === MemoryCell.EMPTY) {
        const position: Position = [r, c];
        const asStr = posToStr(position);
        const nodeCost: NodeCost = { cost: Infinity, via: NONSENSE };
        reached.set(asStr, nodeCost);
        unvisited.push(position, nodeCost.cost);
      }
    }
  }

  reached.set(posToStr(start), { cost: 0, via: NONSENSE });
  unvisited.push(START_POSITION, 0);

  //console.log("Reached", reached);
  //console.log('Unvisited', unvisited.toString());

  let index = 8;
  while (!unvisited.isEmpty()) {
    if (index-- < 0) break;
    const next = unvisited.popBack();
    const neighbours = getNeighbours(memory, next);

    console.log("Evaluating", { next, neighbours });
  }

  // Set the non-visited node with the smallest current distance as the current node.
  // For each neighbor, N of the current node adds the current distance of the adjacent node with the weight of the edge connecting 0->1.
  //   If it is smaller than the current distance of Node, set it as the new current distance of N.
  // Mark the current node 1 as visited.
  // Go to step 2 if there are any nodes are unvisited.

  return [];
}

export function parseCoordinate(input: string): Position {
  return input.split(",").map((d) => parseInt(d)) as Position;
}

export async function loadCoordinates(filename: string): Promise<Position[]> {
  return (await loadEntireFile(filename)).map(parseCoordinate);
}

export const GRID_SIZE = 71; // 0 -> 70 inclusive
export const DEFAULT_ITERATIONS = 1024;

const day18: AdventFunction = async (
  filename = "./src/2024/day18/input.txt",
) => {
  const start: Position = [0, 0];
  const end: Position = [GRID_SIZE - 1, GRID_SIZE - 1];

  const coordinates = await loadCoordinates(filename);
  const memory = simulateCorruption(GRID_SIZE, coordinates, DEFAULT_ITERATIONS);
  const route = findBestRoute(start, end, memory);
  const part1 = route.length;

  return [part1, 1];
};

export default day18;
