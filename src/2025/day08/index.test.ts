import dayX from "./index";

const TEST_INPUT_FILE = "./src/2025/day08/testInput.txt";

describe("day08", () => {
  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await dayX(TEST_INPUT_FILE);

    expect(part1).toBe(1);
  });

  it("handles demo input for part 2 correctly", async () => {
    const [, part2] = await dayX(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
