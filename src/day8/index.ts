import * as fs from "fs";
import readline from "readline";
import { AdventFunction } from "../common/types";

export const readGridOfNumbers = (filename: string): Promise<number[][]> => {
  const grid: number[][] = [];
  return new Promise((resolve) => {
    var r = readline.createInterface({
      input: fs.createReadStream(filename),
    });
    r.on("line", (line) =>
      grid.push(line.split("").map((i) => parseInt(i, 10)))
    ).on("close", () => {
      resolve(grid);
    });
  });
};

const day8: AdventFunction = (filename = "./src/day8/input.txt") => {
  return new Promise((resolve) => {
    resolve([1, 1]);
  });
};

export default day8;
