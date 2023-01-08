import day12, {
  convertHeightValue,
  createPosition,
  findShortestPathFromAnyLowElevation,
  findShortestPathFromStart,
  identifyValidNextStepsGoingUp,
  loadHeightMap,
} from "./index";

describe("day12", () => {
  describe("day12", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day12("./src/day12/testInput.txt");

      expect(part1).toBe(31);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day12("./src/day12/testInput.txt");

      expect(part2).toBe(29);
    });
  });

  describe("convertHeightValue", () => {
    it.each`
      input  | expected
      ${"S"} | ${0}
      ${"E"} | ${25}
      ${"a"} | ${0}
      ${"d"} | ${3}
      ${"z"} | ${25}
    `(`$input -> $expected`, ({ input, expected }) => {
      const result = convertHeightValue(input);
      expect(result).toBe(expected);
    });
  });

  describe("findShortestPathFromStart", () => {
    it("finds shortest path in test data", async () => {
      const heightMap = await loadHeightMap("./src/day12/testInput.txt");
      const shortestPath = findShortestPathFromStart(heightMap);

      expect(shortestPath.length).toBe(31);
    });
  });

  describe.only("findShortestPathFromAnyLowElevation", () => {
    it("finds shortest path in test data", async () => {
      const heightMap = await loadHeightMap("./src/day12/testInput.txt");
      const shortestPath = findShortestPathFromAnyLowElevation(heightMap);

      expect(shortestPath.length).toBe(29);
    });
  });

  describe("identifyValidNextStepsGoingUp", () => {
    it.each`
      position                 | expectedKeys
      ${{ row: 0, column: 0 }} | ${["1-0", "0-1"]}
      ${{ row: 0, column: 3 }} | ${["1-3", "0-2", "0-4"]}
      ${{ row: 4, column: 0 }} | ${["3-0", "4-1"]}
      ${{ row: 4, column: 7 }} | ${["4-6", "3-7"]}
      ${{ row: 0, column: 7 }} | ${["0-6", "1-7"]}
      ${{ row: 2, column: 5 }} | ${["2-4", "2-6", "1-5", "3-5"]}
      ${{ row: 3, column: 5 }} | ${["3-4", "3-6", "4-5"]}
    `(
      "$position -> $expectedKeys",
      async ({ position: { row, column }, expectedKeys }) => {
        const heightMap = await loadHeightMap("./src/day12/testInput.txt");
        const position = createPosition(row, column);
        const nextStepKeys = identifyValidNextStepsGoingUp(
          heightMap,
          position
        ).map(({ key }) => key);
        expectedKeys.forEach((ex: string) =>
          expect(nextStepKeys).toContain(ex)
        );
      }
    );
  });

  describe("loadHeightMap", () => {
    it("loads test data", async () => {
      const heightMap = await loadHeightMap("./src/day12/testInput.txt");

      expect(heightMap).toStrictEqual({
        start: {
          row: 0,
          column: 0,
          key: "0-0",
        },
        end: {
          row: 2,
          column: 5,
          key: "2-5",
        },
        rows: 5,
        columns: 8,
        content: [
          [0, 0, 1, 16, 15, 14, 13, 12],
          [0, 1, 2, 17, 24, 23, 23, 11],
          [0, 2, 2, 18, 25, 25, 23, 10],
          [0, 2, 2, 19, 20, 21, 22, 9],
          [0, 1, 3, 4, 5, 6, 7, 8],
        ],
      });
    });
  });
});
