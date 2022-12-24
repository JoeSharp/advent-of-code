import day9, {
  countTailPositions,
  denormalisePosition,
  Direction,
  followHead,
  normalisePosition,
  parseRopePull,
  pullKnot,
} from "./index";

describe("day9", () => {
  describe("Day 9", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day9("./src/day9/testInput1.txt");

      expect(part1).toBe(13);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day9("./src/day9/testInput2.txt");

      expect(part2).toBe(36);
    });
  });

  describe("countTailPositions", () => {
    it("handles demo input for part 1 correctly", async () => {
      const part1 = await countTailPositions("./src/day9/testInput1.txt", 2);

      expect(part1).toBe(13);
    });

    it("handles demo input for part 2 correctly", async () => {
      const part2 = await countTailPositions("./src/day9/testInput2.txt", 10);

      expect(part2).toBe(36);
    });
  });

  describe("pullKnot", () => {
    it.each`
      position          | direction          | expected
      ${{ x: 0, y: 0 }} | ${Direction.right} | ${{ x: 1, y: 0 }}
      ${{ x: 5, y: 4 }} | ${Direction.left}  | ${{ x: 4, y: 4 }}
      ${{ x: 3, y: 3 }} | ${Direction.up}    | ${{ x: 3, y: 4 }}
      ${{ x: 3, y: 3 }} | ${Direction.down}  | ${{ x: 3, y: 2 }}
      ${{ x: 3, y: 3 }} | ${Direction.left}  | ${{ x: 2, y: 3 }}
      ${{ x: 3, y: 3 }} | ${Direction.right} | ${{ x: 4, y: 3 }}
      ${{ x: 0, y: 0 }} | ${Direction.down}  | ${{ x: 0, y: -1 }}
      ${{ x: 0, y: 0 }} | ${Direction.left}  | ${{ x: -1, y: 0 }}
    `(
      "from $position to $direction -> $expected",
      ({ position, direction, expected }) => {
        const result = pullKnot(position, direction);
        expect(result).toStrictEqual(expected);
      }
    );
  });

  describe("normalisePosition & denormalisePosition", () => {
    it.each`
      position          | relativeTo        | expected
      ${{ x: 5, y: 6 }} | ${{ x: 3, y: 3 }} | ${{ x: 2, y: 3 }}
      ${{ x: 2, y: 1 }} | ${{ x: 1, y: 1 }} | ${{ x: 1, y: 0 }}
    `(
      "$position relativeTo $relativeTo = $expected",
      ({ position, relativeTo, expected }) => {
        const result = normalisePosition(position, relativeTo);
        expect(result).toStrictEqual(expected);

        const andBack = denormalisePosition(result, relativeTo);
        expect(andBack).toStrictEqual(position);
      }
    );
  });

  describe("followHead", () => {
    it.each`
      head              | tail              | expected
      ${{ x: 0, y: 0 }} | ${{ x: 0, y: 0 }} | ${{ x: 0, y: 0 }}
      ${{ x: 3, y: 1 }} | ${{ x: 1, y: 1 }} | ${{ x: 2, y: 1 }}
      ${{ x: 1, y: 3 }} | ${{ x: 1, y: 1 }} | ${{ x: 1, y: 2 }}
      ${{ x: 2, y: 1 }} | ${{ x: 1, y: 2 }} | ${{ x: 1, y: 2 }}
      ${{ x: 3, y: 2 }} | ${{ x: 1, y: 3 }} | ${{ x: 2, y: 2 }}
      ${{ x: 3, y: 3 }} | ${{ x: 5, y: 5 }} | ${{ x: 4, y: 4 }}
    `("H: $head, T: $tail -> $expected", ({ head, tail, expected }) => {
      const result = followHead(head, tail);
      expect(result).toStrictEqual(expected);
    });
  });

  describe("parseRopePull", () => {
    it("parses a valid line", () => {
      const result = parseRopePull("R 5");
      expect(result).toStrictEqual({
        direction: Direction.right,
        amount: 5,
      });
    });

    it("rejects an invalid direction", () => {
      expect(() => parseRopePull("Z 8")).toThrowError();
    });

    it("rejects an invalid amount", () => {
      expect(() => parseRopePull("U goo")).toThrowError();
    });

    it("rejects outright nonsense", () => {
      expect(() => parseRopePull("monkey")).toThrowError();
    });
  });
});
