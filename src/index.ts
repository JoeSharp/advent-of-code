import simpleLogger from "./common/simpleLogger";
import { AdventFunction } from "./common/types";

import day1 from "./day1";
import day2 from "./day2";
import day3 from "./day3";
import day4 from "./day4";
import day5 from "./day5";
import day6 from "./day6";
import day7 from "./day7";
import day8 from "./day8";
import day9 from "./day9";
import day10 from "./day10";
import day11 from "./day11";

const ADVENT_FUNCTIONS: Map<number, AdventFunction> = new Map();

ADVENT_FUNCTIONS.set(1, day1);
ADVENT_FUNCTIONS.set(2, day2);
ADVENT_FUNCTIONS.set(3, day3);
ADVENT_FUNCTIONS.set(4, day4);
ADVENT_FUNCTIONS.set(5, day5);
ADVENT_FUNCTIONS.set(6, day6);
ADVENT_FUNCTIONS.set(7, day7);
ADVENT_FUNCTIONS.set(8, day8);
ADVENT_FUNCTIONS.set(9, day9);
ADVENT_FUNCTIONS.set(10, day10);
ADVENT_FUNCTIONS.set(11, day11);

const DAY_TO_RUN = 11;

const fn = ADVENT_FUNCTIONS.get(DAY_TO_RUN);

if (fn === undefined) {
  simpleLogger.error(`Could not find advent functions for day ${DAY_TO_RUN}`);
} else {
  simpleLogger.info(`Advent of Code - Challenge ${DAY_TO_RUN}`);
  fn().then(([part1Answer, part2Answer]) => {
    simpleLogger.info(`Part 1 Answer: ${part1Answer}`);
    simpleLogger.info(`Part 2 Answer: ${part2Answer}`);
  });
}
