<!-- ======================================================
File: docs/CI_CHECKLIST.md
====================================================== -->

# CI Checklist — GitHub Actions Plan (Buyer Confidence Booster)

This project benefits from a lightweight CI workflow that proves:
- build stability
- TypeScript correctness
- lint rules (if used)
- optional e2e smoke tests

---

## 1) Minimal CI (Recommended)

Trigger:
- on push to `main`
- on pull requests

Jobs:
1) Install
2) Typecheck
3) Build

Checklist:
- [ ] Node 20.x (or 18.x) configured
- [ ] `npm ci` used for deterministic installs
- [ ] `npm run build` passes
- [ ] `npm run typecheck` passes (or `tsc --noEmit`)
- [ ] Cache `~/.npm` or `node_modules` (optional)

---

## 2) Lint CI (Optional)
If ESLint is configured:
- [ ] `npm run lint` passes

---

## 3) Formatting CI (Optional)
If Prettier is used:
- [ ] `npm run format:check` passes

---

## 4) Environment Variables in CI (Important)

### For “build-only” CI
You may need safe placeholder env vars if your build requires them.

Recommended:
- Use repository secrets for:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Or for non-prod builds:
- Use dummy values if your build doesn’t call Supabase at build time.

Checklist:
- [ ] CI build doesn’t require live Supabase connectivity
- [ ] CI only requires env vars to exist (not to work)

---

## 5) Optional E2E Smoke Tests (Later)
Use Playwright or Cypress to test:
- login page loads
- protected routes redirect to login when unauthenticated
- (optional) demo mode path renders

Checklist:
- [ ] A “demo mode” route exists for CI
- [ ] Don’t run Supabase-dependent tests in CI unless you provide a test project

---

## 6) What Buyers Like Seeing
- Green checks on PRs
- Clear commands in `package.json`:
  - `build`
  - `typecheck`
  - `lint` (optional)
  - `test` (optional)

Add badges to README (optional):
- Build status
- License

---

## 7) Suggested `package.json` Scripts
Recommended scripts:

- `dev`: `next dev`
- `build`: `next build`
- `start`: `next start`
- `typecheck`: `tsc --noEmit`
- `lint`: `next lint` (optional)

---

## 8) Pre-Sale Proof Flow
Before listing:
- [ ] CI green on main
- [ ] Vercel deploy green
- [ ] Supabase scripts run cleanly
- [ ] Screenshots captured

---

## 9) Optional “Release” Workflow
If you want extra polish:
- Tag releases (`v0.1.0`)
- Attach zip artifact to GitHub release
- Include release notes from `docs/RELEASE_TEMPLATE.md`