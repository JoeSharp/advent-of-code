import * as fs from "fs";
import readline from "readline";
import simpleLogger from "../common/simpleLogger";

import { AdventFunction } from "../common/types";

export enum CommandType {
  noop,
  addx,
}

export interface Noop {
  type: CommandType.noop;
}

export interface Addx {
  type: CommandType.addx;
  amount: number;
}

export type Command = Noop | Addx;

export const parseCommand = (input: string): Command => {
  if (input.startsWith("noop")) {
    return {
      type: CommandType.noop,
    };
  } else {
    const parts = input.split(" ");

    const amount = parseInt(parts[1], 10);

    if (isNaN(amount)) {
      throw new Error(`Invalid amount in command line ${input}`);
    }

    return {
      type: CommandType.addx,
      amount,
    };
  }
};

export interface CpuState {
  cycle: number;
  registerX: number;
}

export const createCpuState = (): CpuState => ({
  cycle: 1,
  registerX: 1,
});

export type CycleCallback = (state: CpuState) => void;

export const incrementCycle = (state: CpuState): CpuState => ({
  cycle: state.cycle + 1,
  registerX: state.registerX,
});

export const incrementRegister = (
  state: CpuState,
  amount: number
): CpuState => ({
  cycle: state.cycle + 1,
  registerX: state.registerX + amount,
});

export const processCommand = (
  state: CpuState,
  command: Command,
  cycleCallback: CycleCallback
): CpuState => {
  simpleLogger.debug(
    `Processing Command ${JSON.stringify(command)} with state: ${JSON.stringify(
      state
    )}`,
    command
  );

  switch (command.type) {
    case CommandType.noop:
      cycleCallback(state);
      return incrementCycle(state);
    case CommandType.addx:
      cycleCallback(state);
      let stateC1 = incrementCycle(state);
      cycleCallback(stateC1);
      return incrementRegister(stateC1, command.amount);
  }
};

export const processCpuFile = (
  filename: string,
  cycleCallback: CycleCallback
): Promise<void> => {
  return new Promise<void>((resolve) => {
    let state = createCpuState();

    var r = readline.createInterface({
      input: fs.createReadStream(filename),
    });
    r.on("line", (line) => {
      const command = parseCommand(line);
      state = processCommand(state, command, cycleCallback);
    }).on("close", () => {
      resolve();
    });
  });
};

export const countSignalStrength = async (
  filename: string,
  firstCycle: number,
  cycleInterval: number
): Promise<number> => {
  let total = 0;

  await processCpuFile(filename, ({ registerX, cycle }) => {
    if ((cycle - firstCycle) % cycleInterval === 0) {
      total += cycle * registerX;
      simpleLogger.debug(
        `At cycle ${cycle}, register is ${registerX}, total: ${total}`
      );
    }
  });

  return total;
};

const day10: AdventFunction = async (filename = "./src/day10/input.txt") => {
  const partOne = await countSignalStrength(filename, 20, 40);

  return [partOne, 1];
};

export default day10;
