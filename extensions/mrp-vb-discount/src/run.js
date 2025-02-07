// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.All,
  discounts: [],
};

/**
 * @param {RunInput} input
 */
export function run(input) {
  const discounts = [];
  const lines = input?.cart?.lines || [];
  lines.forEach((line) => {
    let discountApplicable = line?.discountApplicable?.value;
    let discountAmount = line?.discountAmount?.value;

    // Ensure discountAmount is a valid number
    let parsedDiscountAmount = Number(discountAmount) || 0;

    if (discountApplicable && parsedDiscountAmount > 0) {
      discounts.push({
        message: "Discount Applied",
        targets: [
          {
            cartLine: {
              id: line.id,
            },
          },
        ],
        value: {
          fixedAmount: {
            amount: parsedDiscountAmount,
          },
        },
      });
    }
  });

  return discounts.length > 0
    ? {
        discountApplicationStrategy: DiscountApplicationStrategy.All,
        discounts,
      }
    : EMPTY_DISCOUNT;
}
