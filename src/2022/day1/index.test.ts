import day1 from "./index";

describe("Day 1", () => {
  it("Calculates the example correctly", async () => {
    const [part1, part2] = await day1("./src/2022/day1/testInput.txt");
    expect(part1).toBe(24000);
    expect(part2).toBe(45000);
  });
});
