import * as fs from "fs";
import readline from "readline";

export const processFile = (
  filename: string,
  onLine: (line: string) => void,
  onClose: () => void
) => {
  return new Promise<void>((resolve) => {
    var r = readline.createInterface({
      input: fs.createReadStream(filename),
    });
    r.on("line", onLine).on("close", () => {
      onClose();
      resolve();
    });
  });
};

export const processFileInChunks = (
  filename: string,
  chunkSize: number,
  onLines: (lines: string[]) => void,
  onClose: () => void
) => {
  return new Promise<void>((resolve) => {
    let lines: string[] = [];

    processFile(
      filename,
      (line: string) => {
        lines.push(line);
        if (lines.length === chunkSize) {
          onLines(lines);
          lines = [];
        }
      },
      () => {
        onClose();
        resolve();
      }
    );
  });
};
