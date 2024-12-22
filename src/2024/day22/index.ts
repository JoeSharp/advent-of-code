import { AdventFunction } from "../../common/types";
import { loadEntireFile } from "../../common/processFile";

export function mix(input: number, secret: number): number {
  return input ^ secret;
}

export function prune(input: number): number {
  return input % 16777216;
}

const cache: Map<number, number> = new Map();

export function calculateNextSecretNumber(secret: number): number {
  if (cache.has(secret)) return cache.get(secret)!;

  const first = prune(mix(secret * 64, secret));
  const second = prune(mix(Math.floor(first / 32), first));
  const third = prune(mix(second * 2048, second) >>> 0);
  cache.set(secret, third);
  return third;
}

export function iterateSecretNumber(
  secret: number,
  iterations: number,
): number {
  let result = secret;

  for (let i = 0; i < iterations; i++) {
    result = calculateNextSecretNumber(result);
  }

  return result;
}

const day22: AdventFunction = async (
  filename = "./src/2024/day22/input.txt",
) => {
  const part1 = (await loadEntireFile(filename))
    .map((d) => parseInt(d))
    .map((d) => iterateSecretNumber(d, 2000))
    .reduce((acc, curr) => acc + curr, 0);

  return [part1, 1];
};

export default day22;
