import { AdventFunction } from "../../common/types";
import {
  Position,
  posEqual,
  posToStr,
  dirToShortStr,
  findInstancesOf,
  gridArrayToStr,
  CROSS_DIRECTIONS,
  NONSENSE,
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
  cost: number;
}

export interface Graph {
  start: Position;
  end: Position;
  nodes: Position[];
  edges: Edge[];
}

export function edgeToStr({ from, to, direction, cost }: Edge): string {
  return `cost(${cost}): ${posToStr(from)} ${dirToShortStr(direction)}   ${posToStr(to)}`;
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
  let cost = 0;

  while (contents[position[0]][position[1]] !== WALL) {
    position = applyDirection(position, direction);
    cost++;

    if (
      contents[position[0]][position[1]] === EMPTY &&
      nodeIsACorner(contents, position)
    ) {
      return {
        from: node,
        to: position,
        direction,
        cost,
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
    (p) => posEqual(p, start) || posEqual(p, end) || nodeIsACorner(contents, p),
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


export interface NavOption {
  via: Position;
  direction: Position;
  cost: number;

}

export interface NavNode {
  position: Position;
  visited: boolean;
  options: NavOption[];
}

function findCheapestUnvisited(navNodes: NavNode[]): NavNode | undefined {
  let nextNode: NavNode | undefined;

  navNodes.forEach((node) => {
    if (node.visited) return;
    if (node.options.length === 0) return;

    if (nextNode === undefined) {
      nextNode = node;
      return;
    }

    if (nextNode.options[0].cost > node.options[0].cost) {
      nextNode = node;
      return;
    }
  });

  return nextNode;
}

export function isTurningCorner(
  currentDirection: Position,
  nextDirection: Position,
): boolean {
  return (
    currentDirection[0] * nextDirection[0] === 0 &&
    currentDirection[1] * nextDirection[1] === 0
  );
}

export function isGoingBack(
  currentDirection: Position,
  nextDirection: Position,
): boolean {
  return (
    currentDirection[0] === -1 * nextDirection[0] &&
    currentDirection[1] === -1 * nextDirection[1]
  );
}

function findNavNode(navNodes: NavNode[], position: Position): NavNode {
  const index = navNodes.findIndex((n) => posEqual(n.position, position));

  if (index === -1)
    throw new Error(`Could not find ${posToStr(position)} in nav nodes`);

  return navNodes[index];
}

interface JourneyStep {
  position: Position;
  cost: number;
}

export function readOffRoute(graph: Graph, nodes: NavNode[]): JourneyStep[] {
  console.log("Read off route", nodes);

  let node = findNavNode(nodes, graph.end);

  let cost = 0;
  let route: JourneyStep[] = [];

  while (!!node && !posEqual(node.position, graph.start)) {
    if (node.options.length === 0) throw new Error(`No options when reading off route ${posToStr(node.position)}`);

    cost += node.options[0].cost;
    route.unshift({
      cost: node.options[0].cost,
      position: node.position,
    });

    node = findNavNode(nodes, node.options[0].via);
  }
  route.unshift({
    cost: 0,
    position: graph.start,
  });

  return route;
}

export function findShortestRoute(graph: Graph): JourneyStep[] {
  console.log("Finding shortest route", graphToStr(graph));

  const navNodes: NavNode[] = graph.nodes.map((position) => {
    let cost = Infinity;
    if (posEqual(position, graph.start)) {
      cost = 0;
    }

    return {
      position,
      visited: false,
      options: [{
        direction: EAST,
        via: NONSENSE,
        cost
      }]
    };
  });

  console.log('Using nodes', navNodes);

  let node = findCheapestUnvisited(navNodes);
  while (node !== undefined) {

    console.log("Visiting Node", node);
    node.visited = true;
    graph.edges
      .filter(
        (edge) =>
          posEqual(edge.from, node!.position) &&
            !isGoingBack(node!.options[0].direction, edge.direction),
      )
      .forEach((edge) => {
        let cost = node!.options[0].cost + edge.cost;
        if (isTurningCorner(node!.options[0].direction, edge.direction)) {
          cost += ROTATE_SCORE;
        }

        const to = navNodes.filter((n) => posEqual(n.position, edge.to))[0];
        if (to.options.length === 0 || to.options[0].cost > cost) {
          to.options = [{
            cost,
            via: edge.from,
            direction: edge.direction
          }];
          console.log("Found new quicker way to get", to);
        }
      });

    node = findCheapestUnvisited(navNodes);
  }

  return readOffRoute(graph, navNodes);
}

const day16: AdventFunction = async (
  filename = "./src/2024/day16/input.txt",
) => {
  const rawMaze = await loadRawMaze(filename);
  const graph = convertMazeToGraph(rawMaze);
  const route = findShortestRoute(graph);
  if (route.length === 0) throw new Error('No route found through maze');
  const part1 = route[route.length - 1].cost;

  return [part1, 1];
};

export default day16;
