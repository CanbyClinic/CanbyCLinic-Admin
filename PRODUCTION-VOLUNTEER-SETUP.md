# Production volunteer screening email

The V10 volunteer flow posts to `/api/volunteer` and is designed as a short screening, not final onboarding.

## Vercel / production environment

Configure:

- `CANBY_RESEND_API_KEY`
- `CANBY_VOLUNTEER_NOTIFICATION_EMAIL` — clinic inbox that should receive volunteer screenings (defaults to the site's existing `info@puravidacc.org` if omitted)
- `CANBY_RESEND_FROM_EMAIL` — verified sender in Resend

If `CANBY_VOLUNTEER_NOTIFICATION_EMAIL` is omitted, the function can fall back to `CANBY_APPOINTMENT_NOTIFICATION_EMAIL`.

The initial screening deliberately does **not** ask for Social Security numbers, vaccination records, background-check details, patient information, or uploaded credential documents. Those should be handled later through the clinic's approved onboarding process after an interview/selection decision.

Local `npm run dev` writes preview submissions to `.canby-dev/volunteer-applications.ndjson`; this test folder must not be shipped with patient/volunteer test data.
