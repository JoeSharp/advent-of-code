import { reverseNumericSort } from "./numericUtils";

describe("numericUtils", () => {
  describe("reverseNumericSort", () => {
    it("sorts in reverse order", () => {
      const items = [8, 3, 90, 7, 54];
      items.sort(reverseNumericSort);

      expect(items).toStrictEqual([90, 54, 8, 7, 3]);
    });
  });
});
