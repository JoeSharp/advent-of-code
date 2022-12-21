import simpleLogger from "../common/simpleLogger";

import { processFile } from "../common/processFile";

export enum Outcome {
  WIN = 6,
  DRAW = 3,
  LOSE = 0,
}

export enum Selection {
  ROCK,
  PAPER,
  SCISSORS,
}

export const getPlayerOutcome = (
  opponentSelection: Selection,
  playerSelection: Selection
): Outcome => {
  if (opponentSelection === playerSelection) return Outcome.DRAW;

  switch (opponentSelection) {
    case Selection.ROCK:
      if (playerSelection === Selection.PAPER) return Outcome.WIN;
      if (playerSelection === Selection.SCISSORS) return Outcome.LOSE;
    case Selection.PAPER:
      if (playerSelection === Selection.SCISSORS) return Outcome.WIN;
      if (playerSelection === Selection.ROCK) return Outcome.LOSE;
    case Selection.SCISSORS:
      if (playerSelection === Selection.ROCK) return Outcome.WIN;
      if (playerSelection === Selection.PAPER) return Outcome.LOSE;
    default:
      return Outcome.LOSE; // Shouldn't happen
  }
};

export const getPlayerSelectionForOutcome = (
  opponentSelection: Selection,
  intendedOutcome: Outcome
): Selection => {
  if (intendedOutcome === Outcome.DRAW) return opponentSelection;

  switch (opponentSelection) {
    case Selection.ROCK:
      if (intendedOutcome === Outcome.WIN) return Selection.PAPER;
      if (intendedOutcome === Outcome.LOSE) return Selection.SCISSORS;
    case Selection.PAPER:
      if (intendedOutcome === Outcome.WIN) return Selection.SCISSORS;
      if (intendedOutcome === Outcome.LOSE) return Selection.ROCK;
    case Selection.SCISSORS:
      if (intendedOutcome === Outcome.WIN) return Selection.ROCK;
      if (intendedOutcome === Outcome.LOSE) return Selection.PAPER;
    default:
      return opponentSelection; // Shouldn't happen
  }
};

const OPPONENT_SELECTIONS: Map<string, Selection> = new Map();
OPPONENT_SELECTIONS.set("A", Selection.ROCK);
OPPONENT_SELECTIONS.set("B", Selection.PAPER);
OPPONENT_SELECTIONS.set("C", Selection.SCISSORS);

const PLAYER_SELECTIONS: Map<string, Selection> = new Map();
PLAYER_SELECTIONS.set("X", Selection.ROCK);
PLAYER_SELECTIONS.set("Y", Selection.PAPER);
PLAYER_SELECTIONS.set("Z", Selection.SCISSORS);

const INTENDED_OUTCOME: Map<string, Outcome> = new Map();
INTENDED_OUTCOME.set("X", Outcome.LOSE);
INTENDED_OUTCOME.set("Y", Outcome.DRAW);
INTENDED_OUTCOME.set("Z", Outcome.WIN);

const SELECTION_SCORES: Map<Selection, number> = new Map();
SELECTION_SCORES.set(Selection.ROCK, 1);
SELECTION_SCORES.set(Selection.PAPER, 2);
SELECTION_SCORES.set(Selection.SCISSORS, 3);

export default () => {
  let scorePartOne: number = 0;
  let scorePartTwo: number = 0;

  processFile(
    "./src/day2/input.txt",
    (line) => {
      const parts = line.split(" ");

      if (parts.length === 2) {
        const opponentSelection = OPPONENT_SELECTIONS.get(parts[0]);
        const partOnePlayerSelection = PLAYER_SELECTIONS.get(parts[1]);
        const partTwoIntendedOutcome = INTENDED_OUTCOME.get(parts[1]);

        // If we can't determien any aspect of the game, just print warning and skip line
        if (
          opponentSelection === undefined ||
          partOnePlayerSelection === undefined ||
          partTwoIntendedOutcome === undefined
        ) {
          simpleLogger.warn(
            `Could not determine player and opponent selections from line: ${line}`
          );
          return;
        }

        // Part 1 Calculation
        const outcome = getPlayerOutcome(
          opponentSelection,
          partOnePlayerSelection
        );
        const partOneSelectionScore = SELECTION_SCORES.get(
          partOnePlayerSelection
        );
        if (partOneSelectionScore === undefined) {
          simpleLogger.warn(
            `Could not determine selection score for player selection: ${partOnePlayerSelection}`
          );
          return;
        }
        scorePartOne += outcome;
        scorePartOne += partOneSelectionScore;

        // Part 2 Calculation
        const partTwoPlayerSelection = getPlayerSelectionForOutcome(
          opponentSelection,
          partTwoIntendedOutcome
        );
        const partTwoSelectionScore = SELECTION_SCORES.get(
          partTwoPlayerSelection
        );
        if (partTwoSelectionScore === undefined) {
          simpleLogger.warn(
            `Could not determine selection score for player selection: ${partTwoPlayerSelection}`
          );
          return;
        }
        scorePartTwo += partTwoIntendedOutcome;
        scorePartTwo += partTwoSelectionScore;
      } else {
        simpleLogger.warn(`Invalid line, required 2 parts: ${line}`);
      }
    },
    () => {
      simpleLogger.info("Score for Part One: ", scorePartOne);
      simpleLogger.info("Score for Part Two: ", scorePartTwo);
    }
  );
};
