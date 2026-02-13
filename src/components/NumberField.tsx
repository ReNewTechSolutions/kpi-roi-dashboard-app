"use client";

export default function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 13, opacity: 0.8 }}>{label}</span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderRadius: 12,
          padding: "10px 12px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        {prefix ? <span style={{ opacity: 0.7 }}>{prefix}</span> : null}

        <input
          inputMode="decimal"
          value={String(value)}
          onChange={(e) => onChange(Number(e.target.value.replace(/[^0-9.]/g, "")) || 0)}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: 16,
            background: "transparent",
          }}
        />

        {suffix ? <span style={{ opacity: 0.7 }}>{suffix}</span> : null}
      </div>
    </label>
  );
}