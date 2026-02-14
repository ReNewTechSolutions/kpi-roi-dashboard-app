// =========================================================
// File: src/lib/branding.ts
// =========================================================
export const APP_NAME: string = process.env.NEXT_PUBLIC_APP_NAME?.trim() || "MetricROI";

export const DEMO_MODE: boolean = (process.env.NEXT_PUBLIC_DEMO_MODE ?? "")
  .toLowerCase()
  .trim() === "true";

export function appTitle(page?: string): string {
  const base = APP_NAME;
  if (!page?.trim()) return base;
  return `${page.trim()} · ${base}`;
}