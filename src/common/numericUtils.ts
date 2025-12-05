export const reverseNumericSort = (a: number, b: number): number => b - a;
export const numericSort = (a: number, b: number): number => a - b;
export const isDivisibleBy = (a: number, divisor: number): boolean =>
  a % divisor === 0;
export const isInteger = (a: number): boolean => Math.round(a) === a;
export const sum = (acc: number, curr: number) => acc + curr;
export function factors(a: number): number[] {
  const result: number[] = [];

  result.push(a);
  result.push(1);

  const max = Math.ceil(Math.sqrt(a));
  for (let i = 2; i <= max; i++) {
    if (isDivisibleBy(a, i)) {
      result.push(i);
      const otherFactor = a / i;
      if (otherFactor !== i) {
        result.push(a / i);
      }
    }
  }

  return result.sort(numericSort);
}

export function highestCommonFactor(a: number, b: number): number {
  const factorsA = factors(a);
  const factorsB = factors(b);

  return (
    factorsA
      .filter((fa) => factorsB.includes(fa))
      .sort(reverseNumericSort)
      .find(() => true) || 1
  );
}

export function lowestCommonMultiple(a: number, b: number): number {
  return (a * b) / highestCommonFactor(a, b);
}

export function lcmMultiples(a: number, b: number): number[] {
  const lcm = lowestCommonMultiple(a, b);
  return [lcm / a, lcm / b];
}
