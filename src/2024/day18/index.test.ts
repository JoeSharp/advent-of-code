import day18, { simulateCorruption, loadCoordinates }  from "./index";
import { gridArrayToStr } from '../../common/arrayUtils';

const TEST_INPUT_FILE = "./src/2024/day18/testInput.txt";

describe("day18", () => {
  it("loads memory cell", async () => {
    const corruptions = await loadCoordinates(TEST_INPUT_FILE);

    const memory = simulateCorruption(7, corruptions, 12);

    console.log(gridArrayToStr(memory));
  });

  it.skip("handles demo input for part 1 correctly", async () => {
    const [part1] = await day18(TEST_INPUT_FILE);

    expect(part1).toBe(1);
  });

  it.skip("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day18(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
