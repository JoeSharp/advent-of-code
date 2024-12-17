import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";

export enum OpCode {
  ADV = 0, // Division -> A
  BXL = 1, // Bitwise OR
  BST = 2, // Modulo 8
  JNZ = 3, // If Reg A > 0, Jumps
  BXC = 4, // Bitwise XOR or B,C -> A
  OUT = 5, // write out operand modulo 8
  BDV = 6, // ADV but result -> B
  CDV = 7, // ADV but result -> C
}

export interface Operation {
  opCode: OpCode;
  operand: number;
}

interface Computer {
  regA: number;
  regB: number;
  regC: number;

  programCounter: number;
  program: Operation[];
  rawProgram: number[];
  output: number[];
}

function parseRegister(input: string): number {
  return parseInt(input.split(":").map((d) => d.trim())[1]);
}

function parseOperation(input: number): OpCode {
  switch (input) {
    case OpCode.ADV:
      return OpCode.ADV;
    case OpCode.BXL:
      return OpCode.BXL;
    case OpCode.BST:
      return OpCode.BST;
    case OpCode.JNZ:
      return OpCode.JNZ;
    case OpCode.BXC:
      return OpCode.BXC;
    case OpCode.OUT:
      return OpCode.OUT;
    case OpCode.BDV:
      return OpCode.BDV;
    case OpCode.CDV:
      return OpCode.CDV;
  }
  throw new Error(`invalid op code ${input}`);
}

function parseProgramValues(input: string): number[] {
  return input
    .split(":")[1]
    .split(",")
    .map((d) => parseInt(d));
}

function parseProgram(values: number[]): Operation[] {
  let program: Operation[] = [];

  for (let i = 0; i < values.length; i += 2) {
    program.push({ opCode: parseOperation(values[i]), operand: values[i + 1] });
  }

  return program;
}

export function parseComputer(input: string[]): Computer {
  const regA = parseRegister(input[0]);
  const regB = parseRegister(input[1]);
  const regC = parseRegister(input[2]);

  const rawProgram = parseProgramValues(input[4]);
  const program = parseProgram(rawProgram);

  return {
    regA,
    regB,
    regC,
    program,
    rawProgram,
    programCounter: 0,
    output: [],
  };
}

function getComboOperand(computer: Computer, operand: number): number {
  switch (operand) {
    case 4:
      return computer.regA;
    case 5:
      return computer.regB;
    case 6:
      return computer.regC;
    default:
      return operand;
  }
}

function xdv(computer: Computer, operand: number) {
  const comboOperand = getComboOperand(computer, operand);
  return Math.floor(computer.regA / (Math.pow(2, comboOperand)));
}

function adv(computer: Computer, operand: number) {
  computer.regA = xdv(computer, operand);
}

function bxl(computer: Computer, operand: number) {
  computer.regB = computer.regB ^ operand;
}

function bst(computer: Computer, operand: number) {
  const comboOperand = getComboOperand(computer, operand);
  computer.regB = comboOperand % 8;
}

function jnz(computer: Computer, operand: number) {
  if (computer.regA !== 0) {
    computer.programCounter = operand;
  }
}

function bxc(computer: Computer, operand: number) {
  computer.regB = computer.regB ^ computer.regC;
}

function out(computer: Computer, operand: number) {
  const comboOperand = getComboOperand(computer, operand);
  const newOutput = comboOperand % 8;
  computer.output.push(newOutput);
}

function bdv(computer: Computer, operand: number) {
  computer.regB = xdv(computer, operand);
}

function cdv(computer: Computer, operand: number) {
  computer.regC = xdv(computer, operand);
}

export function processComputer(computer: Computer, checkGeneratingSelf: boolean = false): boolean {
  while (computer.programCounter < computer.program.length) {
    const { opCode, operand } = computer.program[computer.programCounter];

    switch (opCode) {
      case OpCode.ADV:
        adv(computer, operand);
        break;
      case OpCode.BXL:
        bxl(computer, operand);
        break;
      case OpCode.BST:
        bst(computer, operand);
        break;
      case OpCode.JNZ:
        jnz(computer, operand);
        break;
      case OpCode.BXC:
        bxc(computer, operand);
        break;
      case OpCode.OUT:
        out(computer, operand);
        if (checkGeneratingSelf) {
          const index = computer.output.length - 1;
          if (computer.rawProgram[index] !== computer.output[index]) {
            return false;
          }
        }
        break;
      case OpCode.BDV:
        bdv(computer, operand);
        break;
      case OpCode.CDV:
        cdv(computer, operand);
        break;
    }

    if (!(opCode === OpCode.JNZ && computer.regA > 0)) {
      computer.programCounter++;
    }
  }

  return computer.rawProgram.length === computer.output.length;
}

export function findValueToGenerateSelf(computer: Computer): number {

  let value = 1740100000;
  while (true) {
    if (value % 100000000 === 0) {
      console.log(`Trying ${value}`);
    }

    computer.regA = value;
    computer.programCounter = 0;
    computer.output = [];

    if (processComputer(computer, true)) {
      console.log('Value Found', computer);
      return value;
    }

    value++;
  }

  return NaN;
}

const day17: AdventFunction = async (
  filename = "./src/2024/day17/input.txt",
) => {
  const contents = await loadEntireFile(filename);
  const computer = parseComputer(contents);

  processComputer(computer);

  const part1 = computer.output.map((d) => d.toString()).join(",");
  const part2 = findValueToGenerateSelf(computer);

  return [part1, part2];
};

export default day17;
