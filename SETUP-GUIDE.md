# KPI + ROI Dashboard  
## Buyer Setup Guide

Thank you for purchasing the KPI + ROI Dashboard asset.

This guide will walk you through deploying the application in under 10 minutes.

---

# 1. Prerequisites

You will need:

• A Supabase account (https://supabase.com)  
• A Vercel account (https://vercel.com)  
• A GitHub account  

---

# 2. Supabase Setup

## Step 1: Create a New Project

1. Log into Supabase.
2. Click "New Project".
3. Choose a name and region.
4. Wait for database provisioning.

---

## Step 2: Get API Credentials

In Supabase:

Settings → API

Copy:

• Project URL  
• anon public key  

You will use these in Vercel.

---

## Step 3: Run Database Schema

Inside Supabase:

SQL Editor → New Query

Paste the contents of:

`/supabase/schema.sql`

Run the query.

Then paste and run:

`/supabase/rls.sql`

This sets up:

• organizations table  
• org_members table  
• kpi_entries table  
• Row Level Security  
• Policies  

---

# 3. Deploy on Vercel

## Step 1: Import Repository

1. Log into Vercel.
2. Click "Add New Project".
3. Import this GitHub repository.
4. Set Root Directory (if needed) to:

kpi-roi-dashboard-web

---

## Step 2: Add Environment Variables

In Vercel → Project → Settings → Environment Variables

Add:

NEXT_PUBLIC_SUPABASE_URL  
Value: https://YOUR_PROJECT_ID.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: (Your Supabase anon key)

Add these to:
• Production  
• Preview  
• Development  

---

## Step 3: Deploy

Click "Deploy".

Vercel will build and launch the app automatically.

---

# 4. First Login

1. Open the deployed URL.
2. Create an account via Signup.
3. You will be redirected to the Dashboard.

---

# 5. Demo Mode

Demo mode is available in Settings.

When enabled:
• Dashboard loads pre-seeded KPI data
• No database interaction required

This is useful for:
• Product demos
• Sales screenshots
• Marketing previews

---

# 6. Customization

You may:

• Rebrand the application
• Change styling
• Modify KPI logic
• Extend ROI formulas
• Add Stripe for monetization
• Add multi-tenant billing

Full source ownership transfers with purchase.

---

# 7. Production Notes

• Supabase free tier supports early usage.
• Vercel Hobby plan is sufficient for low traffic.
• Upgrade plans as needed for scaling.

---

For technical questions regarding transfer, contact the seller.