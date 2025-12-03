import { loadEntireFile } from "../../common/processFile";
import { AdventFunction } from "../../common/types";

type DialDirection = -1 | 1;

type DialTurn = {
  direction: DialDirection;
  amount: number;
};

type DialState = {
  landZero: number;
  passZero: number;
  value: number;
};

export function parseDialTurn(input: string): DialTurn {
  const dirStr = input[0];
  const amountStr = input.slice(1);

  const direction = dirStr === "R" ? 1 : -1;
  const amount = parseInt(amountStr);

  return {
    direction,
    amount,
  };
}

export function turnDial(state: DialState, turn: DialTurn): DialState {
  let value = state.value;
  let landZero = state.landZero;
  let passZero = state.passZero;
  for (let i = 0; i < turn.amount; i++) {
    value += turn.direction;
    if (value === -1) {
      value = 99;
    }
    if (value === 100) {
      value = 0;
    }
    if (value === 0) {
      passZero += 1;
    }
  }
  if (value === 0) {
    landZero += 1;
  }

  const newState: DialState = {
    value,
    landZero,
    passZero,
  };
  return newState;
}

const dayX: AdventFunction = async (
  filename = "./src/2025/day01/input.txt"
) => {
  const initialState: DialState = {
    value: 50,
    landZero: 0,
    passZero: 0,
  };
  const lines = await loadEntireFile(filename);

  const endState = lines
    .map(parseDialTurn)
    .reduce((acc, curr) => turnDial(acc, curr), initialState);

  return [endState.landZero, endState.passZero];
};

export default dayX;
