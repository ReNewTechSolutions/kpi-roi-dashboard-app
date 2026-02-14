/* =========================================================
   File: src/app/(protected)/actions.ts
   Rewrite:
   - Keep server actions tiny + deterministic
   - Use serverCookies helpers (cookies() is async in your setup)
   - Centralize cookie options
   ========================================================= */
   "use server";

   import { ORG_COOKIE, sanitizeOrgId } from "@/lib/orgContext";
   import { deleteCookie, setCookie } from "@/lib/serverCookies";
   
   const ONE_YEAR = 60 * 60 * 24 * 365;
   
   const cookieOpts = {
     httpOnly: true,
     sameSite: "lax" as const,
     secure: process.env.NODE_ENV === "production",
     path: "/",
     maxAge: ONE_YEAR,
   };
   
   export async function setCurrentOrg(orgId: string) {
     const cleaned = sanitizeOrgId(orgId);
     if (!cleaned) {
       return { ok: false as const, error: "Invalid org id" };
     }
   
     await setCookie(ORG_COOKIE, cleaned, cookieOpts);
     return { ok: true as const, orgId: cleaned };
   }
   
   export async function clearCurrentOrg() {
     await deleteCookie(ORG_COOKIE);
     return { ok: true as const };
   }