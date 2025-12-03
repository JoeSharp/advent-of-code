import dayX from "./index";

const TEST_INPUT_FILE = "./src/2025/dayX/testInput.txt";

describe("day02", () => {
  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await dayX(TEST_INPUT_FILE);

    expect(part1).toBe(1227775554);
  });

  it("handles demo input for part 2 correctly", async () => {
    const [, part2] = await dayX(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
