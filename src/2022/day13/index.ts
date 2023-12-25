import { Stack } from "../../common/buffers";
import { processFileInChunks } from "../../common/processFile";
import simpleLogger from "../../common/simpleLogger";
import { AdventFunction } from "../../common/types";

export type Packet = (number | Packet)[];

export type PacketPair = [Packet, Packet];

export const itemsInRightOrder = (a: Packet | number, b: Packet | number) => {};

export const parsePacket = (line: string): Packet => JSON.parse(line) as Packet;

export const packetsInRightOrder = (
  left: Packet,
  right: Packet,
  depth: number = 0
): boolean => {
  const printPrefix = new Array(depth).fill(`\t`).join("");

  simpleLogger.debug("");
  simpleLogger.debug(
    `${printPrefix}Comparing ${JSON.stringify(left)} vs ${JSON.stringify(
      right
    )} at depth ${depth}`
  );

  const maxItems = Math.max(right.length, left.length);

  for (let i = 0; i < maxItems; i++) {
    const leftItem = left.length > i ? left[i] : undefined;
    const rightItem = right.length > i ? right[i] : undefined;

    if (leftItem === undefined) {
      simpleLogger.debug(
        `${printPrefix}\tLeft side ran out of items, so inputs are in the right order`
      );
      return true;
    } else if (rightItem === undefined) {
      simpleLogger.debug(
        `${printPrefix}\tRight side ran out of items, so inputs are not in the right order`
      );
      return false;
    }

    simpleLogger.debug(
      `${printPrefix}\tComparing item ${JSON.stringify(
        leftItem
      )} vs ${JSON.stringify(rightItem)}`
    );

    // If neither are arrays, then they are both numbers
    if (!Array.isArray(leftItem) && !Array.isArray(rightItem)) {
      if (leftItem > rightItem) {
        simpleLogger.debug(
          `${printPrefix}\tRight side is smaller, so inputs are not in the right order`
        );
        return false;
      } else if (leftItem < rightItem) {
        simpleLogger.debug(
          `${printPrefix}\tLeft side is smaller, so inputs are in the right order`
        );
        return true;
      } else {
        // Keep comparing
        continue;
      }
    }

    // Turn them both into arrays
    let leftToCompare: Packet = Array.isArray(leftItem)
      ? (leftItem as Packet)
      : [leftItem];
    let rightToCompare: Packet = Array.isArray(rightItem)
      ? (rightItem as Packet)
      : [rightItem];

    if (!packetsInRightOrder(leftToCompare, rightToCompare, depth + 1)) {
      simpleLogger.debug(
        `${printPrefix}\tFound incorrect order between ITEMS IN a: ${JSON.stringify(
          left
        )}, b: ${JSON.stringify(right)}`
      );
      return false;
    }
  }

  simpleLogger.debug(
    `${printPrefix}Fell through to end, consider in correct order`
  );
  return true;
};

export const parseDistressSignalFile = async (
  filename: string
): Promise<PacketPair[]> =>
  new Promise((resolve, reject) => {
    const packetPairs: PacketPair[] = [];

    processFileInChunks(
      filename,
      3,
      (lines: string[]) => {
        try {
          const packet1 = parsePacket(lines[0]);
          const packet2 = parsePacket(lines[1]);

          packetPairs.push([packet1, packet2]);
        } catch (e) {
          reject(e);
        }
      },
      () => {
        resolve(packetPairs);
      }
    );
  });

export const whichPacketsInRightOrder = (
  packetPairs: PacketPair[]
): number[] => {
  return (
    packetPairs
      .map((pair, index) => ({ pair, index: index + 1 }))
      // .filter(({ index }) => index < 3)
      .filter(({ pair: [left, right] }) => {
        const result = packetsInRightOrder(left, right);
        // simpleLogger.info("Left: ", left);
        // simpleLogger.info("Right: ", right);
        return result;
      })
      .map(({ index }) => index)
  );
};

const day13: AdventFunction = async (filename = "./src/2022/day13/input.txt") => {
  const packetPairs = await parseDistressSignalFile(filename);

  const pairsInRightOrder = whichPacketsInRightOrder(packetPairs);

  const partOne = pairsInRightOrder.reduce((acc, curr) => acc + curr, 0);

  return [partOne, 1];
};

export default day13;
