import day14, {
  createRockMap,
  dropSandToFallThrough,
  dropSandToHitFloor,
  dropSandUntilFallThrough,
  dropSandUntilGapPlugged,
  findPointsOnPath,
  getNextPoint,
  occupiedBy,
  loadRockMap,
  parseRockPath,
  parseRockPoint,
  RockMap,
  rockPointToString,
  SAND_STARTING_POINT,
  OccupiedBy,
} from "./index";

const TEST_INPUT_FILE = "./src/2022/day14/testInput.txt";

describe("day14", () => {
  describe("day14", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day14(TEST_INPUT_FILE);

      expect(part1).toBe(24);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day14(TEST_INPUT_FILE);

      expect(part2).toBe(93);
    });
  });

  describe("dropSandUntilFallThrough", () => {
    it("drops correct number of sand until full", async () => {
      const rockMap = await loadRockMap(TEST_INPUT_FILE);

      const result = dropSandUntilFallThrough(rockMap, SAND_STARTING_POINT);

      expect(result).toBe(24);
    });
  });

  describe("dropSandUntilGapPlugged", () => {
    it("drops correct number of sand until full", async () => {
      const rockMap = await loadRockMap(TEST_INPUT_FILE);

      const result = dropSandUntilGapPlugged(rockMap, SAND_STARTING_POINT);

      expect(result).toBe(93);
    });
  });

  describe("dropSandToFallThrough", () => {
    it("drops sand and settles correctly", async () => {
      const rockMap = await loadRockMap(TEST_INPUT_FILE);

      expect(occupiedBy(rockMap, { x: 500, y: 8 })).toBe(OccupiedBy.air);
      const result = dropSandToFallThrough(rockMap, SAND_STARTING_POINT);

      expect(result).toBeTruthy();
      expect(occupiedBy(rockMap, { x: 500, y: 8 })).toBe(OccupiedBy.sand);
    });

    it("allows sand to fall through correctly", () => {});
  });

  describe("dropSandToHitFloor", () => {
    it("drops sand and settles correctly", async () => {
      const rockMap = await loadRockMap(TEST_INPUT_FILE);

      expect(occupiedBy(rockMap, { x: 500, y: 8 })).toBe(OccupiedBy.air);
      const result = dropSandToHitFloor(rockMap, SAND_STARTING_POINT);

      expect(result).toBeFalsy();
      expect(occupiedBy(rockMap, { x: 500, y: 8 })).toBe(OccupiedBy.sand);
    });

    it("allows sand to fall through correctly", () => {});
  });

  describe("parseRockPoint", () => {
    it("parses a valid point correctly", () => {
      const result = parseRockPoint("5,6");
      expect(result).toStrictEqual({
        x: 5,
        y: 6,
      });
    });
    it("throws error for wrong number of parts", () => {
      expect(() => parseRockPoint("5,6, 7")).toThrowError();
    });
    it("throws error for invalid numbers", () => {
      expect(() => parseRockPoint("5,ba")).toThrowError();
    });
    it("throws error for nonsense", () => {
      expect(() => parseRockPoint("foobar")).toThrowError();
    });
  });

  describe("parseRockPath", () => {
    it("parses a valid path correcty", () => {
      const result = parseRockPath("503,4 -> 502,4 -> 502,9 -> 494,9");

      expect(result).toStrictEqual([
        { x: 503, y: 4 },
        { x: 502, y: 4 },
        { x: 502, y: 9 },
        { x: 494, y: 9 },
      ]);
    });

    it("throws error for wrong number of parts", () => {
      expect(() =>
        parseRockPoint("503,4,8 -> 502,4,7 -> 502,9 -> 494,9"),
      ).toThrowError();
    });
    it("throws error for invalid numbers", () => {
      expect(() =>
        parseRockPoint("503,ba -> 502,4 -> 502,cd -> 494,9"),
      ).toThrowError();
    });
    it("throws error for nonsense", () => {
      expect(() => parseRockPoint("foobar")).toThrowError();
    });
  });

  describe("getNextPoint", () => {
    it("Locates the next space when there is space directly below", () => {
      const rockMap: RockMap = {
        contents: new Set<string>(),
        originalContents: new Set<string>(),
        lowestPoint: 0,
      };

      [
        { x: 3, y: 4 },
        { x: 4, y: 4 },
        { x: 4, y: 3 },
        { x: 5, y: 4 },
      ]
        .map(rockPointToString)
        .forEach((p) => rockMap.contents.add(p));

      const result = getNextPoint(rockMap, { x: 4, y: 1 });

      expect(result).toStrictEqual({ x: 4, y: 2 });
    });
    it("Locates the next space when there is space to the left", () => {
      const rockMap: RockMap = {
        contents: new Set<string>(),
        originalContents: new Set<string>(),
        lowestPoint: 0,
      };

      [
        { x: 3, y: 4 },
        { x: 4, y: 4 },
        { x: 4, y: 3 },
        { x: 5, y: 4 },
      ]
        .map(rockPointToString)
        .forEach((p) => rockMap.contents.add(p));

      const result = getNextPoint(rockMap, { x: 4, y: 2 });

      expect(result).toStrictEqual({ x: 3, y: 3 });
    });
    it("Locates the next space when there is space to the right", () => {
      const rockMap: RockMap = {
        contents: new Set<string>(),
        originalContents: new Set<string>(),
        lowestPoint: 0,
      };

      [
        { x: 3, y: 3 },
        { x: 3, y: 4 },
        { x: 4, y: 4 },
        { x: 4, y: 3 },
        { x: 5, y: 4 },
      ]
        .map(rockPointToString)
        .forEach((p) => rockMap.contents.add(p));

      const result = getNextPoint(rockMap, { x: 4, y: 2 });

      expect(result).toStrictEqual({ x: 5, y: 3 });
    });
  });

  describe("findPointsOnPath", () => {
    it("Works for horizontal line going left", () => {
      const result = findPointsOnPath({ x: 5, y: 10 }, { x: 3, y: 10 });

      expect(result.length).toBe(3);
      expect(result[0]).toStrictEqual({ x: 3, y: 10 });
      expect(result[1]).toStrictEqual({ x: 4, y: 10 });
      expect(result[2]).toStrictEqual({ x: 5, y: 10 });
    });
    it("Works for horizontal line going right", () => {
      const result = findPointsOnPath({ x: 3, y: 10 }, { x: 5, y: 10 });

      expect(result.length).toBe(3);
      expect(result[0]).toStrictEqual({ x: 3, y: 10 });
      expect(result[1]).toStrictEqual({ x: 4, y: 10 });
      expect(result[2]).toStrictEqual({ x: 5, y: 10 });
    });
    it("Works for vertical line going down", () => {
      const result = findPointsOnPath({ x: 5, y: 10 }, { x: 5, y: 14 });

      expect(result.length).toBe(5);
      expect(result[0]).toStrictEqual({ x: 5, y: 10 });
      expect(result[1]).toStrictEqual({ x: 5, y: 11 });
      expect(result[2]).toStrictEqual({ x: 5, y: 12 });
      expect(result[3]).toStrictEqual({ x: 5, y: 13 });
      expect(result[4]).toStrictEqual({ x: 5, y: 14 });
    });
    it("Works for vertical line going up", () => {
      const result = findPointsOnPath({ x: 5, y: 14 }, { x: 5, y: 10 });

      expect(result.length).toBe(5);
      expect(result[0]).toStrictEqual({ x: 5, y: 10 });
      expect(result[1]).toStrictEqual({ x: 5, y: 11 });
      expect(result[2]).toStrictEqual({ x: 5, y: 12 });
      expect(result[3]).toStrictEqual({ x: 5, y: 13 });
      expect(result[4]).toStrictEqual({ x: 5, y: 14 });
    });
  });

  describe("createRockMap", () => {
    it("works on the test input", () => {
      const result = createRockMap([
        [
          { x: 498, y: 4 },
          { x: 498, y: 6 },
          { x: 496, y: 6 },
        ],
        [
          { x: 503, y: 4 },
          { x: 502, y: 4 },
          { x: 502, y: 9 },
          { x: 494, y: 9 },
        ],
      ]);

      expect(result.lowestPoint).toBe(9);
      expect(occupiedBy(result, { x: 498, y: 4 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 498, y: 5 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 498, y: 6 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 497, y: 6 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 496, y: 6 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 496, y: 3 })).toBe(OccupiedBy.air);

      expect(occupiedBy(result, { x: 503, y: 4 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 502, y: 4 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 502, y: 5 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 502, y: 6 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 502, y: 7 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 502, y: 8 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 502, y: 9 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 501, y: 9 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 500, y: 9 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 499, y: 9 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 498, y: 9 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 497, y: 9 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 496, y: 9 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 495, y: 9 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 494, y: 9 })).toBe(OccupiedBy.rock);
      expect(occupiedBy(result, { x: 493, y: 9 })).toBe(OccupiedBy.air);
    });
  });
});
