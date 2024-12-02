export const splitStringIntoChunks = (input: string, chunkSize: number) =>
  Array.from({ length: Math.ceil(input.length / chunkSize) }, (_, i) =>
    input.slice(i * chunkSize, (i + 1) * chunkSize),
  );

export function parseListOfNumbers(input: string): number[] {
  return input
    .split(" ")
    .map((d) => parseInt(d))
    .filter((d) => !isNaN(d));
}
