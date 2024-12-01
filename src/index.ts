import { Command } from "commander";

import executeChallenge from "./executeChallenge";

const program = new Command();
program
  .name("Advent of Code")
  .description("Joe Sharps Advent of Code")
  .option("-y, --year <number>", "Year to process")
  .option("-d, --day <number>", "Day to process");

program.parse(process.argv);
const options = program.opts();
const year = parseInt(options.year);
const day = parseInt(options.day);
executeChallenge(year, day);
