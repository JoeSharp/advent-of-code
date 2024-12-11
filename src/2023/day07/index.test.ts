import day07 from "./index";

const TEST_INPUT_FILE = "./src/2023/day07/testInput.txt";

describe("day07", () => {
  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day07(TEST_INPUT_FILE);

    expect(part1).toBe(1);
  });

  it("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day07(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
