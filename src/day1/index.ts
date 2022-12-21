import * as fs from "fs";
import readline from "readline";

const FILENAME = "./src/day1/input.txt";

var r = readline.createInterface({
  input: fs.createReadStream(FILENAME),
});

let elfCalories: number[] = [];

let calories = 0;

r.on("line", (line) => {
  if (line === "") {
    elfCalories.push(calories);
    calories = 0;
  } else {
    let snackCalories = parseInt(line, 10);
    calories += snackCalories;
  }
}).on("close", () => {
  elfCalories.sort((a, b) => a - b);

  let highestCalories = elfCalories[elfCalories.length - 1];

  console.log("All Calories", elfCalories);
  console.log("Highest Calories", highestCalories);

  const TOP_X_ELFS = 3;
  let topXCalories = 0;
  for (let i = 0; i < TOP_X_ELFS; i++) {
    topXCalories += elfCalories[elfCalories.length - 1 - i];
  }

  console.log(`Top ${TOP_X_ELFS} carry ${topXCalories} calories`);
});
