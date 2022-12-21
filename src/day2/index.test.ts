import {
  Outcome,
  Selection,
  getPlayerOutcome,
  getPlayerSelectionForOutcome,
} from "./index";

describe("Day 2", () => {
  describe("getPlayerOutcome", () => {
    it.each`
      opponentOutcome       | playerOutcome         | expected
      ${Selection.ROCK}     | ${Selection.ROCK}     | ${Outcome.DRAW}
      ${Selection.ROCK}     | ${Selection.PAPER}    | ${Outcome.WIN}
      ${Selection.ROCK}     | ${Selection.SCISSORS} | ${Outcome.LOSE}
      ${Selection.PAPER}    | ${Selection.PAPER}    | ${Outcome.DRAW}
      ${Selection.PAPER}    | ${Selection.ROCK}     | ${Outcome.LOSE}
      ${Selection.PAPER}    | ${Selection.SCISSORS} | ${Outcome.WIN}
      ${Selection.SCISSORS} | ${Selection.SCISSORS} | ${Outcome.DRAW}
      ${Selection.SCISSORS} | ${Selection.PAPER}    | ${Outcome.LOSE}
      ${Selection.SCISSORS} | ${Selection.ROCK}     | ${Outcome.WIN}
    `(
      "$opponentOutcome, $playerOutcome, $expected",
      ({ opponentOutcome, playerOutcome, expected }) => {
        const result = getPlayerOutcome(opponentOutcome, playerOutcome);
        expect(result).toBe(expected);
      }
    );
  });

  describe("getPlayerSelectionForOutcome", () => {
    it.each`
      opponentSelection     | intendedOutcome | expected
      ${Selection.ROCK}     | ${Outcome.WIN}  | ${Selection.PAPER}
      ${Selection.ROCK}     | ${Outcome.LOSE} | ${Selection.SCISSORS}
      ${Selection.ROCK}     | ${Outcome.DRAW} | ${Selection.ROCK}
      ${Selection.PAPER}    | ${Outcome.WIN}  | ${Selection.SCISSORS}
      ${Selection.PAPER}    | ${Outcome.LOSE} | ${Selection.ROCK}
      ${Selection.PAPER}    | ${Outcome.DRAW} | ${Selection.PAPER}
      ${Selection.SCISSORS} | ${Outcome.WIN}  | ${Selection.ROCK}
      ${Selection.SCISSORS} | ${Outcome.LOSE} | ${Selection.PAPER}
      ${Selection.SCISSORS} | ${Outcome.DRAW} | ${Selection.SCISSORS}
    `(
      "$opponentSelection, $intendedOutcome, $expected ",
      ({ opponentSelection, intendedOutcome, expected }) => {
        const result = getPlayerSelectionForOutcome(
          opponentSelection,
          intendedOutcome
        );
        expect(result).toBe(expected);
      }
    );
  });
});
