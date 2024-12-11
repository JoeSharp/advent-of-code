import day03 from "./index";

const TEST_INPUT_FILE = "./src/2023/day03/testInput.txt";

describe("day03", () => {
  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day03(TEST_INPUT_FILE);

    expect(part1).toBe(4361);
  });

  it("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day03(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
