# Secure portal production gate

The patient portal now contains real server-side authentication code. It is intentionally disabled until the clinic connects its own approved services. A visual login screen is not evidence of HIPAA compliance, and this project must not be described as production-ready until every gate below is complete.

## Implemented in this repository

- Email and password sign-up
- Email verification handoff
- Login, session refresh, logout, and password recovery
- Strong-password validation in the browser and on the server
- HttpOnly, Secure, SameSite session cookies in production
- Same-origin request checks and basic abuse throttling
- No authentication tokens in `localStorage` or client-readable cookies
- Supabase Row Level Security schema for patient-owned profiles
- A callback queue that accepts basic contact details only
- Generic clinic notification email with no patient details
- Security headers and a restrictive Content Security Policy
- Fail-closed behavior when required credentials are missing

## Required clinic-owned services

1. Create a clinic-owned Supabase organization and production project.
2. Execute `supabase/schema.sql` in the production project.
3. Enable email confirmation and configure the production redirect URL.
4. Sign the required Business Associate Agreement and enable the Supabase HIPAA add-on before protected health information is introduced.
5. Configure an approved transactional email provider. Confirm whether a BAA or different provider is required for the clinic's use case.
6. Add the values from `.env.example` to the production hosting environment. Never put the secret key in a browser file or source repository.
7. Restrict staff access to the contact queue through a separate authenticated administrative system with role-based access and audit logging.

## Before production launch

- Complete the clinic's security risk analysis and vendor review.
- Enable MFA for staff and consider MFA for patients based on the clinic's risk analysis.
- Configure rate limiting or WAF controls at the hosting edge; the in-code limiter is only a secondary safeguard.
- Configure database backups, point-in-time recovery, log retention, incident response, breach procedures, and staff offboarding.
- Test verification, recovery, expired-session, revoked-session, and account-lockout paths on the production domain.
- Conduct accessibility, privacy, penetration, and legal reviews.
- Connect the portal to the approved EHR or patient-record system only through documented server-side interfaces.

## Contact request boundary

The public callback form does not include a free-text message field. It must not be expanded to collect symptoms, diagnoses, medications, dates of birth, insurance identifiers, or other health details. Staff receive only a generic email telling them that a request is waiting in the protected queue.
