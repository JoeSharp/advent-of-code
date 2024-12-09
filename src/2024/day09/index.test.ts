import day9, { expandDrive, defragment, findNextNaN } from "./index";
import { loadEntireFile } from '../../common/processFile';

const TEST_INPUT_FILE = "./src/2024/day09/testInput.txt";

describe("day9", () => {
  describe("day9", () => {
    it("expandDrive", () => {
      // Given
      const input = "12345".split('').map(i => parseInt(i));

      // When
      const result = expandDrive(input);

      //Then
      expect(result.contents).toStrictEqual([0,NaN,NaN,1,1,1,NaN,NaN,NaN,NaN,2,2,2,2,2]);
    });
    it("expandDriveTestInput", async () => {
      const [line] = await loadEntireFile(TEST_INPUT_FILE);
      const input = line.split('').map(i => parseInt(i));

      const result = expandDrive(input);

      expect(result.contents).toStrictEqual([0,0,NaN,NaN,NaN,1,1,1,NaN,NaN,NaN,2,NaN,NaN,NaN,3,3,3,NaN,4,4,NaN,5,5,5,5,NaN,6,6,6,6,NaN,7,7,7,NaN,8,8,8,8,9,9]);
      expect(result.blocks).toStrictEqual([
        { value: 0, startIndex: 0, length: 2 },
        { value: NaN, startIndex: 2, length: 3 },
        { value: 1, startIndex: 5, length: 3 },
        { value: NaN, startIndex: 8, length: 3 },
        { value: 2, startIndex: 11, length: 1 },
        { value: NaN, startIndex: 12, length: 3 },
        { value: 3, startIndex: 15, length: 3 },
        { value: NaN, startIndex: 18, length: 1 },
        { value: 4, startIndex: 19, length: 2 },
        { value: NaN, startIndex: 21, length: 1 },
        { value: 5, startIndex: 22, length: 4 },
        { value: NaN, startIndex: 26, length: 1 },
        { value: 6, startIndex: 27, length: 4 },
        { value: NaN, startIndex: 31, length: 1 },
        { value: 7, startIndex: 32, length: 3 },
        { value: NaN, startIndex: 35, length: 1 },
        { value: 8, startIndex: 36, length: 4 },
        { value: 9, startIndex: 40, length: 2 },
      ]);
    });

    it("findNextNaN", () => {
      const input = [0, 2, NaN, NaN, 4, NaN, NaN, NaN];
      const result1 = findNextNaN(input, 0);
      const result2 = findNextNaN(input, result1.startIndex + result1.length);

      expect(result1).toStrictEqual({value: NaN, startIndex: 2, length: 2});
      expect(result2).toStrictEqual({value: NaN, startIndex: 5, length: 3});
    });

    it("defragments", () => {
      // Given
      const input = "12345".split('').map(i => parseInt(i));
      const fragged = expandDrive(input);

      // When
      const result = defragment(fragged.contents);

      // Then
      expect(result).toStrictEqual([0,2,2,1,1,1,2,2,2,NaN,NaN,NaN,NaN,NaN,NaN]);
    });

    it("defragsTestInput", async () => {
      // Given
      const [line] = await loadEntireFile(TEST_INPUT_FILE);
      const input = line.split('').map(i => parseInt(i));
      const fragged = expandDrive(input);

      // When
      const result = defragment(fragged.contents);

      // Then
      expect(result).toStrictEqual([0,0,9,9,8,1,1,1,8,8,8,2,7,7,7,3,3,3,6,4,4,6,5,5,5,5,6,6,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN]);
    });

    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day9(TEST_INPUT_FILE);

      expect(part1).toBe(1928);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day9(TEST_INPUT_FILE);

      expect(part2).toBe(2858);
    });
  });
});
