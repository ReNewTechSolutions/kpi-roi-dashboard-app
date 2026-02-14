// =========================================================
// File: src/components/NumberField.tsx
// =========================================================
"use client";

import React from "react";

export type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  prefix?: string;
  suffix?: string;
};

function clamp(n: number, min?: number, max?: number) {
  if (typeof min === "number" && n < min) return min;
  if (typeof max === "number" && n > max) return max;
  return n;
}

export default function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  hint,
  disabled,
  prefix,
  suffix,
}: NumberFieldProps) {
  return (
    <label style={styles.wrap}>
      <div style={styles.labelRow}>
        <span style={styles.label}>{label}</span>
        {hint ? <span style={styles.hint}>{hint}</span> : null}
      </div>

      <div style={{ ...styles.inputWrap, ...(disabled ? styles.disabled : null) }}>
        {prefix ? <span style={styles.affix}>{prefix}</span> : null}
        <input
          inputMode="decimal"
          type="number"
          value={Number.isFinite(value) ? String(value) : ""}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            const raw = e.target.value;
            const parsed = raw === "" ? 0 : Number(raw);
            onChange(clamp(Number.isFinite(parsed) ? parsed : 0, min, max));
          }}
          style={styles.input}
        />
        {suffix ? <span style={styles.affix}>{suffix}</span> : null}
      </div>
    </label>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { display: "grid", gap: 6 },
  labelRow: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" },
  label: { fontSize: 13, fontWeight: 800, opacity: 0.9 },
  hint: { fontSize: 12, opacity: 0.65 },

  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 12px",
    borderRadius: 12,
    border: "1px solid #ddd",
    width: "100%",
    height: 44,
  },
  input: {
    border: "none",
    outline: "none",
    width: "100%",
    height: "100%",
    padding: 0,
    background: "transparent",
    fontSize: 14,
  },
  affix: { fontSize: 13, opacity: 0.75, fontWeight: 800, userSelect: "none" },
  disabled: { opacity: 0.65 },
};