import day7, {
  CommandType,
  createDirectoryStructureFromFile,
  createRootDirectory,
  determineLineType,
  DirectoryStructure,
  findDirectories,
  GO_BACK_DIRECTORY,
  isCommand,
  LineType,
  parseCommand,
  parseDirectory,
  parseFileListing,
  processLine,
  ROOT_DIRECTORY,
} from "./index";

describe("day7", () => {
  describe("Day 7", () => {
    it("handles demo input for part 1 correctly", async () => {
      const [part1] = await day7("./src/day7/testInput.txt");

      expect(part1).toBe(95437);
    });

    it("handles demo input for part 2 correctly", async () => {
      const [, part2] = await day7("./src/day7/testInput.txt");

      expect(part2).toBe(24933642);
    });
  });

  describe("parseCommand", () => {
    it.each`
      input         | expected
      ${"$ cd /"}   | ${{ type: CommandType.changeDirectory, argument: ROOT_DIRECTORY }}
      ${"$ cd .."}  | ${{ type: CommandType.changeDirectory, argument: GO_BACK_DIRECTORY }}
      ${"$ cd foo"} | ${{ type: CommandType.changeDirectory, argument: "foo" }}
      ${"$ ls"}     | ${{ type: CommandType.listDirectory }}
    `("$input", ({ input, expected }) => {
      const result = parseCommand(input);
      expect(result).toStrictEqual(expected);
    });

    it("throws error if given rubbish", () => {
      expect(() => parseCommand("foo bar car")).toThrowError();
    });
  });

  describe("parseDirectory", () => {
    it.each`
      input        | expected
      ${"dir foo"} | ${"foo"}
      ${"dir bar"} | ${"bar"}
    `("$input -> $expected", ({ input, expected }) => {
      const result = parseDirectory(input);
      expect(result).toStrictEqual(expected);
    });

    it("should throw error for nonsense input", () => {
      expect(() => parseDirectory("foobarcar")).toThrowError();
    });
  });

  describe("parseFileListing", () => {
    it.each`
      input            | expected
      ${"234 foo.txt"} | ${{ size: 234, name: "foo.txt" }}
      ${"983 bar.dat"} | ${{ size: 983, name: "bar.dat" }}
    `("$input -> $expected", ({ input, expected }) => {
      const result = parseFileListing(input);
      expect(result).toStrictEqual(expected);
    });

    it("should throw error for nonsense input", () => {
      expect(() => parseFileListing("foobarcar")).toThrowError();
    });

    it("should throw error for nonsense", () => {
      expect(() => parseFileListing("bb")).toThrowError();
    });
    it("should throw error for invalid file size", () => {
      expect(() => parseFileListing("ghgj bee.txt")).toThrowError();
    });
  });

  describe("determineLineType", () => {
    it.each`
      input          | expected
      ${"$ cd /"}    | ${LineType.command}
      ${"$ cd .."}   | ${LineType.command}
      ${"dir foo"}   | ${LineType.directoryListing}
      ${"678 a.txt"} | ${LineType.fileListing}
    `("$input -> $expected", ({ input, expected }) => {
      const result = determineLineType(input);
      expect(result).toBe(expected);
    });
  });

  describe("isCommand", () => {
    it.each`
      input              | expected
      ${"$ cd /"}        | ${true}
      ${"$ cd someName"} | ${true}
      ${"$ ls"}          | ${true}
      ${"29116 f"}       | ${false}
      ${"dir e"}         | ${false}
    `("$input -> $expected", ({ input, expected }) => {
      const result = isCommand(input);
      expect(result).toBe(expected);
    });
  });

  describe("processLine", () => {
    it("adds a file correctly", () => {
      const directoryStructure = createRootDirectory();

      const result = processLine(directoryStructure, "584 foo.txt");

      expect(result.files).toStrictEqual([{ name: "foo.txt", size: 584 }]);
    });

    it("adds a directory correctly", () => {
      const directoryStructure = createRootDirectory();

      const result = processLine(directoryStructure, "dir bar");

      expect(result.subDirectories).toStrictEqual([
        {
          name: "bar",
          size: 0,
          files: [],
          subDirectories: [],
          parent: directoryStructure,
        },
      ]);
    });

    it("navigates into a directory", () => {
      const result = [
        "$ cd /",
        "$ ls",
        "456 foo.dat",
        "123 bar.txt",
        "dir alpha",
        "dir beta",
        "$ cd alpha",
      ].reduce((acc, curr) => processLine(acc, curr), createRootDirectory());

      expect(result.name).toBe("alpha");
      const parent = result.parent;

      expect(parent).not.toBeNull();
      expect(parent?.files).toContainEqual({
        name: "foo.dat",
        size: 456,
      });
      expect(parent?.files).toContainEqual({
        name: "bar.txt",
        size: 123,
      });

      const dirNames = parent?.subDirectories.map(({ name }) => name);
      expect(dirNames).toContain("alpha");
      expect(dirNames).toContain("beta");
    });
  });

  describe("populateDirectorySizes", () => {
    it("calculates directory structure correctly", async () => {
      const rootDir = await createDirectoryStructureFromFile(
        "./src/day7/testInput.txt"
      );

      expect(rootDir.size).toBe(48381165);

      [
        { name: "e", expectedSize: 584 },
        { name: "a", expectedSize: 94853 },
        { name: "d", expectedSize: 24933642 },
      ].forEach(({ name, expectedSize }) => {
        const dir = findDirectories(rootDir, (d) => d.name === name).next();
        expect(dir.value).toBeDefined();
        expect((dir.value as DirectoryStructure).size).toBe(expectedSize);
      });
    });
  });
});
