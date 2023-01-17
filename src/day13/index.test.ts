import day13, {
  Packet,
  packetsInRightOrder,
  parseDistressSignalFile,
  parsePacket,
  whichPacketsInRightOrder,
} from "./index";

const TEST_FILENAME = "./src/day13/testInput.txt";
const REAL_FILENAME = "./src/day13/input.txt";
const REAL_FIRST_10_FILENAME = "./src/day13/inputFirst10.txt";

describe("day13", () => {
  describe("day13", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day13(TEST_FILENAME);

      expect(part1).toBe(13);
    });
    it("handles first 10 of real input for part 1 correctly", async () => {
      const [part1] = await day13(REAL_FIRST_10_FILENAME);

      expect(part1).toBe(39);
    });
    it("handles real input for part 1 correctly", async () => {
      const [part1] = await day13(REAL_FILENAME);

      expect(part1).toBe(6484);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day13(TEST_FILENAME);

      expect(part2).toBe(1);
    });
    it("handles first 10 of real input for part 2 correctly", async () => {
      const [, part2] = await day13(TEST_FILENAME);

      expect(part2).toBe(78);
    });
  });

  describe.only("whichPacketsInRightOrder", () => {
    it("handles test data correctly", async () => {
      const packetPairs = await parseDistressSignalFile(TEST_FILENAME);

      const pairsInRightOrder = whichPacketsInRightOrder(packetPairs);

      expect(pairsInRightOrder).toStrictEqual([1, 2, 4, 6]);
    });
    it.only("handles first real 10 of input data correctly", async () => {
      const packetPairs = await parseDistressSignalFile(REAL_FIRST_10_FILENAME);

      const pairsInRightOrder = whichPacketsInRightOrder(packetPairs);

      expect(pairsInRightOrder).toStrictEqual([1, 2, 4, 6, 7, 9, 10]);
    });
  });

  describe("parseDistressSignalFile", () => {
    it("parses test input correctly", () => {
      parseDistressSignalFile(TEST_FILENAME);
    });
  });

  const INPUT_1_LEFT = [
    [
      [[], [10], [5, 6, 2], 6],
      [2, [6, 3], 7, 5, 2],
      [6, 10, 5, [], 6],
      [[5, 9], 5],
    ],
    [],
    [
      [10],
      [
        [8, 9, 1, 7],
        [0, 8, 10, 10],
      ],
      8,
    ],
    [
      2,
      [[0, 5], [0, 6], [], 0, [7, 8, 4]],
      [[4, 1, 7, 6], 4, 8, [], [5, 7, 7, 0]],
      10,
    ],
    [[[], 0, 4, 3], 5],
  ];
  const INPUT_1_RIGHT = [
    [5, 10, [[4, 5], 8, [0, 7, 5]], [6, [5, 6, 4, 0, 7], 1]],
  ];
  const INPUT_1_EXPECTED = true;

  const INPUT_2_LEFT = [
    [[3, [8, 10], 3, 7], [], [[6]]],
    [[[], [], 5, 9], 1, [[5, 10, 10, 5]]],
  ];
  const INPUT_2_RIGHT = [[4]];
  const INPUT_2_EXPECTED = true;

  const INPUT_3_LEFT = [
    [[[9, 0, 4, 0], [1, 0, 9, 9, 10], 7], 3, 4, []],
    [
      [10, [1, 8], 8, 1],
      [
        [10, 4],
        [2, 1, 1],
      ],
    ],
    [],
    [],
    [2, [5, 6, [2, 9, 3], [2, 5], [10, 6, 1]]],
  ];
  const INPUT_3_RIGHT = [
    [8, [[2], [10, 4, 3, 8], []], [5, 3, 1, []], 6, [8, [10], [10, 5]]],
    [],
  ];
  const INPUT_3_EXPECTED = false;

  const INPUT_4_LEFT = [[7, []]];
  const INPUT_4_RIGHT = [
    [[10, [2, 9, 4, 1, 2], [6, 2], [6, 2, 0, 9, 1], 1], 3, 2, 5, [3, []]],
    [10, 0, 9, 1],
    [2, 7, [7], [1, 0, 9, 6]],
    [[5, 0, 7, [9]], [[1, 8, 2, 3], [0, 10, 5, 2], [], 7, 7], 5, 5, 10],
  ];
  const INPUT_4_EXPECTED = true;

  const INPUT_5_LEFT = [[[7], 2, [5], 1]];
  const INPUT_5_RIGHT = [[0, 0, 3, [[8, 7], 5, 5, 4, [0, 10, 2, 3]]]];
  const INPUT_5_EXPECTED = false;

  const INPUT_6_LEFT = [[], [[5, 2, 0, [], 0]]];
  const INPUT_6_RIGHT = [
    [[3, 5], [[8], 6], 0, [5, 6, 0, 1], [0]],
    [[[3, 5]], 7, 8],
    [
      [],
      [7, [5, 8, 5, 0, 3], 10, [3]],
      [[9, 8], [5, 9, 0, 10, 3], [4, 2, 4, 8], 9, []],
      6,
    ],
  ];
  const INPUT_6_EXPECTED = true;

  const INPUT_7_LEFT = [[], [[[2, 3, 6]], 10, [[3, 1, 0, 7, 2], 7]]];
  const INPUT_7_RIGHT = [
    [[6, [6, 10, 3], [10, 5, 1], 8, [2, 9, 1, 6]]],
    [6, [[], [5, 7, 2, 9]], [7, 6, [9]]],
    [[[2, 9, 7], [1, 9, 2, 1], 7, 4], 8, 9],
  ];
  const INPUT_7_EXPECTED = true;

  const INPUT_8_LEFT = [[5, 5, 5, []]];
  const INPUT_8_RIGHT = [
    [3, [[9, 0, 0], 10, [9], [5, 5, 4]], 5, 5],
    [
      7,
      [0, [10], 3, [3], [7, 4, 3, 2]],
      [[5, 5]],
      [[], 6, [10, 7], [7, 4]],
      [[7, 5, 7], 2, 7, [5, 3, 2], []],
    ],
    [[[4, 5, 10], [], [], [2, 0]]],
    [7, 0, [[], 1, []], [[], [4, 3, 3, 8], 5, 6, [6, 6]]],
    [7, 9],
  ];
  const INPUT_8_EXPECTED = false;

  const INPUT_9_LEFT = [
    [],
    [
      [[2, 0], [4, 4, 8, 5, 3], 2, 3, []],
      [10, 0, 5, [7, 6, 8, 9], [1, 1, 7]],
      0,
      10,
      4,
    ],
    [[], 6, [[10, 2, 1, 6], [6], 8, [2, 10, 5, 0, 1]]],
  ];
  const INPUT_9_RIGHT = [
    [10, 9, [[], [9, 1, 0, 8], [5, 6], 2], 2],
    [[[8, 8, 1, 9, 5], 8, [10, 10, 7, 4], 10], [3, [9], 2, 0], 0, [[3, 7], 5]],
    [6, [1], 5, 10, 7],
    [],
    [0, [], 10, [[3, 7, 0], [7, 10], 0, 4, 2], 10],
  ];
  const INPUT_9_EXPECTED = true;

  const INPUT_10_LEFT = [
    [6, 7, [], [8], [5, [7, 7, 1]]],
    [5, [8, [7, 5], [4, 2, 10, 6, 10]], [6, 3, [1], []]],
    [],
  ];
  const INPUT_10_RIGHT = [
    [[[10]]],
    [],
    [
      6,
      [5],
      [
        [4, 6, 1, 5],
        [3, 1, 7, 0, 2],
      ],
      4,
      [
        [6, 5],
        [9, 3, 3, 10],
        [2, 10, 9, 7],
        [9, 6, 1, 0],
      ],
    ],
    [[[1, 9, 0], 9], [4, 3], 3],
    [[10, 4]],
  ];
  const INPUT_10_EXPECTED = true;

  describe.only("packetsInRightOrder", () => {
    it.each`
      name              | left                                   | right                                  | expected
      ${"testInput[1]"} | ${[1, 1, 3, 1, 1]}                     | ${[1, 1, 5, 1, 1]}                     | ${true}
      ${"testInput[2]"} | ${[[1], [2, 3, 4]]}                    | ${[[1], 4]}                            | ${true}
      ${"testInput[3]"} | ${[9]}                                 | ${[[8, 7, 6]]}                         | ${false}
      ${"testInput[4]"} | ${[[4, 4], 4, 4]}                      | ${[[4, 4], 4, 4, 4]}                   | ${true}
      ${"testInput[5]"} | ${[7, 7, 7, 7]}                        | ${[7, 7, 7]}                           | ${false}
      ${"testInput[6]"} | ${[]}                                  | ${[3]}                                 | ${true}
      ${"testInput[7]"} | ${[[[]]]}                              | ${[[]]}                                | ${false}
      ${"testInput[7]"} | ${[1, [2, [3, [4, [5, 6, 7]]]], 8, 9]} | ${[1, [2, [3, [4, [5, 6, 0]]]], 8, 9]} | ${false}
      ${"input[1]"}     | ${INPUT_1_LEFT}                        | ${INPUT_1_RIGHT}                       | ${INPUT_1_EXPECTED}
      ${"input[2]"}     | ${INPUT_2_LEFT}                        | ${INPUT_2_RIGHT}                       | ${INPUT_2_EXPECTED}
      ${"input[3]"}     | ${INPUT_3_LEFT}                        | ${INPUT_3_RIGHT}                       | ${INPUT_3_EXPECTED}
      ${"input[4]"}     | ${INPUT_4_LEFT}                        | ${INPUT_4_RIGHT}                       | ${INPUT_4_EXPECTED}
      ${"input[5]"}     | ${INPUT_5_LEFT}                        | ${INPUT_5_RIGHT}                       | ${INPUT_5_EXPECTED}
      ${"input[6]"}     | ${INPUT_6_LEFT}                        | ${INPUT_6_RIGHT}                       | ${INPUT_6_EXPECTED}
      ${"input[7]"}     | ${INPUT_7_LEFT}                        | ${INPUT_7_RIGHT}                       | ${INPUT_7_EXPECTED}
      ${"input[8]"}     | ${INPUT_8_LEFT}                        | ${INPUT_8_RIGHT}                       | ${INPUT_8_EXPECTED}
      ${"input[9]"}     | ${INPUT_9_LEFT}                        | ${INPUT_9_RIGHT}                       | ${INPUT_9_EXPECTED}
      ${"input[10]"}    | ${INPUT_10_LEFT}                       | ${INPUT_10_RIGHT}                      | ${INPUT_10_EXPECTED}
    `("$name", ({ left, right, expected }) => {
      const result = packetsInRightOrder(left, right);
      expect(result).toBe(expected);
    });
  });

  describe("parsePacket", () => {
    it.each`
      line                 | expected
      ${"[1, 1, 3, 1, 1]"} | ${[1, 1, 3, 1, 1]}
    `("$line", ({ line, expected }) => {
      const result = parsePacket(line);
      console.log(result);
      expect(result).toStrictEqual(expected);
    });
  });
});
