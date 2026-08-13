# V190 release-candidate QA

## Automated checks completed
- 72 HTML pages discovered.
- 0 missing local links/assets in the static route audit.
- 0 pages missing an H1 (except the intentionally special 404 rule in audit).
- All inspected form controls have programmatic labels.
- All inspected images have `alt` attributes.
- No external Google Font dependency.
- No Google Analytics / Tag Manager / Meta Pixel / Hotjar / Mixpanel / Segment tracking code found.
- All JavaScript files pass `node --check`.
- Existing serverless security-route test suite: 6/6 PASS.
- Protected intake endpoint fails closed with HTTP 503 when production credentials are missing.
- Account multi-step navigation browser test: PASS.
- Login payload browser test: PASS.
- Basic appointment callback payload browser test: PASS; no free-text medical field is present.
- Responsive overflow audit at 390px / 768px / 1440px for homepage, services, portal, account, appointment, Spanish home, and Armenian home: PASS after fixes.
- Desktop and mobile visual renders inspected for homepage; desktop renders inspected for services, portal, and account registration.

## Production architecture
- Public static HTML/CSS/JS pages.
- Server-side authentication/API routes under `/api`.
- Supabase schema with RLS enabled.
- Public callback requests store basic contact data only.
- Protected intake has no public/normal-authenticated table policies; intended insertion is service-role/server-side only.
- Patient notification email contains no patient details.
- Auth cookies are server-managed, HttpOnly, SameSite=Strict, and Secure in production.
- Security headers defined in `vercel.json`.
- Private account pages carry noindex/noarchive controls and no-store cache headers.

## Human signoff still required before handling live PHI
- production vendor configuration / agreements / BAAs where applicable
- formal risk analysis and clinic security policies
- staff access roles and retention policy
- qualified legal review of privacy/consent/arbitration/e-signature workflows
- professional language review for Spanish and Armenian patient-facing text
- assistive-technology accessibility review
- final production-domain deployment test

## Ambulance hero
The production Type III beauty/master gate remains an external asset dependency. The public release intentionally uses a high-fidelity static Canby ambulance fallback instead of shipping a rejected Sprinter, Type-I, or proxy sequence. The approved PREVIS-D motion evidence is included under `handoff/animation/`.
