import { AdventFunction } from "../common/types";

import day1 from "./day01";
import day2 from "./day02";

const ADVENT_FUNCTIONS: Map<number, AdventFunction> = new Map();

ADVENT_FUNCTIONS.set(1, day1);
ADVENT_FUNCTIONS.set(2, day2);

export default ADVENT_FUNCTIONS;
