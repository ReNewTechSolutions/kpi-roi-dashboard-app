/* =========================================================
   File: src/lib/stripe.ts
   Stripe client + plan mapping (server-only)
   ========================================================= */
   import Stripe from "stripe";

   const secretKey = process.env.STRIPE_SECRET_KEY ?? "";
   if (!secretKey) throw new Error("Missing STRIPE_SECRET_KEY");
   
   export const stripe = new Stripe(secretKey, {
     apiVersion: "2024-06-20",
   });
   
   export const STRIPE_PRICE_PRO = process.env.STRIPE_PRICE_PRO ?? "";
   export const STRIPE_PRICE_TEAM = process.env.STRIPE_PRICE_TEAM ?? "";
   
   export type Plan = "free" | "pro" | "team";
   
   export function planFromPriceId(priceId: string): Plan {
     if (priceId && STRIPE_PRICE_PRO && priceId === STRIPE_PRICE_PRO) return "pro";
     if (priceId && STRIPE_PRICE_TEAM && priceId === STRIPE_PRICE_TEAM) return "team";
     return "free";
   }
   
   export function entitlementsForPlan(plan: Plan) {
     if (plan === "pro") {
       return {
         plan: "pro" as const,
         max_orgs: 3,
         max_seats_per_org: 3,
         max_kpi_months_history: 24,
         max_roi_models_per_org: 10,
         exports_csv_enabled: true,
         exports_pdf_enabled: false,
         charts_enabled: true,
       };
     }
     if (plan === "team") {
       return {
         plan: "team" as const,
         max_orgs: 10,
         max_seats_per_org: 10,
         max_kpi_months_history: -1,
         max_roi_models_per_org: -1,
         exports_csv_enabled: true,
         exports_pdf_enabled: true,
         charts_enabled: true,
       };
     }
     return {
       plan: "free" as const,
       max_orgs: 1,
       max_seats_per_org: 1,
       max_kpi_months_history: 3,
       max_roi_models_per_org: 1,
       exports_csv_enabled: false,
       exports_pdf_enabled: false,
       charts_enabled: false,
     };
   }