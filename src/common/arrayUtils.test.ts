import {
  turnRight,
  applyDirection,
  findStartPosition,
  getNextBlock,
  nextStepLeavesMap,
  splitIntoChunks,
  NORTH,
  SOUTH,
  EAST,
  WEST,
} from "./arrayUtils";
import { loadEntireFileAsGrid } from "./processFile";

const TEST_INPUT_FILE = "./src/2024/day06/testInput.txt";

describe("arrayUtils", () => {
  it.each`
    input                    | chunkSize | expected
    ${[0, 1, 2]}             | ${1}      | ${[[0], [1], [2]]}
    ${[0, 1, 2, 3, 4, 5]}    | ${2}      | ${[[0, 1], [2, 3], [4, 5]]}
    ${[0, 1, 2, 3, 4, 5, 6]} | ${2}      | ${[[0, 1], [2, 3], [4, 5], [6]]}
  `(
    "splitIntoChunks $input into $chunkSize => $expected",
    ({ input, chunkSize, expected }) => {
      const result = splitIntoChunks(input, chunkSize);
      expect(result).toStrictEqual(expected);
    },
  );
  it.each`
    input    | expected
    ${NORTH} | ${EAST}
    ${EAST}  | ${SOUTH}
    ${EAST}  | ${SOUTH}
    ${SOUTH} | ${WEST}
  `("Turns right from $input to $expected", ({ input, expected }) => {
    const result = turnRight(input);
    expect(result).toStrictEqual(expected);
  });

  it.each`
    position  | direction | expected
    ${[3, 5]} | ${NORTH}  | ${[2, 5]}
    ${[3, 5]} | ${SOUTH}  | ${[4, 5]}
    ${[3, 5]} | ${EAST}   | ${[3, 6]}
    ${[3, 5]} | ${WEST}   | ${[3, 4]}
  `(
    "Applies direction $direction correctly position -> $expected",
    ({ position, direction, expected }) => {
      const result = applyDirection(position, direction);

      expect(result).toStrictEqual(expected);
    },
  );

  it.each`
    position  | direction | expected
    ${[0, 5]} | ${NORTH}  | ${true}
    ${[6, 9]} | ${EAST}   | ${true}
    ${[9, 4]} | ${SOUTH}  | ${true}
    ${[2, 0]} | ${WEST}   | ${true}
    ${[1, 5]} | ${NORTH}  | ${false}
    ${[6, 4]} | ${EAST}   | ${false}
    ${[4, 4]} | ${SOUTH}  | ${false}
    ${[2, 2]} | ${WEST}   | ${false}
  `(
    "nextStepLeavesMap $position -> $direction = $expected",
    async ({ position, direction, expected }) => {
      // Given
      const grid = await loadEntireFileAsGrid(TEST_INPUT_FILE);

      // When
      const result = nextStepLeavesMap(grid, position, direction);

      // Then
      expect(result).toBe(expected);
    },
  );

  it.each`
    position  | direction | expected
    ${[0, 0]} | ${SOUTH}  | ${"."}
    ${[6, 0]} | ${EAST}   | ${"#"}
    ${[7, 4]} | ${NORTH}  | ${"^"}
    ${[4, 8]} | ${WEST}   | ${"#"}
    ${[4, 8]} | ${EAST}   | ${"."}
  `(
    "getNextBlock $position -> $direction = $expected",
    async ({ position, direction, expected }) => {
      // Given
      const grid = await loadEntireFileAsGrid(TEST_INPUT_FILE);

      // When
      const result = getNextBlock(grid, position, direction);

      // Then
      expect(result).toBe(expected);
    },
  );
});
