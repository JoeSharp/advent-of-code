import simpleLogger from "./common/simpleLogger";
import { AdventFunction } from "./common/types";

import day1 from "./day1";
import day2 from "./day2";

const ADVENT_FUNCTIONS: Map<number, AdventFunction> = new Map();

ADVENT_FUNCTIONS.set(1, day1);
ADVENT_FUNCTIONS.set(2, day2);

const DAY_TO_RUN = 2;

const fn = ADVENT_FUNCTIONS.get(DAY_TO_RUN);

if (fn === undefined) {
  simpleLogger.warn(`Could not find advent functions for day ${DAY_TO_RUN}`);
} else {
  simpleLogger.info(`Advent of Code - Challenge ${DAY_TO_RUN}`);
  fn();
}
