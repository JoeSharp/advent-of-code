import { promises as fs } from "fs";
import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";
import { arraySectionToString } from "../../common/arrayUtils";

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
  const contents = input
    .map((length) => {
      const value = isFile ? id : NaN;
      if (isFile) id++;
      isFile = !isFile;

      return {
        value,
        length,
        contents: Array(length).fill(value),
      };
    })
    .flatMap((block, i) => {
      if (block.length === 0) return [];

      blocks.push({
        value: block.value,
        startIndex: index,
        length: block.length,
      });
      index += block.length;

      return block.contents;
    });

  return {
    contents,
    blocks,
  };
}

export const NOT_FOUND = -1;

export function findNextNaN(input: number[], fromIndex: number): Block {
  for (let i = fromIndex; i < input.length; i++) {
    if (isNaN(input[i])) {
      const startIndex = i;
      let length = 0;
      for (let j = startIndex; j < input.length; j++) {
        if (isNaN(input[j])) {
          length++;
        } else {
          break;
        }
      }
      return {
        value: NaN,
        startIndex,
        length,
      };
    }
  }
  return { value: NaN, startIndex: NOT_FOUND, length: 0 };
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

function findNextNaNBlock(
  blocks: Block[],
  startIndex: number,
  toAccomodate: Block,
): number {
  for (let i = startIndex; i < blocks.length; i++) {
    if (blocks[i].startIndex > toAccomodate.startIndex) break;
    if (isNaN(blocks[i].value) && blocks[i].length >= toAccomodate.length)
      return i;
    if (blocks[i].startIndex == toAccomodate.startIndex) {
      //console.log(`This block starts at same point as that we are accomodating`, {b: blocks[i], toAccomodate});
    }
  }

  return NOT_FOUND;
}

const CHUNK_SIZE = 128;
export function defragmentContiguous(drive: Drive): number[] {
  const outputBlocks = [...drive.blocks.map((b) => ({ ...b }))];
  const output = [...drive.contents];

  for (let i = outputBlocks.length - 1; i >= 0; i--) {
    const block = outputBlocks[i];
    if (!isNaN(block.value)) {
      const nextFreeBlock = findNextNaNBlock(outputBlocks, 0, block);
      if (nextFreeBlock !== NOT_FOUND) {
        const freeBlock = outputBlocks[nextFreeBlock];
        const freeFrom = arraySectionToString(
          output,
          freeBlock.startIndex,
          freeBlock.length,
          CHUNK_SIZE,
        );
        const toFrom = arraySectionToString(
          output,
          block.startIndex,
          block.length,
          CHUNK_SIZE,
        );
        for (let i = 0; i < block.length; i++) {
          output[freeBlock.startIndex + i] = block.value;
          output[block.startIndex + i] = NaN;
        }

        freeBlock.startIndex += block.length;
        freeBlock.length -= block.length;
      }
    }
  }

  return output;
}

export function calculateChecksum(input: number[]): number {
  return input.reduce(
    (acc, curr, i) => (isNaN(curr) ? acc : acc + curr * i),
    0,
  );
}

const day9: AdventFunction = async (
  filename = "./src/2024/day09/input.txt",
) => {
  const [line] = await loadEntireFile(filename);
  const input = line.split("").map((i) => parseInt(i));

  const expanded = expandDrive(input);
  const defragged1 = defragment(expanded.contents);
  const checksum1 = calculateChecksum(defragged1);

  const defragged2 = defragmentContiguous(expanded);

  const d2 = defragged2.join(",");
  await fs.writeFile("./src/2024/day09/part2_output.txt", d2);

  const checksum2 = calculateChecksum(defragged2);

  return [checksum1, checksum2];
};

export default day9;
