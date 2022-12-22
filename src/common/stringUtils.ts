export const splitStringIntoChunks = (input: string, chunkSize: number) =>
  Array.from({ length: Math.ceil(input.length / chunkSize) }, (_, i) =>
    input.slice(i * chunkSize, (i + 1) * chunkSize)
  );
