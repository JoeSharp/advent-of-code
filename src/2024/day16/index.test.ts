import day16, { loadRawMaze } from "./index";

const TEST_INPUT_FILE = "./src/2024/day16/testInput.txt";

describe("day16", () => {

  it("loadRawMaze", async () => {
    const rawMaze = await loadRawMaze(TEST_INPUT_FILE);

    expect(rawMaze.start).toStrictEqual([13, 1]);
    expect(rawMaze.end).toStrictEqual([1, 13]);
    expect(rawMaze.contents.length).toBe(15);
    expect(rawMaze.contents[0].length).toBe(15);
  });

  it.skip("handles demo input for part 1 correctly", async () => {
    const [part1] = await day16(TEST_INPUT_FILE);

    expect(part1).toBe(11048);
  });

  it.skip("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day16(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
