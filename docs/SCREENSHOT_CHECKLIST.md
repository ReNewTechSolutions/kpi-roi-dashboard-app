<!-- ======================================================
File: docs/SCREENSHOT_CHECKLIST.md
====================================================== -->

# Screenshot Checklist (Flippa + README)

Goal: consistent, clean screenshots that sell the asset fast.

---

## General Screenshot Rules
- Use the same browser + window size for all shots
- Recommended viewport: **1440×900** (or 1366×768)
- Keep the UI “quiet”:
  - no dev toolbars
  - no random popups
  - no sensitive data
- Use demo-style values (clean numbers)

---

## Folder + Filenames
Put screenshots here:
- `docs/screenshots/`

Use exact names:
- `login.png`
- `dashboard.png`
- `kpi.png`
- `roi.png`
- `org.png`
- `settings.png`
- Optional:
  - `members.png`
  - `demo-mode.png`

---

## Shot 1 — Login (`login.png`)
**Show:**
- Login form
- “Create account” link
- Clean branding title

**Caption suggestion:**
- “Production-ready authentication (Supabase Auth).”

---

## Shot 2 — Dashboard (`dashboard.png`)
**Show:**
- Top navigation visible
- KPI summary cards (if present)
- Current org context (optional)

**Caption suggestion:**
- “Multi-tenant KPI dashboard foundation.”

---

## Shot 3 — KPI Table (`kpi.png`)
**Show:**
- Monthly KPI list with 3–6 rows
- Revenue + Cost + Notes
- Year selector/filter if present

**Recommended sample values:**
- Revenue: 12,000 / 15,000 / 18,000
- Cost: 5,000 / 6,500 / 7,200
- Notes: “New campaign”, “Upsell”, “Retention push”

**Caption suggestion:**
- “Monthly KPI tracking (org-scoped under RLS).”

---

## Shot 4 — ROI (`roi.png`)
**Show:**
- ROI inputs panel
- ROI output summary (ROI %, payback, etc.)
- At least one saved scenario (if implemented)

**Recommended sample values:**
- totalInvestment: 5,000
- valueDelivered: 15,000
- termMonths: 12

**Caption suggestion:**
- “ROI model inputs stored per organization.”

---

## Shot 5 — Organization (`org.png`)
**Show:**
- Org management page (org name, org list)
- “Switch org” modal open (nice visual)
- Member roles if present

**Caption suggestion:**
- “Multi-tenant organization management (owner/member roles).”

---

## Shot 6 — Settings (`settings.png`)
**Show:**
- Settings layout (clean “SaaS feel”)
- Future sections placeholders (Billing, Team, API)

**Caption suggestion:**
- “SaaS-ready settings area for billing and team features.”

---

## Optional Shots (High Conversion)

### Members (`members.png`)
**Show:**
- Member list with roles (owner/member)
**Caption:**
- “Team-ready multi-tenant structure.”

### Demo Mode (`demo-mode.png`)
**Show:**
- Demo data visible + “demo mode” indicator
**Caption:**
- “Demo mode for screenshots & onboarding.”

---

## Embed Into README
Add to `README.md`:

```md
## Screenshots

![Login](docs/screenshots/login.png)
![Dashboard](docs/screenshots/dashboard.png)
![KPI](docs/screenshots/kpi.png)
![ROI](docs/screenshots/roi.png)
![Org](docs/screenshots/org.png)
![Settings](docs/screenshots/settings.png)