import day11, {
  loadMonkeysFromFile,
  parseJaml,
  parseJamlLine,
  parseOperation,
} from "./index";

describe("day11", () => {
  describe("day11", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day11("./src/day11/testInput.txt");

      expect(part1).toBe(10605);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day11("./src/day11/testInput.txt");

      expect(part2).toBe(2713310158);
    });
  });

  describe("parseJamlLine", () => {
    it.each`
      line                                | expected
      ${"Monkey 0:"}                      | ${{ whitespace: 0, key: "Monkey 0", value: "" }}
      ${"\tStarting items: 91, 66"}       | ${{ whitespace: 1, key: "Starting items", value: "91, 66" }}
      ${"\t\tIf true: throw to monkey 8"} | ${{ whitespace: 2, key: "If true", value: "throw to monkey 8" }}
    `("$line", ({ line, expected }) => {
      const result = parseJamlLine(line);
      expect(result).toStrictEqual(expected);
    });
  });

  describe("parseJaml", () => {
    it("can parse jaml as array of strings", () => {
      const result = parseJaml([
        "Monkey 0:",
        "\tStarting items: 91, 66",
        "\tOperation: new = old * 13",
        "\tTest: divisible by 19",
        "\t\tIf true: throw to monkey 6",
        "\t\tIf false: throw to monkey 2",
        "Monkey 1:",
        "\tStarting items: 7, 9",
        "\tOperation: new = old * 5",
        "\tTest: divisible by 8",
        "\t\tIf true: throw to monkey 1",
        "\t\tIf false: throw to monkey 4",
      ]);

      expect(result.children).toHaveLength(2);

      const monkey = result.children[0];
      expect(monkey.key).toBe("Monkey 0");
      expect(monkey.value).toBe("");
      expect(monkey.children).toHaveLength(3);

      const startingItems = monkey.children[0];
      expect(startingItems.key).toBe("Starting items");
      expect(startingItems.value).toBe("91, 66");

      const operation = monkey.children[1];
      expect(operation.key).toBe("Operation");
      expect(operation.value).toBe("new = old * 13");

      const test = monkey.children[2];
      expect(test.key).toBe("Test");
      expect(test.value).toBe("divisible by 19");
      expect(test.children).toHaveLength(2);
      const ifTrue = test.children[0];
      expect(ifTrue.key).toBe("If true");
      expect(ifTrue.value).toBe("throw to monkey 6");

      const ifFalse = test.children[1];
      expect(ifFalse.key).toBe("If false");
      expect(ifFalse.value).toBe("throw to monkey 2");
    });
  });

  describe("parseOperation", () => {
    it.each`
      input               | testValue | expected
      ${"new = old * 19"} | ${4}      | ${76}
      ${"new = old + 13"} | ${10}     | ${23}
      ${"new = old / 4"}  | ${120}    | ${30}
      ${"new = old + 80"} | ${120}    | ${200}
    `("$input", ({ input, testValue, expected }) => {
      const op = parseOperation(input);
      const result = op(testValue);
      expect(result).toBe(expected);
    });
  });

  describe("loadMonkeysFromFile", () => {
    it("can parse a monkeys description", async () => {
      const monkeys = await loadMonkeysFromFile("./src/day11/testInput.txt");
      expect(monkeys).toHaveLength(4);

      const monkey0 = monkeys[0];
      expect(monkey0.itemsHeld).toStrictEqual([79, 98]);
      expect(monkey0.testDivisibleBy).toBe(23);
      expect(monkey0.ifTrueThrowTo).toBe(2);
      expect(monkey0.ifFalseThrowTo).toBe(3);
      expect(monkey0.inspectionsHeld).toBe(0);
      expect(monkey0.operation(4)).toBe(4 * 19);
    });
  });
});
