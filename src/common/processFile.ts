import * as fs from "fs";
import readline from "readline";

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

export const processFileInChunks = (
  filename: string,
  chunkSize: number,
  onLines: (lines: string[]) => void,
  onClose: () => void
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
