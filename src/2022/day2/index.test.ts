import day2, {
  Outcome,
  Selection,
  getPlayerOutcome,
  getPlayerSelectionForOutcome,
} from "./index";

describe("Day 2", () => {
  describe("Day 2", () => {
    it("Calculates the example correctly", async () => {
      const [part1, part2] = await day2("./src/2022/day2/testInput.txt");
      expect(part1).toBe(15);
      expect(part2).toBe(12);
    });
  });

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
