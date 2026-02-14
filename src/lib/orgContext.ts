// src/lib/orgContext.ts
export const ORG_COOKIE = "current_org_id";

export function sanitizeOrgId(v: string | null | undefined): string | null {
  if (!v) return null;
  // UUID v4-ish validation (good enough for routing/cookie safety)
  const ok = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
  return ok ? v : null;
}