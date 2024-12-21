import day16, {
  loadRawMaze,
  convertMazeToGraph,
  graphToStr,
  isGoingBack,
  isTurningCorner,
} from "./index";
import {
  gridArrayToStr,
  NORTH,
  SOUTH,
  WEST,
  EAST,
} from "../../common/arrayUtils";

const TEST_INPUT_FILE_1 = "./src/2024/day16/testInput1.txt";
const TEST_INPUT_FILE_2 = "./src/2024/day16/testInput2.txt";

describe("day16", () => {
  it.each`
    current  | next     | expected
    ${NORTH} | ${SOUTH} | ${true}
    ${NORTH} | ${WEST}  | ${false}
    ${NORTH} | ${EAST}  | ${false}
    ${NORTH} | ${NORTH} | ${false}
    ${EAST}  | ${SOUTH} | ${false}
    ${EAST}  | ${WEST}  | ${true}
    ${EAST}  | ${EAST}  | ${false}
    ${EAST}  | ${NORTH} | ${false}
    ${WEST}  | ${SOUTH} | ${false}
    ${WEST}  | ${WEST}  | ${false}
    ${WEST}  | ${EAST}  | ${true}
    ${WEST}  | ${NORTH} | ${false}
    ${SOUTH} | ${SOUTH} | ${false}
    ${SOUTH} | ${WEST}  | ${false}
    ${SOUTH} | ${EAST}  | ${false}
    ${SOUTH} | ${NORTH} | ${true}
  `(
    "is going back $current, $next, $expected",
    ({ current, next, expected }) => {
      const result = isGoingBack(current, next);

      expect(result).toBe(expected);
    },
  );

  it.each`
    current  | next     | expected
    ${NORTH} | ${SOUTH} | ${false}
    ${NORTH} | ${WEST}  | ${true}
    ${NORTH} | ${EAST}  | ${true}
    ${NORTH} | ${NORTH} | ${false}
    ${EAST}  | ${SOUTH} | ${true}
    ${EAST}  | ${WEST}  | ${false}
    ${EAST}  | ${EAST}  | ${false}
    ${EAST}  | ${NORTH} | ${true}
    ${WEST}  | ${SOUTH} | ${true}
    ${WEST}  | ${WEST}  | ${false}
    ${WEST}  | ${EAST}  | ${false}
    ${WEST}  | ${NORTH} | ${true}
    ${SOUTH} | ${SOUTH} | ${false}
    ${SOUTH} | ${WEST}  | ${true}
    ${SOUTH} | ${EAST}  | ${true}
    ${SOUTH} | ${NORTH} | ${false}
  `(
    "is turning corner $current, $next, $expected",
    ({ current, next, expected }) => {
      const result = isTurningCorner(current, next);

      expect(result).toBe(expected);
    },
  );

  it("loadRawMaze", async () => {
    const rawMaze = await loadRawMaze(TEST_INPUT_FILE_1);

    expect(rawMaze.start).toStrictEqual([13, 1]);
    expect(rawMaze.end).toStrictEqual([1, 13]);
    expect(rawMaze.contents.length).toBe(15);
    expect(rawMaze.contents[0].length).toBe(15);
  });

  //${TEST_INPUT_FILE_2} | ${11048} | ${45}
  it.only.each`
    inputFile            | expectedPart1 | expectedPart2
    ${TEST_INPUT_FILE_1} | ${7036}       | ${64}
  `(
    "calculates shortest path for $inputFile to be $expected",
    async ({ inputFile, expectedPart1, expectedPart2 }) => {
      const [part1, part2] = await day16(inputFile);

      expect(part1).toBe(expectedPart1);
      //expect(part2).toBe(expectedPart2);
    },
  );
});
