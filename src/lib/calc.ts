// =========================================================
// File: src/lib/calc.ts
// Patch: calcRoiPercent supports both (inputs) and (investment, value)
// =========================================================

export type ROIInputs = {
  totalInvestment: number;
  valueDelivered: number;
  termMonths?: number;
  upfrontPayment?: number;
  outcomeBasedPayment?: number;
};

function n(v: unknown) {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

// Overloads for TS
export function calcRoiPercent(inputs: Pick<ROIInputs, "totalInvestment" | "valueDelivered">): number;
export function calcRoiPercent(totalInvestment: number, valueDelivered: number): number;

// Implementation
export function calcRoiPercent(
  a: number | Pick<ROIInputs, "totalInvestment" | "valueDelivered">,
  b?: number,
): number {
  const totalInvestment = typeof a === "number" ? n(a) : n(a.totalInvestment);
  const valueDelivered = typeof a === "number" ? n(b) : n(a.valueDelivered);

  if (totalInvestment <= 0) return 0;
  return ((valueDelivered - totalInvestment) / totalInvestment) * 100;
}

// (If you already have calcNetSavings, keep it. If not and ROI page expects it:)
export function calcNetSavings(
  inputs: Pick<ROIInputs, "totalInvestment" | "valueDelivered">,
): number {
  return n(inputs.valueDelivered) - n(inputs.totalInvestment);
}