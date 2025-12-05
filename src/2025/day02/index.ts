import { sum } from '../../common/numericUtils';
import { loadFirstLine } from '../../common/processFile'
import { AdventFunction } from '../../common/types'

export interface IdRange {
  from: number
  to: number
}

export function parseIdRange(input: string): IdRange {
  const parts = input.split('-');
  if (parts.length !== 2) {
    throw new Error('Invalid number of parts in ' + input);
  }
  const result = {
    from: parseInt(parts[0], 10),
    to: parseInt(parts[1], 10)
  }
  if (isNaN(result.from)) {
    throw new Error('Invalid range from in ' + input);
  }
  if (isNaN(result.to)) {
    throw new Error('Invalid range to in ' + input);
  }
  return result;
}

export function expandIdRange(range: IdRange): number[] {
  const result: number[] = [];
  for (let i = range.from; i <= range.to; i++) {
    result.push(i);
  }
  return result;
}

export function isInvalidIdPartOne(id: number): boolean {
  const digits = Math.ceil(Math.log10(id));
  if (digits % 2 === 1) return false;

  const divisor = Math.pow(10, digits / 2);
  return (id % divisor === Math.floor(id / divisor));
}

export function isInvalidIdPartTwo(id: number): boolean {
  const digits = Math.ceil(Math.log10(id));

  for (let x=1; x<digits; x++) {
    if (digits % x > 0) continue;

    const divisor = Math.pow(10, x);
    
    let baseValue = id % divisor;
    let value = Math.floor(id / divisor);
    let foundMismatch = false;
    while (value > 0 && !foundMismatch) {
      if ((value % divisor) !== baseValue) {
        foundMismatch = true;
      }
      value = Math.floor(value / divisor);
    }
    if (!foundMismatch) {
      return true;
    }
  }

  return false;
}

const dayX: AdventFunction = async (
  filename = './src/2025/day02/input.txt'
) => {
  const ids = (await loadFirstLine(filename))
    .split(',')
    .map(parseIdRange)
    .flatMap(expandIdRange)
  const part1 = ids
    .filter(isInvalidIdPartOne)
    .reduce(sum, 0);
  const part2 = ids
    .filter(isInvalidIdPartTwo)
    .reduce(sum, 0);

  return [part1, part2]
}

export default dayX
