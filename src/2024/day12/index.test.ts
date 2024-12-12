import day12, { findPlot, calculatePrice, parseGarden } from "./index";
import { loadEntireFileAsGrid } from "../../common/processFile";

const TEST_INPUT_FILE = "./src/2024/day12/testInput.txt";
const TEST_INPUT_FILE_SMALL = "./src/2024/day12/testInputSmall.txt";

describe("day12", () => {
  it.each`
    inputFile                | startPos  | expectedId | expectedTiles                                                                                                       | expectedPerimeter
    ${TEST_INPUT_FILE_SMALL} | ${[0, 0]} | ${"A"}     | ${[[0, 0], [0, 1], [0, 2], [0, 3]]}                                                                                 | ${[[1, 0], [1, 1], [1, 2], [1, 3]]}
    ${TEST_INPUT_FILE_SMALL} | ${[1, 0]} | ${"B"}     | ${[[1, 0], [1, 1], [2, 0], [2, 1]]}                                                                                 | ${[[0, 0], [0, 1], [1, 2], [2, 2], [3, 0], [3, 1]]}
    ${TEST_INPUT_FILE}       | ${[5, 2]} | ${"I"}     | ${[[5, 2], [6, 2], [6, 3], [6, 4], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [8, 1], [8, 2], [8, 3], [8, 5], [9, 3]]} | ${[[4, 2], [5, 1], [6, 1], [7, 0], [8, 0], [9, 1], [9, 2], [9, 4], [8, 4], [9, 5], [8, 6], [7, 6], [6, 5], [5, 4], [5, 3]]}
  `(
    "findPlot from $inputFile at start $startPos with id $expectedId",
    async ({
      inputFile,
      startPos,
      expectedId,
      expectedTiles,
      expectedPerimeter,
    }) => {
      const grid = await loadEntireFileAsGrid(inputFile);
      const result = findPlot(grid, startPos);

      expect(result.id).toBe(expectedId);
      expect(result.tiles).toHaveLength(expectedTiles.length);
      expectedTiles.forEach((tile) => {
        expect(result.tiles).toEqual(expect.arrayContaining([tile]));
      });
      expectedPerimeter.forEach((tile) => {
        expect(result.perimeterTiles).toEqual(expect.arrayContaining([tile]));
      });
    },
  );

  it("parse garden", async () => {
      const grid = await loadEntireFileAsGrid(TEST_INPUT_FILE);
      const garden = parseGarden(grid);

    const plotJ: Plot = garden.filter(({id}) => id === 'J')[0];

    expect(plotJ).toBeDefined();
    const priceJ = calculatePrice(plotJ);
    expect(priceJ).toBe(220);
  });

  it.skip("handles demo input for part 1 correctly", async () => {
    const [part1] = await day12(TEST_INPUT_FILE);

    expect(part1).toBe(1930);
  });

  it.skip("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day12(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
