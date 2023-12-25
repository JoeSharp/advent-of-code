import day8, {
  countVisibleTrees,
  goDown,
  goLeft,
  goRight,
  goUp,
  isTreeVisible,
  isTreeVisibleFromBottom,
  isTreeVisibleFromLeft,
  isTreeVisibleFromRight,
  isTreeVisibleFromTop,
  readGridOfNumbers,
  calculateScenicScore,
} from "./index";

describe("day8", () => {
  describe("Day 8", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day8("./src/2022/day8/testInput.txt");

      expect(part1).toBe(21);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day8("./src/2022/day8/testInput.txt");

      expect(part2).toBe(8);
    });
  });

  describe("countVisibleTrees", () => {
    it("counts visible trees in test input", async () => {
      const grid = await readGridOfNumbers("./src/2022/day8/testInput.txt");

      const result = countVisibleTrees(grid);

      expect(result).toBe(21);
    });
  });

  describe("readGridOfNumbers", () => {
    it("handles test input", async () => {
      const grid = await readGridOfNumbers("./src/2022/day8/testInput.txt");

      expect(grid).toStrictEqual({
        rows: 5,
        columns: 5,
        content: [
          [3, 0, 3, 7, 3],
          [2, 5, 5, 1, 2],
          [6, 5, 3, 3, 2],
          [3, 3, 5, 4, 9],
          [3, 5, 3, 9, 0],
        ],
      });
    });
  });

  describe("goInDirection", () => {
    it.each`
      direction  | fn         | row  | column | expecting
      ${"right"} | ${goRight} | ${1} | ${2}   | ${[1, 2]}
      ${"left"}  | ${goLeft}  | ${1} | ${2}   | ${[5, 2]}
      ${"up"}    | ${goUp}    | ${1} | ${2}   | ${[3]}
      ${"down"}  | ${goDown}  | ${1} | ${2}   | ${[3, 5, 3]}
    `(
      "$direction from $row, $column should give $expecting",
      async ({ fn, row, column, expecting }) => {
        const grid = await readGridOfNumbers("./src/2022/day8/testInput.txt");
        const result = [...fn(grid, row, column)];
        expect(result).toStrictEqual(expecting);
      }
    );
  });

  describe("calculateScenicScore", () => {
    it.each`
      row  | column | score
      ${1} | ${2}   | ${4}
      ${3} | ${2}   | ${8}
    `("$row, $column = $score", async ({ row, column, score }) => {
      const grid = await readGridOfNumbers("./src/2022/day8/testInput.txt");
      const result = calculateScenicScore(grid, row, column);
      expect(result).toBe(score);
    });
  });

  describe("isTreeVisible", () => {
    it.each`
      row  | column | visible  | visLeft  | visRight | visTop   | visBottom
      ${0} | ${0}   | ${true}  | ${true}  | ${false} | ${true}  | ${false}
      ${0} | ${1}   | ${true}  | ${false} | ${false} | ${true}  | ${false}
      ${1} | ${0}   | ${true}  | ${true}  | ${false} | ${false} | ${false}
      ${1} | ${1}   | ${true}  | ${true}  | ${false} | ${true}  | ${false}
      ${1} | ${2}   | ${true}  | ${false} | ${true}  | ${true}  | ${false}
      ${1} | ${3}   | ${false} | ${false} | ${false} | ${false} | ${false}
      ${2} | ${1}   | ${true}  | ${false} | ${true}  | ${false} | ${false}
      ${2} | ${2}   | ${false} | ${false} | ${false} | ${false} | ${false}
      ${2} | ${3}   | ${true}  | ${false} | ${true}  | ${false} | ${false}
      ${3} | ${1}   | ${false} | ${false} | ${false} | ${false} | ${false}
      ${3} | ${2}   | ${true}  | ${true}  | ${false} | ${false} | ${true}
      ${3} | ${3}   | ${false} | ${false} | ${false} | ${false} | ${false}
      ${4} | ${0}   | ${true}  | ${true}  | ${false} | ${false} | ${true}
      ${4} | ${4}   | ${true}  | ${false} | ${true}  | ${false} | ${true}
    `(
      "$row, $column - Visible $visible, LRTB ($visLeft, $visRight, $visTop, $visBottom) ",
      async ({
        row,
        column,
        visible,
        visRight,
        visLeft,
        visTop,
        visBottom,
      }) => {
        const grid = await readGridOfNumbers("./src/2022/day8/testInput.txt");

        expect(isTreeVisibleFromLeft(grid, row, column)).toBe(visLeft);
        expect(isTreeVisibleFromRight(grid, row, column)).toBe(visRight);
        expect(isTreeVisibleFromTop(grid, row, column)).toBe(visTop);
        expect(isTreeVisibleFromBottom(grid, row, column)).toBe(visBottom);
        expect(isTreeVisible(grid, row, column)).toBe(visible);
      }
    );
  });
});
