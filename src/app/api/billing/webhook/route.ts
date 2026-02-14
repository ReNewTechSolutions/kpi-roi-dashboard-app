/* =========================================================
   File: src/app/api/billing/webhook/route.ts
   Stripe webhook handler: updates billing_subscriptions + entitlements
   ========================================================= */
   import { NextResponse } from "next/server";
   import Stripe from "stripe";
   import { stripe, entitlementsForPlan, planFromPriceId } from "@/lib/stripe";
   import { createClient } from "@supabase/supabase-js";
   
   export const dynamic = "force-dynamic";
   
   function getAdminSupabase() {
     const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
     const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
     if (!url || !service) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
     return createClient(url, service, { auth: { persistSession: false } });
   }
   
   export async function POST(req: Request) {
     const signature = req.headers.get("stripe-signature");
     const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
     if (!signature || !webhookSecret) return NextResponse.json({ error: "Missing webhook secret" }, { status: 400 });
   
     const body = await req.text();
     let event: Stripe.Event;
   
     try {
       event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
     } catch (err: unknown) {
       return NextResponse.json(
         { error: err instanceof Error ? err.message : "Invalid signature" },
         { status: 400 },
       );
     }
   
     const admin = getAdminSupabase();
   
     async function upsertSubscription(orgId: string, sub: Stripe.Subscription) {
       const priceId = sub.items.data[0]?.price?.id ?? "";
       const status = sub.status;
       const currentPeriodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;
       const cancelAtPeriodEnd = !!sub.cancel_at_period_end;
   
       const { error } = await admin.from("billing_subscriptions").upsert(
         {
           org_id: orgId,
           stripe_subscription_id: sub.id,
           stripe_price_id: priceId,
           status,
           current_period_end: currentPeriodEnd,
           cancel_at_period_end: cancelAtPeriodEnd,
         },
         { onConflict: "org_id" },
       );
   
       if (error) throw new Error(error.message);
   
       const plan = planFromPriceId(priceId);
       const ent = entitlementsForPlan(plan);
   
       const { error: e2 } = await admin.from("entitlements").upsert(
         {
           org_id: orgId,
           ...ent,
         },
         { onConflict: "org_id" },
       );
   
       if (e2) throw new Error(e2.message);
     }
   
     try {
       switch (event.type) {
         case "checkout.session.completed": {
           const session = event.data.object as Stripe.Checkout.Session;
           const orgId = (session.metadata?.org_id ?? "") as string;
           const subId = session.subscription as string | null;
   
           if (orgId && subId) {
             const sub = await stripe.subscriptions.retrieve(subId);
             await upsertSubscription(orgId, sub);
           }
           break;
         }
   
         case "customer.subscription.created":
         case "customer.subscription.updated":
         case "customer.subscription.deleted": {
           const sub = event.data.object as Stripe.Subscription;
           const orgId = (sub.metadata?.org_id ?? "") as string;
   
           if (orgId) {
             await upsertSubscription(orgId, sub);
           }
           break;
         }
   
         default:
           break;
       }
     } catch (err: unknown) {
       return NextResponse.json(
         { error: err instanceof Error ? err.message : "Webhook processing error" },
         { status: 500 },
       );
     }
   
     return NextResponse.json({ received: true }, { status: 200 });
   }