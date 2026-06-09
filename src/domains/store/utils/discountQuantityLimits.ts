import type { CreateDiscountInput, UpdateDiscountInput } from "@/domains/admin";

/** Parse optional positive integer from form text/number inputs. */
export function parseOptionalPositiveInt(
  value: string | undefined
): number | undefined {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }
  return parsed;
}

/** Map admin form limit fields to GraphQL input keys. */
export function buildDiscountQuantityLimitInput(form: {
  maxUses: string;
  maxUsesPerUserPerMonth: string;
}): Pick<
  CreateDiscountInput & UpdateDiscountInput,
  "maxUses" | "maxUsesPerUserPerMonth"
> {
  return {
    maxUses: parseOptionalPositiveInt(form.maxUses),
    maxUsesPerUserPerMonth: parseOptionalPositiveInt(
      form.maxUsesPerUserPerMonth
    ),
  };
}
