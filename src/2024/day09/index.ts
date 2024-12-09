import { AdventFunction } from "../../common/types";
import { loadEntireFile } from '../../common/processFile';

export interface Block {
  value: number;
  startIndex: number;
  length: number;
}

export interface Drive {
  contents: number[];
  blocks: Block[];
}

export function expandDrive(input: number[]): Drive {
  let id = 0;
  let isFile = true;
  let index = 0;
  const blocks: Block[] = [];
  const contents = input.map(length => {
    const value = (isFile) ? id : NaN;
    if (isFile) id++;
    isFile = !isFile;

    return { 
      value,
      length,
      contents: Array(length).fill(value)
    }
  }).flatMap((block, i) => {
    if (block.length === 0) return [];

    blocks.push({value: block.value, startIndex: index, length: block.length});
    index += block.length;

    return block.contents;
  });

  return {
    contents,
    blocks
  }
}

export const NOT_FOUND = -1;

export function findNextNaN(input: number[], fromIndex: number): Block {
  for (let i=fromIndex; i<input.length; i++) {
    if (isNaN(input[i])) {
      const startIndex = i;
      let length = 0;
      for (let j=startIndex; j<input.length; j++) {
        if (isNaN(input[j])) {
          length++;
        } else {
          break;
        }
      }
      return {
        startIndex,
        length
      };
    }
  }
  return { startIndex: NOT_FOUND, length: 0};
}

export function defragment(input: number[]): number[] {
  const output = [...input];
  let { startIndex: nextFreeSpace } = findNextNaN(input, 0);
  let rightMost = input.length;

  while (nextFreeSpace < rightMost) {
    if (!isNaN(output[rightMost])) {
      output[nextFreeSpace] = output[rightMost];
      output[rightMost] = NaN;
      const n = findNextNaN(output, nextFreeSpace + 1);
      nextFreeSpace = n.startIndex;
    }

    rightMost--;
  }

  return output;
}

export function defragmentContiguous(drive: Drive): number[] {
  const output = [...drive.contents];
  let { startIndex: nextFreeSpace } = findNextNaN(drive.contents, 0);
/*
  while (nextFreeSpace < rightMost) {
    if (!isNaN(output[rightMost])) {
      output[nextFreeSpace] = output[rightMost];
      output[rightMost] = NaN;
      const n = findNextNaN(output, nextFreeSpace + 1);
      nextFreeSpace = n.startIndex;
    }
  }
  */

  return output;
}

export function calculateChecksum(input: number[]): number {
  return input.reduce((acc, curr, i) => isNaN(curr) ? acc : acc + (curr * i), 0);
}

const day9: AdventFunction = async (filename = "./src/2024/day09/input.txt") => {
  const [line] = await loadEntireFile(filename);
  const input = line.split('').map(i => parseInt(i));

  const expanded = expandDrive(input);
  const defragged1 = defragment(expanded.contents);
  const checksum1 = calculateChecksum(defragged1);

  const defragged2 = defragmentContiguous(expanded);
  const checksum2 = calculateChecksum(defragged2);

  return [checksum1, checksum2];
};

export default day9;
