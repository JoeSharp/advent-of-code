import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";

type PagesToProduce = number[];

interface PageData {
  mustBeAfter: Map<number, number[]>;
  mustBeBefore: Map<number, number[]>;
  publish: PagesToProduce[];
}

function parsePageData(lines: string[]): PageData {
  const pageData: PageData = {
    mustBeAfter: new Map(),
    mustBeBefore: new Map(),
    publish: [],
  };

  let index = 0;
  let line = lines[index++];
  while (line !== "") {
    const [before, after] = line.split("|").map((i) => parseInt(i));
    if (!pageData.mustBeAfter.has(after)) {
      pageData.mustBeAfter.set(after, []);
    }
    if (!pageData.mustBeBefore.has(before)) {
      pageData.mustBeBefore.set(before, []);
    }
    pageData.mustBeAfter.get(after)!.push(before);
    pageData.mustBeBefore.get(before)!.push(after);
    line = lines[index++];
  }

  while (index < lines.length) {
    let line = lines[index++];
    const publish = line.split(",").map((i) => parseInt(i));
    pageData.publish.push(publish);
  }

  return pageData;
}

function findMiddle(line: number[]): number {
  const index = Math.floor(line.length / 2);
  return line[index];
}

function swap(arr: number[], fromIndex: number, toIndex: number) {
  const swp = arr[fromIndex];
  arr[fromIndex] = arr[toIndex];
  arr[toIndex] = swp;
}

function putInOrder(line: number[], pageData: PageData): number[] {
  const output = [...line];

  let violationFixed = false;

  do {
    violationFixed = false;

    const violationIndex = findViolationIndex(output, pageData);
    if (violationIndex !== NO_VIOLATION) {
      swap(output, violationIndex, violationIndex + 1);
      violationFixed = true;
    }
  } while (violationFixed);

  return output;
}

const NO_VIOLATION = -1;

function findViolationIndex(line: number[], pageData: PageData): number {
  for (let i = 1; i < line.length; i++) {
    const before = line[i - 1];
    const after = line[i];

    // Find violations
    const mustBeBefore = pageData.mustBeBefore.get(after);
    const mustBeAfter = pageData.mustBeAfter.get(before);

    if (!!mustBeBefore && mustBeBefore.includes(before)) {
      return i - 1;
    }
    if (!!mustBeAfter && mustBeAfter.includes(after)) {
      return i - 1;
    }
  }

  return NO_VIOLATION;
}

function isValid(line: number[], pageData: PageData): boolean {
  return findViolationIndex(line, pageData) === NO_VIOLATION;
}

const day5: AdventFunction = async (filename = "./src/2024/day5/input.txt") => {
  const lines = await loadEntireFile(filename);

  const pageData: PageData = parsePageData(lines);

  const part1 = pageData.publish
    .filter((line) => isValid(line, pageData))
    .map(findMiddle)
    .reduce((acc, curr) => acc + curr, 0);

  const part2 = pageData.publish
    .filter((line) => !isValid(line, pageData))
    .map((line) => putInOrder(line, pageData))
    .map(findMiddle)
    .reduce((acc, curr) => acc + curr, 0);

  return [part1, part2];
};

export default day5;
