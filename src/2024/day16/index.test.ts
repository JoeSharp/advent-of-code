import day16 from "./index";

const TEST_INPUT_FILE = "./src/2024/day16/testInput.txt";

describe("day16", () => {
  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day16(TEST_INPUT_FILE);

    expect(part1).toBe(1);
  });

  it("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day16(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
