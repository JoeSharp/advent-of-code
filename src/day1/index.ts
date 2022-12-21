import simpleLogger from "../common/simpleLogger";

import { processFile } from "../common/processFile";
import { AdventFunction } from "../common/types";

const day1: AdventFunction = async (filename = "./src/day1/input.txt") =>
  new Promise((resolve) => {
    let elfCalories: number[] = [];

    let calories = 0;

    processFile(
      filename,
      (line) => {
        if (line === "") {
          elfCalories.push(calories);
          calories = 0;
        } else {
          let snackCalories = parseInt(line, 10);
          calories += snackCalories;
        }
      },
      () => {
        elfCalories.push(calories);

        // Reverse sort
        elfCalories.sort((a, b) => b - a);

        let highestCalories = elfCalories[0];

        simpleLogger.debug("All Calories", elfCalories);
        simpleLogger.debug("Highest Calories", highestCalories);

        const TOP_X_ELFS = 3;
        let topXCalories = 0;
        for (let i = 0; i < TOP_X_ELFS; i++) {
          simpleLogger.debug(`Elf ${elfCalories[i]}`);
          topXCalories += elfCalories[i];
        }

        simpleLogger.debug(`Top ${TOP_X_ELFS} carry ${topXCalories} calories`);
        resolve([highestCalories, topXCalories]);
      }
    );
  });

export default day1;
