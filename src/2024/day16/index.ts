import { AdventFunction } from "../../common/types";
import {
  Position,
  findInstancesOf,
  gridArrayToStr,
} from "../../common/arrayUtils";
import { loadEntireFileAsGrid } from "../../common/processFile";

export const START = "S";
export const END = "E";
export const WALL = "#";

export const MOVE_SCORE = 1;
export const ROTATE_SCORE = 1000;

interface RawMaze {
  contents: string[][];
  start: Position;
  end: Position;
}

export async function loadRawMaze(filename: string): RawMaze {
  const contents = await loadEntireFileAsGrid(filename);

  const sTiles = findInstancesOf(contents, (v) => v === START);
  const eTiles = findInstancesOf(contents, (v) => v === END);

  console.log(gridArrayToStr(contents));

  if (sTiles.length !== 1) throw new Error("Multiple start points?");
  if (eTiles.length !== 1) throw new Error("Multiple end points?");

  return {
    contents,
    start: sTiles[0],
    end: eTiles[0],
  };
}

const day16: AdventFunction = async (
  filename = "./src/2024/day16/input.txt",
) => {
  return [1, 1];
};

export default day16;
