# Production launch checklist

## Public website
- [ ] Clinic leadership confirms phone, address, hours, service descriptions, donation language, and all published claims.
- [ ] Clinic approves English, Spanish, and Armenian copy; professional language review is recommended for patient-facing clinical/access content.
- [ ] Confirm canonical production domain and redirects.
- [ ] Test all 72 routes after deployment.
- [ ] Verify emergency language remains visible and accurate.

## Protected account / intake
- [ ] Deploy on a host that runs `/api/*` routes; GitHub Pages alone cannot run the protected backend.
- [ ] Create clinic-owned Supabase production project and apply `supabase/schema.sql`.
- [ ] Configure production environment variables from `.env.example`.
- [ ] Configure clinic-owned email notification sender.
- [ ] Complete privacy/security risk analysis before live PHI.
- [ ] Review vendor agreements / BAAs where applicable before transmitting or storing PHI.
- [ ] Define staff roles, least-privilege access, retention, backups, logging, incident response, and account offboarding.
- [ ] Verify password recovery, verification emails, logout, session expiration, and access controls in production.
- [ ] Do not add third-party ad/analytics pixels to portal, login, registration, or authenticated pages without a formal privacy/security review.

## Legal / professional review
- [ ] Review privacy notice, terms, nondiscrimination notice, medical disclaimer, financial-policy language, and any electronic-signature workflow with qualified reviewers.
- [ ] Do not claim HIPAA, ADA, or legal compliance solely from this codebase.

## Accessibility / QA
- [ ] Keyboard-only walkthrough of every critical flow.
- [ ] Screen-reader review of navigation, login, registration, and forms.
- [ ] 200% zoom / reflow review.
- [ ] High-contrast / OS text enlargement review.
- [ ] Reduced-motion review.
- [ ] Production Core Web Vitals monitoring.

## Ambulance cinematic
- [ ] Source/licence a production-quality Type III ambulance.
- [ ] Pass clay geometry gate.
- [ ] Pass six-frame beauty gate against Terminal reference.
- [ ] Render and QA master sequence.
- [ ] Create deliberate desktop/mobile derivatives.
- [ ] Only then replace the static release fallback.
