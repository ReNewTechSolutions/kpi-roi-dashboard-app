"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import NumberField from "@/components/NumberField";
import { calcNetSavings, calcRoiPercent, ROIInputs } from "@/lib/calc";

export default function ROIPage() {
  const [inputs, setInputs] = useState<ROIInputs>({
    totalInvestment: 5000,
    valueDelivered: 15000,
    termMonths: 12,
    upfrontPayment: 0,
    outcomeBasedPayment: 0,
  });

  const roiPct = useMemo(
    () => calcRoiPercent(inputs.totalInvestment, inputs.valueDelivered),
    [inputs.totalInvestment, inputs.valueDelivered]
  );

  const netSavings = useMemo(
    () => calcNetSavings(inputs.totalInvestment, inputs.valueDelivered),
    [inputs.totalInvestment, inputs.valueDelivered]
  );

  return (
    <main style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>ROI Calculator</h2>

      <Card>
        <div style={{ display: "grid", gap: 12 }}>
          <NumberField label="Total Investment" prefix="$" value={inputs.totalInvestment} onChange={(n) => setInputs((p) => ({ ...p, totalInvestment: n }))} />
          <NumberField label="Value Delivered" prefix="$" value={inputs.valueDelivered} onChange={(n) => setInputs((p) => ({ ...p, valueDelivered: n }))} />
          <NumberField label="Term (Months)" value={inputs.termMonths} onChange={(n) => setInputs((p) => ({ ...p, termMonths: n }))} />
          <NumberField label="Upfront Payment" prefix="$" value={inputs.upfrontPayment} onChange={(n) => setInputs((p) => ({ ...p, upfrontPayment: n }))} />
          <NumberField label="Outcome-Based Payment" prefix="$" value={inputs.outcomeBasedPayment} onChange={(n) => setInputs((p) => ({ ...p, outcomeBasedPayment: n }))} />
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 800 }}>Results</div>
        <div style={{ marginTop: 6 }}>ROI %: {roiPct.toFixed(1)}%</div>
        <div>Net Savings: ${netSavings.toFixed(0)}</div>
      </Card>
    </main>
  );
}