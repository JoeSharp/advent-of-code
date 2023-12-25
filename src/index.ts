import simpleLogger from "./common/simpleLogger";
import { AdventFunction } from "./common/types";
import FNS_2022 from './2022';
import FNS_2023 from './2023';

const years: Map<number, Map<number, AdventFunction>> = new Map();
years.set(2022, FNS_2022);
years.set(2023, FNS_2023);

const YEAR_TO_RUN = 2023;
const DAY_TO_RUN = 1;

function executeSelected(year: number, day: number) {
  const yearFns = years.get(year);
  if (yearFns === undefined) {
    simpleLogger.error(`Could not find advent functions for year ${year}`);
    return;
  }

  const dayFn = yearFns.get(day);

  if (dayFn === undefined) {
    simpleLogger.error(`Could not find advent functions for day ${day}`);
    return;
  }
  simpleLogger.info(`Advent of Code - Challenge Year: ${year}, Day: ${day}`);
  dayFn().then(([part1Answer, part2Answer]) => {
    simpleLogger.info(`Part 1 Answer: ${part1Answer}`);
    simpleLogger.info(`Part 2 Answer: ${part2Answer}`);
  });
}

executeSelected(YEAR_TO_RUN, DAY_TO_RUN);
