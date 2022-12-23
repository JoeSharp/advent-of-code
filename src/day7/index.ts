import * as fs from "fs";
import readline from "readline";
import simpleLogger from "../common/simpleLogger";
import { AdventFunction } from "../common/types";

export interface FileListing {
  name: string;
  size: number;
}

export enum CommandType {
  changeDirectory = "cd",
  listDirectory = "ls",
}

export const GO_BACK_DIRECTORY = "..";
export const ROOT_DIRECTORY = "/";

export enum LineType {
  command,
  fileListing,
  directoryListing,
}

export interface Command {
  type: CommandType;
  argument?: string;
}

export const parseCommand = (command: string): Command => {
  const parts = command.split(" ");
  if (parts.length === 2 && parts[1] === CommandType.listDirectory) {
    return { type: CommandType.listDirectory };
  } else if (parts.length === 3 && parts[1] === CommandType.changeDirectory) {
    return { type: CommandType.changeDirectory, argument: parts[2] };
  } else {
    throw new Error("Invalid command");
  }
};

export const parseDirectory = (input: string): string => {
  const parts = input.split(" ");

  if (parts[0] !== "dir") throw new Error("Invalid directory listing");

  return parts[1];
};

export const parseFileListing = (input: string): FileListing => {
  const parts = input.split(" ");

  if (parts.length !== 2) throw new Error("invalid file listing - whole line");

  const size = parseInt(parts[0], 10);

  if (isNaN(size)) throw new Error("Invalid file listing - file size");

  return {
    name: parts[1],
    size,
  };
};

export const determineLineType = (input: string): LineType => {
  if (input.startsWith("$")) {
    return LineType.command;
  } else if (input.startsWith("dir")) {
    return LineType.directoryListing;
  } else {
    return LineType.fileListing;
  }
};

export const isCommand = (line: string): boolean => line.startsWith("$");

export interface DirectoryStructure {
  name: string;
  size: number; // Total size of all contained stuff
  files: FileListing[]; // All the files in this immediate directory
  subDirectories: DirectoryStructure[]; // Any sub directories
  parent: DirectoryStructure | null;
}

export const createDirectory = (
  name: string,
  parent: DirectoryStructure | null
): DirectoryStructure => ({
  name,
  size: 0,
  files: [],
  subDirectories: [],
  parent,
});

export const createRootDirectory = () => createDirectory(ROOT_DIRECTORY, null);

export const goBackToRootDir = (
  currentDirectory: DirectoryStructure
): DirectoryStructure => {
  // Traverse back up until we hit a directory with a null parent
  let root = currentDirectory;
  while (root.parent !== null) {
    root = root.parent;
  }
  return root;
};

export const goBackToParent = (
  currentDirectory: DirectoryStructure
): DirectoryStructure => {
  if (currentDirectory.parent === null)
    throw new Error("Cannot go back from root dir");
  return currentDirectory.parent;
};

export const goToNamedDirectory = (
  currentDirectory: DirectoryStructure,
  directoryName?: string
): DirectoryStructure => {
  if (directoryName === undefined)
    throw new Error("Cannot go to directory without a name");

  // A specific named directory
  let selectedDir = currentDirectory.subDirectories.find(
    ({ name }) => name === directoryName
  );
  if (selectedDir === undefined)
    throw new Error(`Could not find directory ${directoryName}`);
  return selectedDir;
};

/**
 * Given a command and the current directory
 * Processes the command and returns the 'current directory' after the command
 * is processed.
 *
 * @param currentDirectory the current directory
 * @param command The command to process
 * @returns The new current directory
 */
const processCommand = (
  currentDirectory: DirectoryStructure,
  command: Command
): DirectoryStructure => {
  // In itself, list directory does nothing
  if (command.type === CommandType.listDirectory) return currentDirectory;

  // Change directory
  switch (command.argument) {
    case ROOT_DIRECTORY:
      return goBackToRootDir(currentDirectory);
    case GO_BACK_DIRECTORY:
      return goBackToParent(currentDirectory);
    default:
      return goToNamedDirectory(currentDirectory, command.argument);
  }
};

/**
 * This function is used to develop the directory structure.
 * It will mutate the given structure, but return the current directory
 * after the command has been executed.
 *
 * @param currentDirectory The directory we are currently in
 * @param line The line to process
 * @returns The new current directory
 */
export const processLine = (
  currentDirectory: DirectoryStructure,
  line: string
): DirectoryStructure => {
  const lineType = determineLineType(line);

  switch (lineType) {
    case LineType.command:
      const command = parseCommand(line);
      return processCommand(currentDirectory, command);
      break;
    case LineType.directoryListing:
      const dirName = parseDirectory(line);
      currentDirectory.subDirectories.push(
        createDirectory(dirName, currentDirectory)
      );
      break;
    case LineType.fileListing:
      const file = parseFileListing(line);
      currentDirectory.files.push(file);
  }

  return currentDirectory;
};

export const populateDirectorySizes = (
  directoryStructure: DirectoryStructure
): void => {
  directoryStructure.subDirectories.forEach((sd) => populateDirectorySizes(sd));

  directoryStructure.size = [
    ...directoryStructure.files,
    ...directoryStructure.subDirectories,
  ].reduce((acc, curr) => acc + curr.size, 0);
};

export type DirectoryFilter = (d: DirectoryStructure) => boolean;
export type DirectoryCallback = (d: DirectoryStructure) => void;

export function* findDirectories(
  dir: DirectoryStructure,
  filter: DirectoryFilter
): Generator<DirectoryStructure> {
  simpleLogger.debug(
    `Checking Dir ${dir.name} SubDirs: ${dir.subDirectories
      .map(({ name }) => name)
      .join(",")}, Files: ${dir.files.map(({ name }) => name).join(",")}`
  );

  if (filter(dir)) yield dir;

  for (let sd of dir.subDirectories) {
    yield* findDirectories(sd, filter);
  }
}

export const createDirectoryStructureFromFile = async (
  filename: string
): Promise<DirectoryStructure> =>
  new Promise((resolve) => {
    let currentDirectory = createRootDirectory();

    var r = readline.createInterface({
      input: fs.createReadStream(filename),
    });
    r.on("line", (line) => {
      currentDirectory = processLine(currentDirectory, line);
    }).on("close", () => {
      // Go back to root
      const rootDir = goBackToRootDir(currentDirectory);

      populateDirectorySizes(rootDir);
      resolve(rootDir);
    });
  });

const dayX: AdventFunction = async (filename = "./src/day7/input.txt") => {
  const rootDir = await createDirectoryStructureFromFile(filename);

  const MAX_SIZE = 100000;

  const dirs = findDirectories(rootDir, ({ size }) => size <= MAX_SIZE);

  const partOne = [...dirs].reduce((acc, curr) => acc + curr.size, 0);

  const TOTAL_DISK_SPACE = 70000000;
  const UNUSED_REQUIRED = 30000000;

  const amountToDelete = UNUSED_REQUIRED - (TOTAL_DISK_SPACE - rootDir.size);
  const dirsToDelete = findDirectories(
    rootDir,
    ({ size }) => size >= amountToDelete
  );
  const sorted = [...dirsToDelete].sort((a, b) => a.size - b.size);
  simpleLogger.debug(
    "Sorted Dirs to Delete",
    sorted.map(({ name, size }) => `${name} - ${size}`)
  );

  return [partOne, sorted[0].size];
};

export default dayX;
