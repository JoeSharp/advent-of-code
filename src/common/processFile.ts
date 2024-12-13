import * as fs from "fs";
import readline from "readline";

export const loadFirstLine = (filename: string): Promise<string> =>
  loadEntireFile(filename).then(([line]) => line);

export const loadEntireFile = (filename: string): Promise<string[]> =>
  new Promise<string[]>((resolve) => {
    let lines: string[] = [];

    var r = readline.createInterface({
      input: fs.createReadStream(filename),
    });
    r.on("line", (line: string) => {
      lines.push(line);
    }).on("close", () => {
      resolve(lines);
    });
  });

export async function loadFileAsDigitGrid(
  filename: string,
): Promise<number[][]> {
  return (await loadEntireFileAsGrid(filename)).map((row) =>
    [...row].map((c) => parseInt(c)),
  );
}

export async function loadEntireFileAsGrid(
  filename: string,
): Promise<string[][]> {
  const lines = await loadEntireFile(filename);
  return lines.map((l) => l.split(""));
}

export async function loadFileInChunks(
  filename: string,
  chunkSize: number,
): Promise<string[][]> {
  const chunks: string[][] = [];

  await processFileInChunks(
    filename,
    chunkSize,
    (chunk) => chunks.push(chunk),
    () => {},
  );

  return chunks;
}

export const processFileInChunks = (
  filename: string,
  chunkSize: number,
  onLines: (lines: string[]) => void,
  onClose: () => void,
) =>
  new Promise<void>((resolve) => {
    let lines: string[] = [];

    var r = readline.createInterface({
      input: fs.createReadStream(filename),
    });
    r.on("line", (line: string) => {
      lines.push(line);
      if (lines.length === chunkSize) {
        onLines(lines);
        lines = [];
      }
    }).on("close", () => {
      onClose();
      resolve();
    });
  });
