import * as fs from "fs";
import readline from "readline";

export const processFile = (
  filename: string,
  onLine: (line: string) => void,
  onClose: () => void
) => {
  var r = readline.createInterface({
    input: fs.createReadStream(filename),
  });
  r.on("line", onLine).on("close", onClose);
};
