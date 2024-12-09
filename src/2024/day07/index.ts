import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";

interface Operator {
  symbol: string;
  fn: (a: number, b: number) => number;
}

const PART_1_OPERATORS: Operator[] = [
  {
    symbol: "+",
    fn: (a, b) => a + b,
  },
  {
    symbol: "*",
    fn: (a, b) => a * b,
  },
];

export function concatenate(a: number, b: number) {
  const power = b === 1 ? 1 : Math.log10(b);
  return b + a * Math.pow(10, Math.ceil(power));
}

const PART_2_OPERATORS: Operator[] = [
  ...PART_1_OPERATORS,
  {
    symbol: "||",
    fn: concatenate,
  },
];

interface Calibration {
  output: number;
  inputs: number[];
}

interface CalibrationWithCalcs extends Calibration {
  operatorLines: Operator[][];
}

export function parseCalibration(line: string): Calibration {
  const mainParts = line.split(":");
  const output = parseInt(mainParts[0]);
  const inputs = mainParts[1]
    .trim()
    .split(" ")
    .map((i) => parseInt(i));

  return { output, inputs };
}

export function findValidCalculation(
  validOperators: Operator[],
  output: number,
  soFarResult: number,
  soFarOperators: Operator[],
  inputs: number[],
  receiver: (operators: Operator[]) => void,
): void {
  if (inputs.length === 1) {
    validOperators.forEach((operator) => {
      const result = operator.fn(soFarResult, inputs[0]);
      if (result === output) {
        receiver([...soFarOperators, operator]);
      }
    });
  } else {
    validOperators.forEach((operator) => {
      const interimResult = operator.fn(soFarResult, inputs[0]);
      findValidCalculation(
        validOperators,
        output,
        interimResult,
        [...soFarOperators, operator],
        inputs.slice(1),
        receiver,
      );
    });
  }
}

function debugCalibration(c: CalibrationWithCalcs): CalibrationWithCalcs {
  const { output, inputs, operatorLines } = c;

  operatorLines.forEach((operators) => {
    const msg = operators.reduce(
      (acc, curr, i) => acc + ` ${curr.symbol} ${inputs[i + 1]}`,
      `${output} = ${inputs[0]}`,
    );
    console.log(msg);
  });

  return c;
}

function enrichWithOperators(
  validOperators: Operator[],
  { output, inputs }: Calibration,
): CalibrationWithCalcs {
  const operatorLines: Operator[][] = [];
  findValidCalculation(
    validOperators,
    output,
    inputs[0],
    [],
    inputs.slice(1),
    (o) => operatorLines.push(o),
  );
  return {
    output,
    inputs,
    operatorLines,
  };
}

function enrichWithPart1Operators(c: Calibration): CalibrationWithCalcs {
  return enrichWithOperators(PART_1_OPERATORS, c);
}

function enrichWithPart2Operators(c: Calibration): CalibrationWithCalcs {
  return enrichWithOperators(PART_2_OPERATORS, c);
}

const day7: AdventFunction = async (filename = "./src/2024/day07/input.txt") => {
  const lines = await loadEntireFile(filename);

  const part1 = lines
    .map(parseCalibration)
    .map(enrichWithPart1Operators)
    .filter(({ operatorLines }) => operatorLines.length > 0)
    .map(({ output }) => output)
    .reduce((a, c) => a + c, 0);

  const part2 = lines
    .map(parseCalibration)
    .map(enrichWithPart2Operators)
    .filter(({ operatorLines }) => operatorLines.length > 0)
    .map(({ output }) => output)
    .reduce((a, c) => a + c, 0);

  return [part1, part2];
};

export default day7;
