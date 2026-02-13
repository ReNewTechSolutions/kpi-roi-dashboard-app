const KEYS = {
    DEMO_MODE: "kpi_roi_demo_mode",
    ORG_ID: "kpi_roi_org_id",
  };
  
  export function getDemoMode(): boolean {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(KEYS.DEMO_MODE) === "true";
  }
  
  export function setDemoMode(v: boolean) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEYS.DEMO_MODE, v ? "true" : "false");
  }
  
  export function getCachedOrgId(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(KEYS.ORG_ID);
  }
  
  export function setCachedOrgId(orgId: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEYS.ORG_ID, orgId);
  }
  
  export function clearCachedOrgId() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(KEYS.ORG_ID);
  }