"use client";

import React, { useMemo, useState } from "react";
import Card from "@/components/Card";
import NumberField from "@/components/NumberField";
import { calcNetSavings, calcRoiPercent, type ROIInputs } from "@/lib/calc";

function money(n: number) {
  const v = Number(n) || 0;
  return v.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function ROIPage() {
  const [inputs, setInputs] = useState<ROIInputs>({
    totalInvestment: 5000,
    valueDelivered: 15000,
    termMonths: 12,
    upfrontPayment: 0,
    outcomeBasedPayment: 0,
  });

  const roiPct = useMemo(() => calcRoiPercent(inputs), [inputs]);
  const netSavings = useMemo(() => calcNetSavings(inputs), [inputs]);

  return (
    <main style={{ display: "grid", gap: 12, maxWidth: 900 }}>
      <h2 style={{ margin: 0 }}>ROI Calculator</h2>

      <Card title="Inputs">
        <div style={{ display: "grid", gap: 12 }}>
          <NumberField
            label="Total Investment"
            prefix="$"
            value={inputs.totalInvestment ?? 0}
            onChange={(n) => setInputs((p) => ({ ...p, totalInvestment: n }))}
          />
          <NumberField
            label="Value Delivered"
            prefix="$"
            value={inputs.valueDelivered ?? 0}
            onChange={(n) => setInputs((p) => ({ ...p, valueDelivered: n }))}
          />
          <NumberField
            label="Term (Months)"
            value={inputs.termMonths ?? 0}
            onChange={(n) => setInputs((p) => ({ ...p, termMonths: n }))}
          />
          <NumberField
            label="Upfront Payment"
            prefix="$"
            value={inputs.upfrontPayment ?? 0}
            onChange={(n) => setInputs((p) => ({ ...p, upfrontPayment: n }))}
          />
          <NumberField
            label="Outcome-Based Payment"
            prefix="$"
            value={inputs.outcomeBasedPayment ?? 0}
            onChange={(n) => setInputs((p) => ({ ...p, outcomeBasedPayment: n }))}
          />
        </div>
      </Card>

      <Card title="Results">
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ fontSize: 13, opacity: 0.75 }}>ROI</div>
            <div style={{ fontWeight: 900 }}>{roiPct.toFixed(1)}%</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ fontSize: 13, opacity: 0.75 }}>Net Savings</div>
            <div style={{ fontWeight: 900 }}>{money(netSavings)}</div>
          </div>
        </div>
      </Card>
    </main>
  );
}