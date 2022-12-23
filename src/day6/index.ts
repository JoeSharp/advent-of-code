import { processFile } from "../common/processFile";
import simpleLogger from "../common/simpleLogger";
import { AdventFunction } from "../common/types";

export const findEndOfFirstXDifferent = (
  input: string,
  markerLength: number
): number => {
  let lastXCharacters: string[] = [];

  const index = [...input].findIndex((c) => {
    lastXCharacters.push(c);

    simpleLogger.debug(lastXCharacters);

    if (lastXCharacters.length === markerLength) {
      // Check that the four are different
      const setOf = new Set();
      [...lastXCharacters].forEach((c) => setOf.add(c));

      if (setOf.size === markerLength) {
        return true;
      }

      // Remove the first char and shift along
      lastXCharacters.shift();
    }
  });

  if (index >= 0) {
    return index + 1;
  } else return index;
};

const dayX: AdventFunction = (filename = "./src/day6/input.txt") => {
  return new Promise((resolve) => {
    processFile(
      filename,
      (line) => {
        let part1 = findEndOfFirstXDifferent(line, 4);
        let part2 = findEndOfFirstXDifferent(line, 14);

        resolve([part1, part2]);
      },
      () => {}
    );
  });
};

export default dayX;
