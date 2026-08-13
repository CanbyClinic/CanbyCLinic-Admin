# Canby Community Clinic — V190 Release Candidate

## Publish
Static pages + Vercel-style serverless API routes. Deploy to Vercel (or adapt API routes to an equivalent serverless host), configure production environment variables, apply `supabase/schema.sql`, and verify clinic-owned domain/HTTPS.

## Public contact forms
Collect basic callback details only. No symptoms, diagnoses, insurance IDs, test results, or medical records.

## Patient registration
`create-account.html` submits to `/api/patient-intake`. The endpoint fails closed until Supabase/auth production variables are present. Registration stores data server-side and sends only a generic staff notification email with no patient details.

## Compliance boundary
This repository implements privacy/security-oriented technical controls but does not certify HIPAA, ADA, legal, or regulatory compliance. Before live PHI: clinic leadership and qualified privacy/security/legal reviewers should approve vendors, BAAs where applicable, risk analysis, policies, access roles, retention, incident response, electronic-signature/legal forms, and production configuration.

## Ambulance hero
The final Terminal-matched Type III cinematic remains a production-asset dependency. The public release uses the best available clinic-branded static ambulance fallback rather than shipping a rejected Sprinter/Type-I/proxy animation. See `ANIMATION-HANDOFF.md`.

## QA
Run `python3 tests/release_audit.py` from the repository root.
