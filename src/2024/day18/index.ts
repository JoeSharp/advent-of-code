import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";
import {
  applyDirection,
  nextStepLeavesMap,
  gridArrayToStr,
  posEqual,
  CROSS_DIRECTIONS,
  posToStr,
  Position,
  NONSENSE,
} from "../../common/arrayUtils";

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
  position: Position;
  cost: number;
  via: Position;
  visited: boolean;
}

function getNeighbours(memory: MemoryCell[][], position: Position): Position[] {
  return CROSS_DIRECTIONS.filter((d) => !nextStepLeavesMap(memory, position, d))
    .map((d) => applyDirection(position, d))
    .filter(([r, c]) => memory[r][c] === MemoryCell.EMPTY);
}

function findShortestUnvisitedNode(
  nodes: Map<string, NodeCost>,
): NodeCost | undefined {
  let nextNode: NodeCost | undefined;

  nodes.forEach((node) => {
    if (node.visited) return;
    if (node.cost === Infinity) return;

    if (nextNode === undefined) {
      nextNode = node;
      return;
    }

    if (nextNode.cost > node.cost) {
      nextNode = node;
      return;
    }
  });

  return nextNode;
}

function createNodeMap(start: Position, memory: MemoryCell[][]) {
  const nodes: Map<string, NodeCost> = new Map();
  for (let r = 0; r < memory.length; r++) {
    for (let c = 0; c < memory.length; c++) {
      if (!(r === 0 && c === 0) && memory[r][c] === MemoryCell.EMPTY) {
        const position: Position = [r, c];
        const asStr = posToStr(position);
        const nodeCost: NodeCost = {
          cost: Infinity,
          via: NONSENSE,
          visited: false,
          position,
        };
        nodes.set(asStr, nodeCost);
      }
    }
  }

  nodes.set(posToStr(start), {
    position: start,
    cost: 0,
    via: NONSENSE,
    visited: false,
  });

  return nodes;
}

function readOffRoute(
  start: Position,
  end: Position,
  nodes: Map<string, NodeCost>,
): Position[] {
  const endAsStr = posToStr(end);
  let node = nodes.get(endAsStr);

  let route: Position[] = [];

  while (!!node && !posEqual(node.position, start)) {
    route.unshift(node.position);

    const viaAsStr = posToStr(node.via);
    node = nodes.get(viaAsStr);
  }

  return route;
}

export function findBestRoute(
  start: Position,
  end: Position,
  memory: MemoryCell[][],
): Position[] {
  const nodes: Map<string, NodeCost> = createNodeMap(start, memory);

  // Mark all nodes as infinity, except start
  let node = findShortestUnvisitedNode(nodes);
  while (!!node) {
    if (posEqual(node.position, end)) {
      return readOffRoute(start, end, nodes);
    }

    const neighbours = getNeighbours(memory, node.position);
    const costToNeighbour = node.cost + 1;

    neighbours
      .map(posToStr)
      .map((p) => nodes.get(p)!)
      .forEach((neighbourNode) => {
        if (costToNeighbour < neighbourNode.cost) {
          neighbourNode.cost = costToNeighbour;
          neighbourNode.via = node!.position;
        }
      });

    node.visited = true;
    node = findShortestUnvisitedNode(nodes);
  }

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

export async function findShortestRouteLength(
  filename: string,
  gridSize: number,
  iterations: number,
): Promise<number> {
  const start: Position = [0, 0];
  const end: Position = [gridSize - 1, gridSize - 1];

  const coordinates = await loadCoordinates(filename);
  const memory = simulateCorruption(gridSize, coordinates, iterations);
  const route = findBestRoute(start, end, memory);
  return route.length;
}

export async function findCoordinatesOfFirstObstructingCorruption(
  filename: string,
  gridSize: number,
  startingIteration: number = 1,
): Promise<string> {
  const start: Position = [0, 0];
  const end: Position = [gridSize - 1, gridSize - 1];

  const coordinates = await loadCoordinates(filename);
  for (let i = startingIteration; i < coordinates.length; i++) {
    const memory = simulateCorruption(gridSize, coordinates, i);
    const route = findBestRoute(start, end, memory);

    // No route available!
    if (route.length === 0) {
      return posToStr(coordinates[i - 1]);
    }
  }

  return posToStr(NONSENSE);
}

const day18: AdventFunction = async (
  filename = "./src/2024/day18/input.txt",
) => {
  const part1 = await findShortestRouteLength(
    filename,
    GRID_SIZE,
    DEFAULT_ITERATIONS,
  );
  const part2 = await findCoordinatesOfFirstObstructingCorruption(
    filename,
    GRID_SIZE,
    2824,
  );

  return [part1, part2];
};

export default day18;
