import * as fs from "fs";
import readline from "readline";
import simpleLogger from "../common/simpleLogger";
import { AdventFunction } from "../common/types";

export interface Range {
  from: number;
  to: number;
}

export const parseRange = (rangeStr: string): Range => {
  const parts = rangeStr.split("-");

  if (parts.length !== 2) {
    throw new Error(`Invalid range string ${parts}`);
  }

  const from = parseInt(parts[0], 10);
  const to = parseInt(parts[1], 10);

  if (from > to) throw new Error(`Range is incorrect order ${from} -> ${to}`);

  return { from, to };
};

export const parseRanges = (rangesStr: string): Range[] =>
  rangesStr.split(",").map(parseRange);

export const rangeIsContainedBy = (outer: Range, inner: Range): boolean => {
  return outer.from <= inner.from && outer.to >= inner.to;
};

export const oneRangeContainsAnother = (
  rangeA: Range,
  rangeB: Range
): boolean =>
  rangeIsContainedBy(rangeA, rangeB) || rangeIsContainedBy(rangeB, rangeA);

export const anyRangeOverlap = (rangeA: Range, rangeB: Range): boolean => {
  if (rangeA.to < rangeB.from) return false;
  if (rangeA.from > rangeB.to) return false;
  return true;
};

const day4: AdventFunction = (filename = "./src/day4/input.txt") =>
  new Promise((resolve) => {
    let numberThatHaveContainment = 0;
    let numberThatHaveOverlap = 0;

    var r = readline.createInterface({
      input: fs.createReadStream(filename),
    });
    r.on("line", (line) => {
      const ranges = parseRanges(line);

      if (ranges.length !== 2) {
        simpleLogger.warn("A line contained unexpected number of ranges");
        return;
      }

      if (oneRangeContainsAnother(ranges[0], ranges[1])) {
        numberThatHaveContainment++;
      }

      if (anyRangeOverlap(ranges[0], ranges[1])) {
        numberThatHaveOverlap++;
      }
    }).on("close", () => {
      resolve([numberThatHaveContainment, numberThatHaveOverlap]);
    });
  });

export default day4;
