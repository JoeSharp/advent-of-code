import day13, {
  Packet,
  packetsInRightOrder,
  parseDistressSignalFile,
  whichPacketsInRightOrder,
} from "./index";

const TEST_FILENAME = "./src/day13/testInput.txt";
const REAL_FILENAME = "./src/day13/input.txt";

describe("day13", () => {
  describe("day13", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day13(TEST_FILENAME);

      expect(part1).toBe(13);
    });
    it.only("handles real input for part 1 correctly", async () => {
      const [part1] = await day13(REAL_FILENAME);

      expect(part1).toBe(6484);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day13(TEST_FILENAME);

      expect(part2).toBe(1);
    });
  });

  describe("whichPacketsInRightOrder", () => {
    it("handles test data correctly", async () => {
      const packetPairs = await parseDistressSignalFile(TEST_FILENAME);

      const pairsInRightOrder = whichPacketsInRightOrder(packetPairs);

      expect(pairsInRightOrder).toStrictEqual([0, 1, 3, 5]);
    });
  });

  describe("parseDistressSignalFile", () => {
    it("parses test input correctly", () => {
      parseDistressSignalFile(TEST_FILENAME);
    });
  });

  describe("packetsInRightOrder", () => {
    it("test input 1", () => {
      const result = packetsInRightOrder([1, 1, 3, 1, 1], [1, 1, 5, 1, 1]);
      expect(result).toBeTruthy();
    });

    it("test input 2", () => {
      const result = packetsInRightOrder([[1], [2, 3, 4]], [[1], 4]);
      expect(result).toBeTruthy();
    });

    it("test input 3", () => {
      const result = packetsInRightOrder([9], [[8, 7, 6]]);
      expect(result).toBeFalsy();
    });

    it("test input 4", () => {
      const result = packetsInRightOrder([[4, 4], 4, 4], [[4, 4], 4, 4, 4]);
      expect(result).toBeTruthy();
    });

    it("test input 5", () => {
      const result = packetsInRightOrder([7, 7, 7, 7], [7, 7, 7]);
      expect(result).toBeFalsy();
    });

    it("test input 6", () => {
      const result = packetsInRightOrder([], [3]);
      expect(result).toBeTruthy();
    });

    it("test input 7", () => {
      const result = packetsInRightOrder([[[]]], [[]]);
      expect(result).toBeFalsy();
    });

    it("test input 8", () => {
      const result = packetsInRightOrder(
        [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
        [1, [2, [3, [4, [5, 6, 0]]]], 8, 9]
      );
      expect(result).toBeFalsy();
    });
  });
});
