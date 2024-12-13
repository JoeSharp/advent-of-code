import day12, {
  findPlot,
  calculatePrice1,
  calculatePrice2,
  parseGarden,
} from "./index";
import { loadEntireFileAsGrid } from "../../common/processFile";

const TEST_INPUT_FILE = "./src/2024/day12/testInput.txt";
const TEST_INPUT_FILE_SMALL = "./src/2024/day12/testInputSmall.txt";
const TEST_INPUT_FILE_E = "./src/2024/day12/testInputE.txt";
const TEST_INPUT_FILE_ABBA = "./src/2024/day12/testInputABBA.txt";

describe("day12", () => {
  it.each`
    inputFile                | startPos  | expId  | expTiles                                                                                                            | expPerimeterTiles                                                                                                           | expPerimeter | expSides
    ${TEST_INPUT_FILE_SMALL} | ${[0, 0]} | ${"A"} | ${[[0, 0], [0, 1], [0, 2], [0, 3]]}                                                                                 | ${[[1, 0], [1, 1], [1, 2], [1, 3]]}                                                                                         | ${10}        | ${4}
    ${TEST_INPUT_FILE_SMALL} | ${[1, 0]} | ${"B"} | ${[[1, 0], [1, 1], [2, 0], [2, 1]]}                                                                                 | ${[[0, 0], [0, 1], [1, 2], [2, 2], [3, 0], [3, 1]]}                                                                         | ${8}         | ${4}
    ${TEST_INPUT_FILE}       | ${[5, 2]} | ${"I"} | ${[[5, 2], [6, 2], [6, 3], [6, 4], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [8, 1], [8, 2], [8, 3], [8, 5], [9, 3]]} | ${[[4, 2], [5, 1], [6, 1], [7, 0], [8, 0], [9, 1], [9, 2], [9, 4], [8, 4], [9, 5], [8, 6], [7, 6], [6, 5], [5, 4], [5, 3]]} | ${308}       | ${16}
  `(
    "findPlot from $inputFile at start $startPos with id $expId",
    async ({
      inputFile,
      startPos,
      expId,
      expTiles,
      expPerimeterTiles,
      expPerimeter,
    }) => {
      const grid = await loadEntireFileAsGrid(inputFile);
      const result = findPlot(grid, startPos);

      expect(result.id).toBe(expId);
      expect(result.tiles).toHaveLength(expTiles.length);
      expTiles.forEach((tile) => {
        expect(result.tiles).toEqual(expect.arrayContaining([tile]));
      });
      expPerimeterTiles.forEach((tile) => {
        expect(result.perimeterTiles).toEqual(expect.arrayContaining([tile]));
      });
    },
  );

  it.each`
    id     | expPrice1 | expPrice2
    ${"R"} | ${216}    | ${120}
    ${"F"} | ${180}    | ${120}
    ${"V"} | ${260}    | ${130}
    ${"J"} | ${220}    | ${132}
    ${"E"} | ${234}    | ${104}
    ${"M"} | ${60}     | ${30}
    ${"S"} | ${24}     | ${18}
  `("parse garden, plot $id", async ({ id, expPrice1, expPrice2 }) => {
    const grid = await loadEntireFileAsGrid(TEST_INPUT_FILE);
    const garden = parseGarden(grid);

    const plot: Plot = garden.filter((plot) => plot.id === id)[0];

    expect(plot).toBeDefined();
    const price1 = calculatePrice1(plot);
    const price2 = calculatePrice2(plot);

    expect(price1).toBe(expPrice1);
    expect(price2).toBe(expPrice2);
  });

  it.only.each`
    inputFile               | id     | expSides | expPrice2
    ${TEST_INPUT_FILE_E}    | ${"E"} | ${12} | ${204}
    ${TEST_INPUT_FILE_ABBA} | ${"A"} | ${12} | ${432}
  `(
    "calculatePrice2 $inputFile $id => $expPrice2",
    async ({ inputFile, id, expSides, expPrice2 }) => {
      const grid = await loadEntireFileAsGrid(inputFile);
      const garden = parseGarden(grid);

      const plot: Plot = garden.filter((plot) => plot.id === id)[0];

      expect(plot).toBeDefined();
        expect(plot.sides).toBe(expSides);
      
      const price2 = calculatePrice2(plot);

      expect(price2).toBe(expPrice2);
    },
  );

  it("handles demo input for part 1 correctly", async () => {
    const [part1] = await day12(TEST_INPUT_FILE);

    expect(part1).toBe(1930);
  });

  it("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day12(TEST_INPUT_FILE);

    expect(part2).toBe(1206);
  });
});
