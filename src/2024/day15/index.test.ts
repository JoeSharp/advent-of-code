import day15, {
  parseProblem,
  processProblem,
  warehouseToStr,
  problemToStr,
} from "./index";
import { gridArrayToStr, dirArrayToStr } from "../../common/arrayUtils";

const TEST_INPUT_FILE = "./src/2024/day15/testInput.txt";
const TEST_INPUT_FILE_SMALL = "./src/2024/day15/testInputSmall.txt";

describe("day15", () => {
  it.only("processProblem", async () => {
    const problem = await parseProblem(TEST_INPUT_FILE_SMALL);
    console.log(problemToStr(problem));
    const after = processProblem(problem);

    console.log(warehouseToStr(after));
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
