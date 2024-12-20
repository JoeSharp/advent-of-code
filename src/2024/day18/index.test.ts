import day18, { simulateCorruption, loadCoordinates, findShortestRouteLength } from "./index";
import { gridArrayToStr } from "../../common/arrayUtils";

const TEST_INPUT_FILE = "./src/2024/day18/testInput.txt";

describe("day18", () => {
  it("loads memory cell", async () => {
    const corruptions = await loadCoordinates(TEST_INPUT_FILE);

    const memory = simulateCorruption(7, corruptions, 12);

    console.log(gridArrayToStr(memory));
  });

  it.only("calculates shortest route", async () => {
    const ans = await findShortestRouteLength(TEST_INPUT_FILE, 7, 12);

    expect(ans).toBe(22);
  });

  it.skip("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day18(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
