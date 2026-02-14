/* =========================================================
   File: src/data/billing.ts
   Server-friendly: fetch org plan + owner flag for UI gating.
   ========================================================= */
   import { getSupabaseServerClient } from "@/lib/supabase/server";

   export type BillingSummary = {
     isOwner: boolean;
     plan: "free" | "pro" | "team";
   };
   
   export async function getBillingSummary(orgId: string): Promise<BillingSummary> {
     const supabase = await getSupabaseServerClient();
   
     const { data: ownerRow } = await supabase.rpc("is_org_owner", { _org_id: orgId }).single();
     const isOwner = ownerRow === true;
   
     const { data: ent } = await supabase.from("entitlements").select("plan").eq("org_id", orgId).maybeSingle();
     const plan = (ent?.plan as BillingSummary["plan"] | undefined) ?? "free";
   
     return { isOwner, plan };
   }