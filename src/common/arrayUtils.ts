export function arraySectionToString(
  arr: any[],
  fromIndex: number,
  length: number,
  chunkSize: number,
): string {
  let asStr = `Array of Length ${arr.length} from: ${fromIndex}, length: ${length} with chunk size ${chunkSize}\n`;

  const fromChunk = Math.floor(fromIndex / chunkSize);
  const toChunk = Math.ceil((fromIndex + length) / chunkSize);

  for (let chunk = fromChunk; chunk < toChunk; chunk++) {
    const f = chunk * chunkSize;
    const t = (chunk + 1) * chunkSize - 1;

    let row = `Chunk ${chunk} [${f}...${t}] `;
    for (let i = 0; i < chunkSize; i++) {
      if (f + i >= arr.length) break;
      row += arr[f + i] + ",";
    }

    row += "\n";
    asStr += row;
  }

  return asStr;
}
