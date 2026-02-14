/* =========================================================
   File: src/lib/storage.ts
   Browser-only helpers for demo mode + org selection
   ========================================================= */
   export const STORAGE_KEYS = {
    orgId: "metricroi.currentOrgId",
    demoMode: "metricroi.demoMode",
  } as const;
  
  function safeGet(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  
  function safeSet(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }
  
  function safeRemove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
  
  export function getCachedOrgId(): string | null {
    const v = safeGet(STORAGE_KEYS.orgId);
    return v && v.trim() ? v : null;
  }
  
  export function setCachedOrgId(orgId: string): void {
    safeSet(STORAGE_KEYS.orgId, orgId);
  }
  
  export function clearCachedOrgId(): void {
    safeRemove(STORAGE_KEYS.orgId);
  }
  
  export function getDemoMode(): boolean {
    const v = safeGet(STORAGE_KEYS.demoMode);
    if (!v) return false;
    return v === "1" || v.toLowerCase() === "true";
  }
  
  export function setDemoMode(enabled: boolean): void {
    safeSet(STORAGE_KEYS.demoMode, enabled ? "1" : "0");
  }