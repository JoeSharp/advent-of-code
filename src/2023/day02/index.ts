import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";
import { parseListOfNumbers } from "../../common/stringUtils";

const RED = "red";
const BLUE = "blue";
const GREEN = "green";

export interface CubeSet {
  red: number;
  blue: number;
  green: number;
}

export interface CubeGame {
  id: number;
  cubeSets: CubeSet[];
}

export function setFitsWithin(entireSet: CubeSet, drawn: CubeSet): boolean {
  if (entireSet.red < drawn.red) return false;
  if (entireSet.blue < drawn.blue) return false;
  if (entireSet.green < drawn.green) return false;

  return true;
}

export function gameFitsWithin(entireSet: CubeSet, game: CubeGame): boolean {
  return game.cubeSets.every((cs) => setFitsWithin(entireSet, cs));
}

export function parseSet(input: string): CubeSet {
  let cubeSet: CubeSet = {
    red: 0,
    blue: 0,
    green: 0,
  };

  const parts = input
    .split(",")
    .map((d) => d.trim())
    .map((c) => c.split(" "))
    .forEach(([count, colour]) => {
      if (colour === RED) cubeSet.red = parseInt(count);
      if (colour === BLUE) cubeSet.blue = parseInt(count);
      if (colour === GREEN) cubeSet.green = parseInt(count);
    });

  return cubeSet;
}

export function findMinSet(setA: CubeSet, setB: CubeSet): CubeSet {
  return {
    red: Math.max(setA.red, setB.red),
    blue: Math.max(setA.blue, setB.blue),
    green: Math.max(setA.green, setB.green),
  };
}

const EMPTY_SET: CubeSet = { red: 0, blue: 0, green: 0 };

export function calculatePower(game: CubeGame): number {
  const { red, green, blue } = game.cubeSets.reduce(
    (acc, curr) => findMinSet(acc, curr),
    EMPTY_SET,
  );

  return [red, green, blue].reduce((acc, curr) => acc * curr, 1);
}

export function parseGame(line: string): CubeGame {
  const mainParts = line.split(":");
  const id = parseInt(mainParts[0].split(" ")[1]);

  const cubeSets = mainParts[1]
    .split(";")
    .map((d) => d.trim())
    .map(parseSet);

  return {
    id,
    cubeSets,
  };
}

const day2: AdventFunction = async (
  filename = "./src/2023/day02/input.txt",
) => {
  const totalSet: CubeSet = {
    red: 12,
    green: 13,
    blue: 14,
  };
  const games = (await loadEntireFile(filename)).map(parseGame);

  const part1 = games
    .filter((game) => gameFitsWithin(totalSet, game))
    .map(({ id }) => id)
    .reduce((acc, curr) => acc + curr, 0);
  const part2 = games.map(calculatePower).reduce((acc, curr) => acc + curr, 0);

  return [part1, part2];
};

export default day2;
