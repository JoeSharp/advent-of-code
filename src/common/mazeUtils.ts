import { loadEntireFileAsGrid } from "./processFile";
import { Position, findInstancesOf } from "./arrayUtils";

export const START = "S";
export const END = "E";
export const WALL = "#";
export const EMPTY = ".";

export interface RawMaze {
  contents: string[][];
  start: Position;
  end: Position;
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
