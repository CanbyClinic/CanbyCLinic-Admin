# Canby Community Clinic — cinematic website

A production-oriented Vinext/React rebuild for Canby Community Clinic with a persistent Three.js clinic world, route-specific GSAP motion, accessible static fallbacks, and original representative scene media.

## Run locally

```bash
pnpm install
pnpm dev
```

## Release checks

```bash
pnpm run lint
pnpm exec tsc --noEmit
pnpm run build
pnpm start
```

## Content and media

- `DESIGN.md` explains the visual and motion system.
- `docs/CONTENT-VERIFICATION.md` records public facts and deliberate non-claims.
- `docs/ASSET-PROVENANCE.md` records the source of every release visual.
- `docs/RELEASE-CHECKLIST.md` separates completed technical work from owner/legal approvals.

The appointment route is intentionally call-first. Do not add a medical-information form until the clinic approves a secure destination, privacy process, retention policy, and analytics exclusions.
