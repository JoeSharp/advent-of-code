import day10, { calculateTrailheads, calculateHikeRatings } from "./index";
import { loadFileAsDigitGrid } from "../../common/processFile";

const TEST_INPUT_FILE_1 = "./src/2024/day10/testInput1.txt";
const TEST_INPUT_FILE_2 = "./src/2024/day10/testInput2.txt";
const TEST_INPUT_FILE_3 = "./src/2024/day10/testInput3.txt";
const TEST_INPUT_FILE_MAIN = "./src/2024/day10/testInputMain.txt";

describe("day10", () => {
  it.each`
    inputFile               | expected
    ${TEST_INPUT_FILE_1}    | ${2}
    ${TEST_INPUT_FILE_2}    | ${4}
    ${TEST_INPUT_FILE_MAIN} | ${36}
  `(
    "calculates trailheads $inputFile => $expected",
    async ({ inputFile, expected }) => {
      // Given
      const grid = await loadFileAsDigitGrid(inputFile);

      // When
      const result = calculateTrailheads(grid);

      // Then
      expect(result).toBe(expected);
    },
  );

  it.each`
    inputFile               | expected
    ${TEST_INPUT_FILE_1}    | ${2}
    ${TEST_INPUT_FILE_2}    | ${13}
    ${TEST_INPUT_FILE_3}    | ${227}
    ${TEST_INPUT_FILE_MAIN} | ${81}
  `(
    "calculates hike ratings $inputFile => $expected",
    async ({ inputFile, expected }) => {
      // Given
      const grid = await loadFileAsDigitGrid(inputFile);

      // When
      const result = calculateHikeRatings(grid);

      // Then
      expect(result).toBe(expected);
    },
  );

  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day10(TEST_INPUT_FILE_MAIN);

    expect(part1).toBe(36);
  });

  it("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day10(TEST_INPUT_FILE_MAIN);

    expect(part2).toBe(81);
  });
});
