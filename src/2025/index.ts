import { AdventFunction } from "../common/types";

import day1 from "./day01";
import day2 from "./day02";
import day3 from "./day03";
import day4 from "./day04";
import day5 from "./day05";
import day6 from "./day06";
import day7 from "./day07";
import day8 from "./day08";
import day9 from "./day09";
import day10 from "./day10";
import day11 from "./day11";
import day12 from "./day12";

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
ADVENT_FUNCTIONS.set(12, day12);

export default ADVENT_FUNCTIONS;
