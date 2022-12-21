import simpleLogger from "../common/simpleLogger";

import { processFile } from "../common/processFile";

export default () => {
  let elfCalories: number[] = [];

  let calories = 0;

  processFile(
    "./src/day1/input.txt",
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
      elfCalories.sort((a, b) => a - b);

      let highestCalories = elfCalories[elfCalories.length - 1];

      simpleLogger.info("All Calories", elfCalories);
      simpleLogger.info("Highest Calories", highestCalories);

      const TOP_X_ELFS = 3;
      let topXCalories = 0;
      for (let i = 0; i < TOP_X_ELFS; i++) {
        topXCalories += elfCalories[elfCalories.length - 1 - i];
      }

      simpleLogger.info(`Top ${TOP_X_ELFS} carry ${topXCalories} calories`);
    }
  );
};
