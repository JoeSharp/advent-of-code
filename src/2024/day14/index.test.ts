import day14, {
  loadRobotsFile,
  parseRobot,
  identifySegment,
  iterateRobot,
  processRobots,
  robotsToStr,
  robotToStr,
} from "./index";
import { Position } from "../../common/arrayUtils";

const TEST_INPUT_FILE = "./src/2024/day14/testInput.txt";
// 11 wide, 7 tall
const TEST_DIMENSION: Position = [11, 7];

describe("day14", () => {
  it("iterateRobot", () => {
    let robot: Robot = {
      position: [2, 4],
      velocity: [2, -3],
    };

    for (let i = 0; i < 5; i++) {
      console.log(robotToStr(robot, TEST_DIMENSION));
      robot = iterateRobot(robot, 1, TEST_DIMENSION);
    }
  });

  it("robotsToStr", async () => {
    const robots = await loadRobotsFile(TEST_INPUT_FILE);
    console.log(robotsToStr(robots, TEST_DIMENSION, 2));
  });

  it.each`
    position | segmentLength | expected
    ${1}     | ${4}          | ${0}
    ${3}     | ${4}          | ${0}
    ${4}     | ${4}          | ${NaN}
    ${5}     | ${4}          | ${1}
    ${6}     | ${4}          | ${1}
    ${8}     | ${4}          | ${2}
  `(
    "identifySegment for $pos when length $segmentLength => $expected",
    ({ position, segmentLength, expected }) => {
      const result = identifySegment(position, segmentLength);

      expect(result).toBe(expected);
    },
  );
  it("parseRobot", () => {
    const result = parseRobot("p=90,2 v=78,-73");

    expect(result).toStrictEqual({
      position: [90, 2],
      velocity: [78, -73],
    });
  });

  it("handles demo input for part 1 correctly", async () => {
    const robots = await loadRobotsFile(TEST_INPUT_FILE);
    const part1 = processRobots(robots, TEST_DIMENSION, 2, 100);

    expect(part1).toBe(12);
  });

  it.skip("handles demo input for part 2 correctly", async () => {
    const [, part2] = await day14(TEST_INPUT_FILE);

    expect(part2).toBe(1);
  });
});
