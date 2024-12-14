import {
  numericSort,
  isDivisibleBy,
  reverseNumericSort,
  factors,
  isInteger,
  highestCommonFactor,
  lowestCommonMultiple,
  lcmMultiples
} from "./numericUtils";

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
  describe("Factors", () => {
    it.each`
      input | expected
      ${7}  | ${[1, 7]}
      ${8}  | ${[1, 2, 4, 8]}
      ${15} | ${[1, 3, 5, 15]}
      ${16} | ${[1, 2, 4, 8, 16]}
    `("factors of $input = $expected", ({ input, expected }) => {
      const result = factors(input);

      expect(result).toStrictEqual(expected);
    });

    it.each`
      a     | b     | expected
      ${24} | ${36} | ${12}
      ${12} | ${16} | ${4}
      ${12} | ${66} | ${6}
      ${6}  | ${15} | ${3}
      ${15} | ${50} | ${5}
      ${39} | ${52} | ${13}
      ${18} | ${27}  | ${9}
      ${40} | ${60}  | ${20}
      ${48} | ${64}  | ${16}
      ${35} | ${50}  | ${5}
      ${21} | ${28}  | ${7}
      ${56} | ${98}  | ${14}
      ${81} | ${108} | ${27}
    `(
      "Highest Common Factor of $a and $b is $expected",
      ({ a, b, expected }) => {
        const result = highestCommonFactor(a, b);

        expect(result).toBe(expected);
      },
    );

    it.each`
      a     | b     | expected
      ${24} | ${36} | ${[3, 2]}
      ${12} | ${16} | ${[4, 3]}
      ${12} | ${66} | ${[11, 2]}
      ${6}  | ${15} | ${[5, 2]}
      ${15} | ${50} | ${[10, 3]}
      ${39} | ${52} | ${[4,3]}
    `("LCM multiples of $a and $b are $expected", ({ a, b, expected }) => {
      const result = lcmMultiples(a, b);

      expect(result).toStrictEqual(expected);
    });

    it.each`
      a     | b      | expected
      ${4}  | ${5}   | ${20}
      ${4}  | ${6}   | ${12}
      ${6}  | ${8}   | ${24}
      ${7}  | ${9}   | ${63}
      ${10}  | ${15}   | ${30}
      ${12}  | ${18}   | ${36}
      ${14}  | ${20}   | ${140}
      ${16}  | ${24}   | ${48}
      ${21}  | ${28}   | ${84}
    `(
      "Lowest Common Multiple of $a and $b is $expected",
      ({ a, b, expected }) => {
        const result = lowestCommonMultiple(a, b);

        expect(result).toBe(expected);
      },
    );
  });

  describe("isInteger", () => {
    it.each`
      input                 | expected
      ${4}                  | ${true}
      ${4.5}                | ${false}
      ${28.000000000000004} | ${false}
    `(
      "correctly identifies $input integer: $expected",
      ({ input, expected }) => {
        const result = isInteger(input);
        expect(result).toBe(expected);
      },
    );
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
