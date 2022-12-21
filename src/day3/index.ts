import { processFile } from "../common/processFile";
import simpleLogger from "../common/simpleLogger";

export const splitInHalf = (inputStr: string): [string, string] => {
  if (inputStr.length === 0)
    throw new Error("Cannot split string of zero length");
  if (inputStr.length % 2 > 0)
    throw new Error("Cannot split string of odd length");

  const mid = inputStr.length / 2;

  return [inputStr.slice(0, mid), inputStr.slice(mid)];
};

export const findCommonElement = (inputs: string[]): string | undefined => {
  const charSets = inputs.map((i) => {
    const charSets: Set<string> = new Set();
    i.split("").forEach((c) => charSets.add(c));
    return charSets;
  });

  const intersection = [...charSets[0]].filter((c) =>
    charSets.slice(1).reduce((acc, curr) => acc && curr.has(c), true)
  );

  if (intersection.length === 1) {
    return intersection[0];
  } else {
    return undefined;
  }
};

export const getPriority = (item: string): number => {
  if (item.length !== 1)
    throw new Error("Cannot get priority of string of length !== 1");

  const LOWERCASE_A = "a".charCodeAt(0);
  const LOWERCASE_Z = "z".charCodeAt(0);
  const UPPERCASE_A = "A".charCodeAt(0);
  const UPPERCASE_Z = "Z".charCodeAt(0);

  const charCode = item.charCodeAt(0);

  if (charCode >= LOWERCASE_A && charCode <= LOWERCASE_Z) {
    return 1 + charCode - LOWERCASE_A;
  } else if (charCode >= UPPERCASE_A && charCode <= UPPERCASE_Z) {
    return 27 + charCode - UPPERCASE_A;
  } else {
    throw new Error(`Invalid item ${item}`);
  }
};

export default () => {
  let total = 0;

  processFile(
    "./src/day3/input.txt",
    (line) => {
      const [p1, p2] = splitInHalf(line);

      const commonElement = findCommonElement([p1, p2]);

      if (!!commonElement) {
        total += getPriority(commonElement);
      }
    },
    () => {
      simpleLogger.info(`Total of Priorties = ${total}`);
    }
  );
};
