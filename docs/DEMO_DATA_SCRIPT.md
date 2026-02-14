<!-- ======================================================
File: docs/DEMO_DATA_SCRIPT.md
====================================================== -->

# Demo Data Script — KPI + ROI Dashboard (Screenshots + Walkthrough)

Use this exact dataset to keep screenshots consistent, clean, and “SaaS-polished”.

---

## 1) Demo Organization
**Org Name:** `Acme Field Services`  
**Alt org name (for switch org screenshot):** `Northwind Ops`

Suggested member display:
- Signed-in as: `owner@acme.test`

---

## 2) KPI Dataset (Monthly)
Use 6 months (enough to show trends, not clutter).

> Store month as first day of the month (matches your schema).

| Month       | Revenue | Cost  | Notes |
|------------|---------:|------:|------|
| 2025-09-01 | 12000    | 5200  | New client onboarding |
| 2025-10-01 | 14500    | 6100  | Process improvements |
| 2025-11-01 | 16250    | 6800  | Upsell rollout |
| 2025-12-01 | 18900    | 7300  | Year-end campaigns |
| 2026-01-01 | 21000    | 8200  | Renewal cycle |
| 2026-02-01 | 23500    | 9100  | Expansion accounts |

### Screenshot cues
- KPI page should show at least:
  - Month
  - Revenue
  - Cost
  - Notes
- Optional summary cards:
  - Total Revenue (last 6 months)
  - Total Cost (last 6 months)
  - Profit (Revenue - Cost)

---

## 3) ROI Dataset (Default Model Inputs)
Use values that show strong ROI but still realistic.

**ROI Scenario Name:** `Standard Service Contract`

```json
{
  "totalInvestment": 5000,
  "valueDelivered": 15000,
  "termMonths": 12,
  "upfrontPayment": 0,
  "outcomeBasedPayment": 0
}