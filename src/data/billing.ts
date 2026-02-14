// =========================================================
// File: src/lib/billing.ts
// Stripe-free stub:
// - Keeps app compiling with "billing" references removed/optional.
// =========================================================
export type Plan = "free";

export type BillingSummary = {
  plan: Plan;
  isOwner: boolean;
};

export function billingEnabled(): boolean {
  return false;
}

export function getDefaultBillingSummary(): BillingSummary {
  return { plan: "free", isOwner: false };
}