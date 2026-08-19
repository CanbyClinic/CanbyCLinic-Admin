# Production appointment workflow

The website now has a complete appointment-request interface and a server endpoint at `/api/appointments`.

## Production rule

Do **not** send the patient's DOB, phone, email, or reason for visit directly in ordinary staff notification email. The production endpoint forwards the full appointment request to the clinic-approved secure scheduling/intake service. Staff email is only a minimal notification that a new request exists.

## Required production environment

- `CANBY_SECURE_APPOINTMENT_ENDPOINT` — HTTPS endpoint belonging to the clinic-approved scheduling/intake service.
- `CANBY_SECURE_APPOINTMENT_TOKEN` — optional bearer token for that endpoint.

The secure endpoint should return HTTP 2xx. It may optionally return `{ "staffUrl": "https://..." }` so a minimal staff notification can link into the approved secure system.

## Optional minimal email notification

The included Vercel function can send a non-PHI notification through Resend when all three values are configured:

- `CANBY_RESEND_API_KEY`
- `CANBY_APPOINTMENT_NOTIFICATION_EMAIL`
- `CANBY_RESEND_FROM_EMAIL`

The notification includes only request ID, preferred date/time, language, and an optional secure staff URL. Patient name, DOB, phone, email, and reason are deliberately omitted from the notification email.

## Local preview mode

`npm run dev` accepts test appointment requests and writes them to `.canby-dev/appointment-requests.ndjson` so the complete UI can be tested without pretending the production secure vendor is connected. This directory is excluded from the release ZIP.

## Patient setup

`new-patient.html`, `es-nuevo-paciente.html`, and `hy-new-patient.html` now use a short progressive health snapshot. They submit private data only to `window.CANBY_CONFIG.secureIntakeUrl`. Configure that value only with the clinic-approved secure intake endpoint.
