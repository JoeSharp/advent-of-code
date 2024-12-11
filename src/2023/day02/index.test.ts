import day2, { parseGame } from "./index";

const TEST_INPUT_FILE = "./src/2023/day02/testInput.txt";

describe("day2", () => {
  it("parseGame", () => {
    // Given
    const input =
      "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue";

    // When
    const game = parseGame(input);

    // Then
    expect(game).toStrictEqual({
      id: 2,
      cubeSets: [
        { blue: 1, green: 2, red: 0 },
        { green: 3, blue: 4, red: 1 },
        { green: 1, blue: 1, red: 0 },
      ],
    });
  });
  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day2(TEST_INPUT_FILE);

    expect(part1).toBe(8);
  });

  it("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day2(TEST_INPUT_FILE);

    expect(part2).toBe(2286);
  });
});
