import day17, { parseComputer, processComputer } from "./index";
import { loadEntireFile } from "../../common/processFile";

const TEST_INPUT_FILE = "./src/2024/day17/testInput.txt";
const TEST_INPUT_FILE_SMALL = "./src/2024/day17/testInputSmall.txt";

describe("day17", () => {
  it("parseComputer", async () => {
    const contents = await loadEntireFile(TEST_INPUT_FILE);

    const computer = parseComputer(contents);
    processComputer(computer);
  });

  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day17(TEST_INPUT_FILE);

    expect(part1).toBe("4,6,3,5,6,3,5,2,1,0");
  });

  it.only("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day17(TEST_INPUT_FILE_SMALL);

    expect(part2).toBe(117440);
  });
});
