import * as fs from "fs";
import readline from "readline";
import simpleLogger from "../common/simpleLogger";

import { AdventFunction } from "../common/types";

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

export interface Position {
  x: number;
  y: number;
}

export const createInitialPosition = (): Position => ({ x: 0, y: 0 });

export const positionToString = ({ x, y }: Position): string => `${x}-${y}`;

export interface RopeState {
  head: Position;
  tail: Position;
  tailHistory: Position[];
}

export const ropeStateToString = ({
  head,
  tail,
  tailHistory,
}: RopeState): string =>
  `H: ${head.x},${head.y}, T: ${tail.x},${tail.y}, History: ${tailHistory
    .map(positionToString)
    .join("->")}`;

const createInitialRopeState = (): RopeState => ({
  head: createInitialPosition(),
  tail: createInitialPosition(),
  tailHistory: [createInitialPosition()],
});

export const pullKnot = (
  { x, y }: Position,
  direction: Direction
): Position => {
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
  position: Position,
  relativeTo: Position
): Position => ({
  x: position.x - relativeTo.x,
  y: position.y - relativeTo.y,
});

export const denormalisePosition = (
  position: Position,
  relativeTo: Position
): Position => ({
  x: position.x + relativeTo.x,
  y: position.y + relativeTo.y,
});

const TAIL_FROM_TO: Map<string, Position> = new Map();
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

export const followHead = (head: Position, tail: Position): Position => {
  const normalisedTail = normalisePosition(tail, head);

  const newNormalised = TAIL_FROM_TO.get(positionToString(normalisedTail));

  // If there is no handler, assume it doesn't have to move
  if (newNormalised === undefined) return tail;

  return denormalisePosition(newNormalised, head);
};

export const pullRopeStep = (
  state: RopeState,
  direction: Direction
): RopeState => {
  const head = pullKnot(state.head, direction);
  const tail = followHead(head, state.tail);
  const tailHistory = [...state.tailHistory, tail];

  return { head, tail, tailHistory };
};

export const pullRope = (state: RopeState, ropePull: RopePull): RopeState =>
  Array.from({ length: ropePull.amount }, (_, i) => i).reduce(
    (acc, _) => pullRopeStep(acc, ropePull.direction),
    state
  );

const day9: AdventFunction = (filename = "./src/day9/input.txt") => {
  return new Promise((resolve) => {
    let ropeState = createInitialRopeState();

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
        const tailPositions: Set<string> = new Set();
        ropeState.tailHistory
          .map(positionToString)
          .forEach((p) => tailPositions.add(p));

        resolve([tailPositions.size, 1]);
      });
  });
};

export default day9;
