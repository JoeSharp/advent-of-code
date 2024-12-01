import { numericSort, isDivisibleBy, reverseNumericSort } from "./numericUtils";

describe("numericUtils", () => {
  describe("reverseNumericSort", () => {
    it("sorts in reverse order", () => {
      const items = [8, 3, 90, 7, 54];
      items.sort(reverseNumericSort);

      expect(items).toStrictEqual([90, 54, 8, 7, 3]);
    });
  });
  describe("NumericSort", () => {
    it("sorts in numeric order", () => {
      const items = [58, 23, 90, 7, 54];
      items.sort(numericSort);

      expect(items).toStrictEqual([7, 23, 54, 58, 90]);
    });
  });
  describe("isDivisibleBy", () => {
    it.each`
      input | divisor | expected
      ${8}  | ${2}    | ${true}
    `(
      "$input divisible by $divisor = $expected",
      ({ input, divisor, expected }) => {
        const result = isDivisibleBy(input, divisor);
        expect(result).toBe(expected);
      },
    );
  });
});
