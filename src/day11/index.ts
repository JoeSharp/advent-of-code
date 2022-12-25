import { isDivisibleBy } from "../common/numericUtils";
import { loadEntireFile } from "../common/processFile";
import simpleLogger from "../common/simpleLogger";
import { AdventFunction } from "../common/types";

type Operation = (old: number) => number;

interface Monkey {
  itemsHeld: number[];
  operation: Operation;
  testDivisibleBy: number;
  ifTrueThrowTo: number;
  ifFalseThrowTo: number;
  inspectionsHeld: number;
}

interface Jaml {
  key: string;
  value: string;
  children: Jaml[];
}

interface JamlLine {
  whitespace: number;
  key: string;
  value: string;
}

export const parseJamlLine = (line: string): JamlLine => {
  const parts = line.split(":");
  const whitespace = parts[0].length - parts[0].trimStart().length;
  const key = parts[0].trim();
  const value = parts[1].trim();

  return {
    whitespace,
    key,
    value,
  };
};

export const ROOT_JAML_KEY = "root";

export const parseJaml = (lines: string[]): Jaml => {
  const rootJaml: Jaml = {
    key: ROOT_JAML_KEY,
    value: "",
    children: [],
  };

  let jamlStack: { jaml: Jaml; whitespace: number }[] = [];
  let currentJamlParent: Jaml = rootJaml;
  let previousJaml: Jaml = rootJaml;
  let currentWhitespace = -1;
  lines
    .filter((l) => l.length > 0)
    .map(parseJamlLine)
    .forEach(({ key, value, whitespace }) => {
      const newJaml: Jaml = {
        key,
        value,
        children: [],
      };

      if (whitespace > currentWhitespace) {
        jamlStack.push({
          jaml: currentJamlParent,
          whitespace: currentWhitespace,
        });
        currentWhitespace = whitespace;
        currentJamlParent = previousJaml;
      } else if (whitespace < currentWhitespace) {
        let popped;
        while (jamlStack.length > 0) {
          popped = jamlStack.pop();

          if (popped === undefined)
            throw new Error(
              "Popped an undefined Jaml from stack during parsing"
            );

          if (popped.whitespace === whitespace) {
            break;
          }
        }

        if (popped === undefined) throw new Error("Could not pop back up");

        currentWhitespace = whitespace;
        currentJamlParent = popped.jaml;
      }

      currentJamlParent.children.push(newJaml);

      previousJaml = newJaml;
    });

  return rootJaml;
};

export const findChild = (jaml: Jaml, childKey: string): Jaml => {
  const childJaml = jaml.children.find(({ key }) => key === childKey);

  if (childJaml === undefined) throw new Error(`Could not find ${childKey}`);

  return childJaml;
};

export const parseStartingitems = (asString: string): number[] =>
  asString.split(",").map((d) => parseInt(d, 10));

// new = old * 4
export const parseOperation = (opString: string): Operation => {
  const parts = opString.replace("new =", "").trim().split(" ");

  const operandA = parts[0] === "old" ? "old" : parseInt(parts[0], 10);
  const operatorStr = parts[1];
  const operandB = parts[2] === "old" ? "old" : parseInt(parts[2], 10);

  let operator: (a: number, b: number) => number = () => 0;
  switch (operatorStr) {
    case "*":
      operator = (a, b) => a * b;
      break;
    case "+":
      operator = (a, b) => a + b;
      break;
    case "-":
      operator = (a, b) => a - b;
      break;
    case "/":
      operator = (a, b) => a / b;
      break;
  }

  return (old) => {
    let a = operandA === "old" ? old : operandA;
    let b = operandB === "old" ? old : operandB;

    return operator(a, b);
  };
};

export const parseTestDivisibleBy = (test: string): number =>
  parseInt(test.replace("divisible by ", "").trim(), 10);

export const parseThrowTo = (throwTo: string): number =>
  parseInt(throwTo.replace("throw to monkey ", "").trim(), 10);

export const loadMonkeysFromFile = async (
  filename: string
): Promise<Monkey[]> => {
  const lines = await loadEntireFile(filename);

  const jaml = parseJaml(lines);

  let monkeys: Monkey[] = jaml.children.map((monkeyJaml) => {
    const startingItemsJaml = findChild(monkeyJaml, "Starting items");
    const operationJaml = findChild(monkeyJaml, "Operation");
    const testJaml = findChild(monkeyJaml, "Test");

    const ifTrue = findChild(testJaml, "If true");
    const ifFalse = findChild(testJaml, "If false");

    return {
      itemsHeld: parseStartingitems(startingItemsJaml.value),
      operation: parseOperation(operationJaml.value),
      testDivisibleBy: parseTestDivisibleBy(testJaml.value),
      ifTrueThrowTo: parseThrowTo(ifTrue.value),
      ifFalseThrowTo: parseThrowTo(ifFalse.value),
      inspectionsHeld: 0,
    };
  });

  return monkeys;
};

export const processMonkeyBusinessRound = (
  monkeys: Monkey[],
  worryDivider: number,
  lcmOfDividers: number
) => {
  monkeys.forEach((monkey) => {
    while (monkey.itemsHeld.length > 0) {
      let item = monkey.itemsHeld.shift();
      if (item === undefined) throw new Error("Something impossible happened");
      monkey.inspectionsHeld += 1;
      let updatedItem = monkey.operation(item);
      updatedItem = Math.floor(updatedItem / worryDivider);
      updatedItem %= lcmOfDividers;
      let destinationMonkey = isDivisibleBy(updatedItem, monkey.testDivisibleBy)
        ? monkey.ifTrueThrowTo
        : monkey.ifFalseThrowTo;
      monkeys[destinationMonkey].itemsHeld.push(updatedItem);
    }
  });
};

export const processMonkeyBusiness = (
  monkeys: Monkey[],
  rounds: number,
  worryDivider: number,
  lcmOfDividers: number
): void => {
  for (let i = 0; i < rounds; i++) {
    processMonkeyBusinessRound(monkeys, worryDivider, lcmOfDividers);
    if (isDivisibleBy(i + 1, 1000) || i === 19 || i === 0) {
      simpleLogger.debug(`Round ${i + 1}`);
      simpleLogger.debug("At end of the round");
      monkeys.forEach(({ inspectionsHeld, itemsHeld }, i) =>
        simpleLogger.debug(
          `${i} - Inspections: ${inspectionsHeld}, Items: ${itemsHeld.join(
            ", "
          )}`
        )
      );
    }
  }
};

export const countMonkeyBusiness = (
  monkeys: Monkey[],
  highest: number
): number =>
  monkeys
    .sort((a, b) => b.inspectionsHeld - a.inspectionsHeld)
    .filter((_, i) => i < highest)
    .reduce((acc, curr) => acc * curr.inspectionsHeld, 1);

export const calculateMonkeyBusiness = async (
  filename: string,
  rounds: number,
  divider: number
): Promise<number> => {
  const monkeys = await loadMonkeysFromFile(filename);
  const lcm = monkeys.reduce((acc, curr) => acc * curr.testDivisibleBy, 1);
  processMonkeyBusiness(monkeys, rounds, divider, lcm);
  return countMonkeyBusiness(monkeys, 2);
};

const day11: AdventFunction = async (filename = "./src/day11/input.txt") => {
  const partOne = await calculateMonkeyBusiness(filename, 20, 3);
  const partTwo = await calculateMonkeyBusiness(filename, 10000, 1);

  return new Promise((resolve) => {
    resolve([partOne, partTwo]);
  });
};

export default day11;
