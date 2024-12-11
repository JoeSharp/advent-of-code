import { AdventFunction } from "../../common/types";
import { loadEntireFileAsGrid } from '../../common/processFile';


const day03: AdventFunction = async (filename = "./src/2023/day03/input.txt") => {
  const lines: string[][] = await loadEntireFileAsGrid(filename);

  return [1, 1];
};

export default day03;
