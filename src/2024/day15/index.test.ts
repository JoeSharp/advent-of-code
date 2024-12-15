import day15, {
  parseProblem,
  processProblem,
  warehouseToStr,
  problemToStr,
  calculateWarehouseValue,
  calculateGpsValue,
  parseWarehouse,
} from "./index";
import { gridArrayToStr, dirArrayToStr } from "../../common/arrayUtils";
import { loadEntireFile } from "../../common/processFile";

const TEST_INPUT_FILE = "./src/2024/day15/testInput.txt";
const TEST_OUTPUT_FILE = "./src/2024/day15/testOutput.txt";
const TEST_INPUT_FILE_SMALL = "./src/2024/day15/testInputSmall.txt";
const TEST_OUTPUT_FILE_SMALL = "./src/2024/day15/testOutputSmall.txt";

describe("day15", () => {
  it.each`
    input     | expected
    ${[1, 4]} | ${104}
  `("calculates gps value $input = $expected", ({ input, expected }) => {
    const result = calculateGpsValue(input);

    expect(result).toBe(expected);
  });

  it.each`
    inputFile                 | expected
    ${TEST_OUTPUT_FILE}       | ${10092}
    ${TEST_OUTPUT_FILE_SMALL} | ${2028}
  `(
    "calculates value of box coordinates $inputFile = $expected",
    async ({ inputFile, expected }) => {
      const lines = await loadEntireFile(inputFile);
      const warehouse = parseWarehouse(lines);
      const result = calculateWarehouseValue(warehouse);

      expect(result).toBe(expected);
    },
    );

  it("processProblem", async () => {
    const problem = await parseProblem(TEST_INPUT_FILE_SMALL);

    const lines = await loadEntireFile(TEST_OUTPUT_FILE_SMALL);
    const warehouseAfter = parseWarehouse(lines);
    const expectedStr = gridArrayToStr(warehouseAfter.contents);

    const after = processProblem(problem);
    const afterStr = gridArrayToStr(after.contents);

    expect(afterStr).toBe(expectedStr);
  });

  it("handles small input for part 1 correctly", async () => {
    const [part1] = await day15(TEST_INPUT_FILE_SMALL);

    expect(part1).toBe(2028);
  });

  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day15(TEST_INPUT_FILE);

    expect(part1).toBe(10092);
  });

  it("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day15(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
