// =========================================================
// File: src/components/SparklineChart.tsx
// - Auto redraw on resize (ResizeObserver + rAF + retry)
// - Hover tooltip (label + series values)
// - Robust ctx/0-size handling (common during first layout)
// - Fix TS ctx possibly-null by passing ctx into drawLine
// =========================================================
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type SparkSeries = { label: string; points: number[] };

type TooltipState =
  | null
  | {
      x: number;
      y: number;
      index: number;
    };

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function money(n: number) {
  const v = Number(n) || 0;
  return v.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function computeDomain(series: SparkSeries[]) {
  const values = series.flatMap((s) => s.points).filter(isFiniteNumber);
  if (!values.length) return { min: 0, max: 1, span: 1 };

  const min = Math.min(...values);
  const maxRaw = Math.max(...values);
  const max = maxRaw === min ? min + 1 : maxRaw;
  const span = Math.max(1e-9, max - min);
  return { min, max, span };
}

function ensureBackingStore(canvas: HTMLCanvasElement, cssW: number, cssH: number) {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(1, Math.floor(cssW * dpr));
  const h = Math.max(1, Math.floor(cssH * dpr));
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  return dpr;
}

function drawChart(canvas: HTMLCanvasElement, cssW: number, cssH: number, series: SparkSeries[]) {
  const ctx0 = canvas.getContext("2d");
  if (!ctx0) return false;

  const dpr = ensureBackingStore(canvas, cssW, cssH);

  const ctx = ctx0; // stable alias TS can track
  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);

  const pad = 10;
  const w = Math.max(1, cssW - pad * 2);
  const h = Math.max(1, cssH - pad * 2);

  const { min: minV, span } = computeDomain(series);

  // Clip so lines never draw outside chart area
  ctx.beginPath();
  ctx.rect(pad, pad, w, h);
  ctx.clip();

  // Grid
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#e9e9e9";
  for (let i = 0; i <= 4; i += 1) {
    const y = pad + (h * i) / 4;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(pad + w, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const colors = ["#111111", "#666666", "#999999"];

  function drawLine(ctx2: CanvasRenderingContext2D, points: number[], stroke: string) {
    // Keep the original indexing so tooltip/index math stays consistent.
    // If you prefer skipping invalids, you’d need a parallel index map.
    if (points.length < 2) return;

    ctx2.strokeStyle = stroke;
    ctx2.lineWidth = 2;
    ctx2.lineJoin = "round";
    ctx2.lineCap = "round";

    ctx2.beginPath();

    let started = false;
    const denom = Math.max(1, points.length - 1);

    for (let i = 0; i < points.length; i += 1) {
      const raw = points[i];
      const v = isFiniteNumber(raw) ? raw : 0;

      const x = pad + (w * i) / denom;
      const y = pad + h - ((v - minV) / span) * h;

      if (!started) {
        ctx2.moveTo(x, y);
        started = true;
      } else {
        ctx2.lineTo(x, y);
      }
    }

    ctx2.stroke();
  }

  series.forEach((s, idx) => drawLine(ctx, s.points, colors[idx % colors.length]));

  ctx.restore();
  return true;
}

function xIndexFromClientX(canvas: HTMLCanvasElement, pointCount: number, clientX: number) {
  if (pointCount <= 1) return 0;

  const rect = canvas.getBoundingClientRect();
  const cssW = rect.width;
  if (cssW <= 0) return 0;

  const pad = 10;
  const w = Math.max(1, cssW - pad * 2);
  const x = clamp(clientX - rect.left, pad, pad + w);
  const t = (x - pad) / w;
  return clamp(Math.round(t * (pointCount - 1)), 0, pointCount - 1);
}

export default function SparklineChart({
  title,
  height = 160,
  xLabels,
  series,
  formatValue = money,
}: {
  title?: string;
  height?: number;
  xLabels: string[];
  series: SparkSeries[];
  formatValue?: (n: number) => string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const roRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number | null>(null);
  const retryRef = useRef<number>(0);

  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const pointCount = useMemo(() => {
    const maxPts = Math.max(0, ...series.map((s) => s.points.length));
    return Math.max(maxPts, xLabels.length);
  }, [series, xLabels]);

  const tooltipText = useMemo(() => {
    if (!tooltip) return null;
    const label = xLabels[tooltip.index] ?? `#${tooltip.index + 1}`;
    const lines = series.map((s) => {
      const v = s.points[tooltip.index];
      return `${s.label}: ${isFiniteNumber(v) ? formatValue(v) : "—"}`;
    });
    return { label, lines };
  }, [tooltip, xLabels, series, formatValue]);

  const scheduleDraw = useMemo(() => {
    const fn = () => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const rect = wrap.getBoundingClientRect();
        const cssW = Math.floor(rect.width);
        const cssH = Math.floor(rect.height);

        // First layout often measures 0x0 briefly; retry a few frames.
        if (cssW <= 0 || cssH <= 0) {
          retryRef.current += 1;
          if (retryRef.current <= 20) fn();
          return;
        }

        retryRef.current = 0;

        const ok = drawChart(canvas, cssW, cssH, series);
        if (!ok) {
          retryRef.current += 1;
          if (retryRef.current <= 20) fn();
        }
      });
    };

    return fn;
  }, [series]);

  useEffect(() => {
    scheduleDraw();

    const wrap = wrapRef.current;
    if (!wrap) return;

    if (!roRef.current) {
      roRef.current = new ResizeObserver(() => scheduleDraw());
      roRef.current.observe(wrap);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleDraw]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      roRef.current?.disconnect();
      roRef.current = null;
    };
  }, []);

  function onMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || pointCount <= 0) return;

    const idx = xIndexFromClientX(canvas, pointCount, e.clientX);
    const rect = wrap.getBoundingClientRect();
    setTooltip({
      index: idx,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  function onLeave() {
    setTooltip(null);
  }

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height }}>
      {title ? <div style={{ fontWeight: 900, marginBottom: 8 }}>{title}</div> : null}

      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        role="img"
        aria-label={title ?? "Sparkline chart"}
      />

      {tooltip && tooltipText ? (
        <div
          style={{
            position: "absolute",
            left: clamp(tooltip.x + 12, 8, 99999),
            top: clamp(tooltip.y + 12, 8, 99999),
            pointerEvents: "none",
            border: "1px solid #ddd",
            borderRadius: 14,
            background: "white",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
            padding: "10px 10px",
            width: 240,
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.75 }}>{tooltipText.label}</div>
          <div style={{ marginTop: 6, display: "grid", gap: 4, fontSize: 13 }}>
            {tooltipText.lines.map((t) => (
              <div key={t} style={{ fontWeight: 800 }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}