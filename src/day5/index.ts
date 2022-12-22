import { processFile } from "../common/processFile";
import simpleLogger from "../common/simpleLogger";
import { splitStringIntoChunks } from "../common/stringUtils";
import { AdventFunction } from "../common/types";

export interface Step {
  move: number;
  from: number;
  to: number;
}

// move 3 from 3 to 7
export const parseStep = (stepStr: string): Step => {
  const re = /move (?<move>\d+) from (?<from>\d+) to (?<to>\d+)/;

  const match = stepStr.match(re);

  if (match === null || match.groups === undefined) {
    throw new Error("Invalid step");
  }

  return {
    move: parseInt(match.groups.move, 10),
    from: parseInt(match.groups.from, 10),
    to: parseInt(match.groups.to, 10),
  };
};

export const parseStackLine = (crateLineStr: string): (string | null)[] => {
  return splitStringIntoChunks(crateLineStr, 4)
    .map((c) => c.trim())
    .map((crateStr) => {
      if (crateStr.trim() === "") {
        return null;
      } else if (crateStr[0] === "[" && crateStr[2] === "]") {
        return crateStr[1];
      } else {
        simpleLogger.warn(`Invalid stack line: "${crateLineStr}"`);
        return "";
      }
    });
};

/**
 * Create the set of stacks, given the description of each horizontal slice.
 * A stack has the highest item at index 0.
 *
 * @param numberOfStacks The number of stacks to create (each sub array should have this many items)
 * @param stackLines The horizontal parsed lines for the stacks
 * @returns A set of stacks, essentially each one is a vertical line when read from the text file.
 */
export const processStackLines = (
  numberOfStacks: number,
  stackLines: (string | null)[][]
): string[][] =>
  Array.from(
    { length: numberOfStacks },
    (_, i) =>
      stackLines
        .map((stackLine) => stackLine[i])
        .filter((i) => i !== null) // get rid of the nulls
        .map((i) => i as string) // tell TypeScript they have to be strings now
  );

export const constructExpectedStackCountLine = (length: number) =>
  Array.from({ length }, (_, i) => i + 1).join("   ");

export const executeStepPartOne = (step: Step, stacks: string[][]) => {
  simpleLogger.debug(
    `Step Move: ${step.move}, From: ${step.from}, To: ${step.to}`
  );
  for (let i = 0; i < step.move; i++) {
    let item = stacks[step.from - 1].shift();
    if (item === undefined) {
      simpleLogger.warn("Tried to pull undefined item from stack (underflow?)");
      continue;
    }
    stacks[step.to - 1].unshift(item);
  }
};

export const executeStepPartTwo = (step: Step, stacks: string[][]) => {
  simpleLogger.debug(
    `Step Move: ${step.move}, From: ${step.from}, To: ${step.to}`
  );
  let tempStack = [];
  for (let i = 0; i < step.move; i++) {
    let item = stacks[step.from - 1].shift();
    if (item === undefined) {
      simpleLogger.warn("Tried to pull undefined item from stack (underflow?)");
      continue;
    }
    tempStack.unshift(item);
  }
  tempStack.forEach((item) => stacks[step.to - 1].unshift(item));
};

enum Phase {
  start,
  findingCrates,
  skippingEmptyLine,
  processingInstructions,
}

const day5: AdventFunction = (filename = "./src/day5/input.txt") => {
  return new Promise((resolve) => {
    let phase = Phase.start;
    let stackLines: (string | null)[][] = [];
    let stacksPartOne: string[][] = [];
    let stacksPartTwo: string[][] = [];
    let expectedStackCountLine = "";
    let numberOfStacks = 0;
    processFile(
      filename,
      (line) => {
        switch (phase) {
          case Phase.start:
            const crates = parseStackLine(line);
            numberOfStacks = crates.length;
            expectedStackCountLine =
              constructExpectedStackCountLine(numberOfStacks);
            phase = Phase.findingCrates;
            stackLines.push(crates);
            simpleLogger.debug(
              `Expected Stack Count Line for ${numberOfStacks} stacks: "${expectedStackCountLine}"`
            );
            break;
          case Phase.findingCrates:
            if (line.trim() === expectedStackCountLine) {
              phase = Phase.skippingEmptyLine;
            } else {
              stackLines.push(parseStackLine(line));
            }
            break;
          case Phase.skippingEmptyLine:
            if (line.trim().length === 0) {
              // Take the stacks and switch their dimension so we have the actual stacks
              stacksPartOne = processStackLines(numberOfStacks, stackLines);
              stacksPartTwo = processStackLines(numberOfStacks, stackLines);

              simpleLogger.debug(`Stacks Created ${stacksPartOne.length}`);
              stacksPartOne.forEach((s) => simpleLogger.debug(s));

              phase = Phase.processingInstructions;
            } else {
              simpleLogger.warn("Found something other than empty line");
            }
            break;
          case Phase.processingInstructions:
            const step = parseStep(line);

            executeStepPartOne(step, stacksPartOne);
            executeStepPartTwo(step, stacksPartTwo);

            break;
        }
      },
      () => {
        if (phase !== Phase.processingInstructions) {
          simpleLogger.warn("We never reached processing instructions");
        }

        const partOneAnswer = stacksPartOne.map((s) => s[0]).join("");
        const partTwoAnswer = stacksPartTwo.map((s) => s[0]).join("");

        resolve([partOneAnswer, partTwoAnswer]);
      }
    );
  });
};

export default day5;
