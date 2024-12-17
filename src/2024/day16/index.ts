import { AdventFunction } from "../../common/types";
import {
  Position,
  posToStr,
  dirToShortStr,
  findInstancesOf,
  gridArrayToStr,
  CROSS_DIRECTIONS,
  NORTH,
  SOUTH,
  WEST,
  EAST,
  applyDirection,
} from "../../common/arrayUtils";
import { loadEntireFileAsGrid } from "../../common/processFile";

export const START = "S";
export const END = "E";
export const WALL = "#";
export const EMPTY = ".";

export const MOVE_SCORE = 1;
export const ROTATE_SCORE = 1000;

export interface RawMaze {
  contents: string[][];
  start: Position;
  end: Position;
}

export interface Edge {
  from: Position;
  to: Position;
  direction: Position;
}

export interface Graph {
  start: Position;
  end: Position;
  nodes: Position[];
  edges: Edge[];
}

export function edgeToStr({ from, to, direction }: Edge): string {
  return `from: ${posToStr(from)} ${dirToShortStr(direction)}   ${posToStr(to)}`;
}

export function graphToStr({ start, end, nodes, edges }: Graph): string {
  let asStr = "Graph\n";
  asStr += `Start: ${posToStr(start)}\n`;
  asStr += `End: ${posToStr(end)}\n`;

  asStr += `\nEdges: ${nodes.length}\n`;
  asStr += edges.map(edgeToStr).join("\n");
  asStr += `\nNodes: ${nodes.length}\n`;
  asStr += nodes.map(posToStr).join(", ");

  return asStr;
}

function findEdge(
  contents: string[][],
  node: Position,
  direction: Position,
): Edge | undefined {
  let position = node;

  while (contents[position[0]][position[1]] !== WALL) {
    position = applyDirection(position, direction);

    if (
      contents[position[0]][position[1]] === EMPTY &&
      nodeIsACorner(contents, position)
    ) {
      return {
        from: node,
        to: position,
        direction,
      };
    }
  }

  return undefined;
}

export function findEdges(contents: string[][], node: Position): Edge[] {
  return CROSS_DIRECTIONS.map((direction) =>
    findEdge(contents, node, direction),
  ).filter((e) => e !== undefined) as Edge[];
}

function nodeHasEmptyNeighbours(
  contents: string[][],
  position: Position,
  directions: Position[],
): boolean {
  return (
    directions
      .map((d) => applyDirection(position, d))
      .filter(([r, c]) => contents[r][c] === EMPTY).length > 0
  );
}

function nodeIsACorner(contents: string[][], position: Position) {
  return (
    nodeHasEmptyNeighbours(contents, position, [NORTH, SOUTH]) &&
    nodeHasEmptyNeighbours(contents, position, [WEST, EAST])
  );
}

export function convertMazeToGraph({ start, end, contents }: RawMaze): Graph {
  let nodes: Position[] = findInstancesOf(contents, (v) => v === EMPTY).filter(
    (p) => nodeIsACorner(contents, p),
  );

  let edges: Edge[] = nodes.flatMap((node) => findEdges(contents, node));

  return {
    start,
    end,
    nodes,
    edges,
  };
}

export async function loadRawMaze(filename: string): Promise<RawMaze> {
  const contents = await loadEntireFileAsGrid(filename);

  const sTiles = findInstancesOf(contents, (v) => v === START);
  const eTiles = findInstancesOf(contents, (v) => v === END);

  if (sTiles.length !== 1) throw new Error("Multiple start points?");
  if (eTiles.length !== 1) throw new Error("Multiple end points?");

  const start = sTiles[0];
  const end = eTiles[0];
  contents[start[0]][start[1]] = EMPTY;
  contents[end[0]][end[1]] = EMPTY;

  return {
    contents,
    start,
    end,
  };
}

const day16: AdventFunction = async (
  filename = "./src/2024/day16/input.txt",
) => {
  return [1, 1];
};

export default day16;
