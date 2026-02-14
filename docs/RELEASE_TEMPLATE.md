<!-- ======================================================
File: docs/RELEASE_TEMPLATE.md
====================================================== -->

# Release Notes — vX.Y.Z (YYYY-MM-DD)

## Summary
One paragraph on what changed and why it matters.

## Highlights
- ✅ Highlight 1 (user-facing)
- ✅ Highlight 2 (performance/security)
- ✅ Highlight 3 (developer experience)

## Added
- Feature A
- Feature B

## Changed
- Change A (behavior/UI)
- Change B (API/data)

## Fixed
- Fix A (bug)
- Fix B (edge case)

## Security
- Security improvement A
- Dependency upgrades (if any)

## Migration / Setup Notes
- **Database:** (schema changes, SQL script, RLS changes)
- **Environment:** (new env vars)
- **Breaking Changes:** (if any)
- **Recommended Actions:** (e.g., re-run migrations, clear cache)

## Verification Checklist
- [ ] Local dev runs (`npm run dev`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Auth: signup/login/logout works
- [ ] Protected routes redirect correctly
- [ ] KPI pages load data under RLS
- [ ] ROI pages load data under RLS
- [ ] Org switching works (if enabled)
- [ ] Vercel deployment verified

## Screenshots (Optional)
- Add updated screenshots to `docs/screenshots/`
- Link/Embed them here

## Notes for Buyers (Flippa)
- Any relevant “what’s next”
- Optional paid support / upgrade offer