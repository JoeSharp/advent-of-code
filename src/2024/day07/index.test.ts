import day7, { parseCalibration, concatenate } from "./index";
import { loadEntireFile } from "../../common/processFile";

const TEST_INPUT_FILE = "./src/2024/day07/testInput.txt";

describe("day7", () => {
  describe("day7", () => {
    it("parses lines correctly", async () => {
      const lines = await loadEntireFile(TEST_INPUT_FILE);
      const calibration = lines.map(parseCalibration);

      expect(calibration[0]).toStrictEqual({
        output: 190,
        inputs: [10, 19],
      });
      expect(calibration[7]).toStrictEqual({
        output: 21037,
        inputs: [9, 7, 18, 13],
      });
    });
    it.each`
      a       | b         | expected
      ${47}   | ${892}    | ${47892}
      ${1}    | ${1}      | ${11}
      ${8909} | ${1}      | ${89091}
      ${565}  | ${923449} | ${565923449}
    `(
      "Handles Concatenation Correctly $a || $b = $expected",
      ({ a, b, expected }) => {
        const result = concatenate(a, b);

        expect(result).toBe(expected);
      },
    );
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day7(TEST_INPUT_FILE);

      expect(part1).toBe(3749);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day7(TEST_INPUT_FILE);

      expect(part2).toBe(11387);
    });
  });
});
