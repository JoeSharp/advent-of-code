import * as fs from "fs";
import readline from "readline";
import { numericSort } from "../../common/numericUtils";
import simpleLogger from "../../common/simpleLogger";

import { AdventFunction } from "../../common/types";

export enum Direction {
  up = "U",
  down = "D",
  left = "L",
  right = "R",
}

export interface RopePull {
  direction: Direction;
  amount: number;
}

export const ropePullToString = ({ direction, amount }: RopePull): string =>
  `${direction} ${amount}`;

export const parseRopePull = (input: string): RopePull => {
  const parts = input.split(" ");

  if (parts.length !== 2) throw new Error(`Invalid input line ${input}`);

  if (!Object.values(Direction).includes(parts[0] as unknown as Direction))
    throw new Error("Invalid Direction");

  const amount = parseInt(parts[1]);
  if (isNaN(amount)) throw new Error("Invalid amount");

  return {
    direction: parts[0] as unknown as Direction,
    amount,
  };
};

export interface Coordinate {
  x: number;
  y: number;
}

export const createInitialPosition = (): Coordinate => ({ x: 0, y: 0 });

export const positionToString = ({ x, y }: Coordinate): string => `${x},${y}`;

export interface RopeState {
  knots: Coordinate[];
  tailHistory: Coordinate[];
}

export const positionsToGridString = (
  tailHistory: Coordinate[],
  useNumbers: boolean = false,
  bottomLeft: Coordinate = { x: 0, y: 0 },
  topRight: Coordinate = { x: 10, y: 10 },
): string => {
  const xValues = tailHistory.map(({ x }) => x).sort(numericSort);
  const yValues = tailHistory.map(({ y }) => y).sort(numericSort);

  const minX = Math.min(bottomLeft.x, xValues[0]);
  const minY = Math.min(bottomLeft.y, yValues[0]);

  const maxX = Math.max(topRight.x, xValues[xValues.length - 1]);
  const maxY = Math.max(topRight.y, yValues[yValues.length - 1]);

  const rows: string[] = [];
  for (let y = minY; y <= maxY; y++) {
    let row = "";
    for (let x = minX; x <= maxX; x++) {
      let occupied = tailHistory.findIndex(
        (position) => position.x === x && position.y === y,
      );
      row +=
        occupied >= 0
          ? useNumbers
            ? occupied === 0
              ? "H"
              : occupied
            : "#"
          : ".";
    }
    rows.push(row);
  }

  return (
    rows.reverse().join("\n") +
    `\n${tailHistory.map(positionToString).join("->")}`
  );
};

export const ropeStateToString = ({ knots, tailHistory }: RopeState): string =>
  knots.map((k, i) => `${i === 0 ? "H" : i}: ${positionToString(k)}`).join(",");

const createInitialRopeState = (knots: number): RopeState => {
  if (knots < 2) throw new Error("Cannot have a rope with less than 2 knots");

  return {
    knots: Array.from({ length: knots }).map(() => createInitialPosition()),
    tailHistory: [createInitialPosition()],
  };
};

export const pullKnot = (
  { x, y }: Coordinate,
  direction: Direction,
): Coordinate => {
  switch (direction) {
    case Direction.up:
      return {
        x,
        y: y + 1,
      };
    case Direction.down:
      return {
        x,
        y: y - 1,
      };
    case Direction.left:
      return {
        x: x - 1,
        y,
      };
    case Direction.right:
      return {
        x: x + 1,
        y,
      };
  }
};

export const normalisePosition = (
  position: Coordinate,
  relativeTo: Coordinate,
): Coordinate => ({
  x: position.x - relativeTo.x,
  y: position.y - relativeTo.y,
});

export const denormalisePosition = (
  position: Coordinate,
  relativeTo: Coordinate,
): Coordinate => ({
  x: position.x + relativeTo.x,
  y: position.y + relativeTo.y,
});

const TAIL_FROM_TO: Map<string, Coordinate> = new Map();
TAIL_FROM_TO.set(positionToString({ x: -2, y: -2 }), { x: -1, y: -1 });
TAIL_FROM_TO.set(positionToString({ x: -2, y: 2 }), { x: -1, y: 1 });
TAIL_FROM_TO.set(positionToString({ x: 2, y: 2 }), { x: 1, y: 1 });
TAIL_FROM_TO.set(positionToString({ x: 2, y: -2 }), { x: 1, y: -1 });

TAIL_FROM_TO.set(positionToString({ x: -1, y: -2 }), { x: 0, y: -1 });
TAIL_FROM_TO.set(positionToString({ x: 0, y: -2 }), { x: 0, y: -1 });
TAIL_FROM_TO.set(positionToString({ x: 1, y: -2 }), { x: 0, y: -1 });

TAIL_FROM_TO.set(positionToString({ x: -1, y: 2 }), { x: 0, y: 1 });
TAIL_FROM_TO.set(positionToString({ x: 0, y: 2 }), { x: 0, y: 1 });
TAIL_FROM_TO.set(positionToString({ x: 1, y: 2 }), { x: 0, y: 1 });

TAIL_FROM_TO.set(positionToString({ x: -2, y: -1 }), { x: -1, y: 0 });
TAIL_FROM_TO.set(positionToString({ x: -2, y: 0 }), { x: -1, y: 0 });
TAIL_FROM_TO.set(positionToString({ x: -2, y: 1 }), { x: -1, y: 0 });

TAIL_FROM_TO.set(positionToString({ x: 2, y: -1 }), { x: 1, y: 0 });
TAIL_FROM_TO.set(positionToString({ x: 2, y: 0 }), { x: 1, y: 0 });
TAIL_FROM_TO.set(positionToString({ x: 2, y: 1 }), { x: 1, y: 0 });

export const followHead = (head: Coordinate, tail: Coordinate): Coordinate => {
  const normalisedTail = normalisePosition(tail, head);

  const newNormalised = TAIL_FROM_TO.get(positionToString(normalisedTail));

  // If there is no handler, assume it doesn't have to move
  if (newNormalised === undefined) return tail;

  return denormalisePosition(newNormalised, head);
};

export const pullRopeStep = (
  state: RopeState,
  direction: Direction,
): RopeState => {
  const knots = [pullKnot(state.knots[0], direction)];

  for (let i = 1; i < state.knots.length; i++) {
    const nextKnot = followHead(knots[i - 1], state.knots[i]);
    knots.push(nextKnot);
  }

  const tailHistory = [...state.tailHistory, knots[knots.length - 1]];

  simpleLogger.debug("\n" + positionsToGridString(knots, true));

  return { knots, tailHistory };
};

export const pullRope = (state: RopeState, ropePull: RopePull): RopeState => {
  simpleLogger.debug(
    `Pulling Rope: ${ropePull.direction} by ${ropePull.amount} units`,
  );

  const newState = Array.from({ length: ropePull.amount }, (_, i) => i).reduce(
    (acc, _) => pullRopeStep(acc, ropePull.direction),
    state,
  );

  // simpleLogger.debug("\n" + positionsToGridString(newState.knots, true));

  return newState;
};

export const countTailPositions = async (
  filename: string,
  knots: number,
): Promise<number> =>
  new Promise<number>((resolve) => {
    let ropeState = createInitialRopeState(knots);

    readline
      .createInterface({
        input: fs.createReadStream(filename),
      })
      .on("line", (line) => {
        const ropePull = parseRopePull(line);
        simpleLogger.debug(`Pulling Rope: ${ropePullToString(ropePull)}`);
        ropeState = pullRope(ropeState, ropePull);
        simpleLogger.debug(`Rope State ${ropeStateToString(ropeState)}`);
      })
      .on("close", () => {
        simpleLogger.debug(`Rope Coordinate ${knots}`);
        simpleLogger.debug("\n" + positionsToGridString(ropeState.knots, true));

        simpleLogger.debug(`Tail History for ${knots}`);
        simpleLogger.debug("\n" + positionsToGridString(ropeState.tailHistory));

        const tailPositions: Set<string> = new Set();
        ropeState.tailHistory
          .map(positionToString)
          .forEach((p) => tailPositions.add(p));

        resolve(tailPositions.size);
      });
  });

const day9: AdventFunction = async (filename = "./src/2022/day9/input.txt") => {
  let ropePartOne = await countTailPositions(filename, 2);
  let ropePartTwo = await countTailPositions(filename, 10);

  return [ropePartOne, ropePartTwo];
};

export default day9;
