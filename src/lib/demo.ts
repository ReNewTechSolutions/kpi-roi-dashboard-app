import type { ROIInputs, KPIEntry } from "./calc";

export const DEMO_ROI: ROIInputs = {
  totalInvestment: 5000,
  valueDelivered: 15000,
  termMonths: 12,
  upfrontPayment: 0,
  outcomeBasedPayment: 0,
};

export const DEMO_KPIS: KPIEntry[] = [
  { month: "2025-09-01", revenue: 12000, cost: 7000 },
  { month: "2025-10-01", revenue: 14000, cost: 8200 },
  { month: "2025-11-01", revenue: 16000, cost: 9000 },
  { month: "2025-12-01", revenue: 19000, cost: 9800 },
  { month: "2026-01-01", revenue: 21000, cost: 10500 },
];