# Backend integration notes

## Current boundary

The site includes working authentication and callback API routes, but production services are not connected in this local copy. The UI reports that state and does not pretend to accept patient credentials or contact requests.

The portal currently provides account access and safe navigation to patient resources. It does not expose EHR records, appointments, prescriptions, laboratory results, clinical messaging, or document uploads.

## Environment

Copy the variable names in `.env.example` into the production host and supply clinic-owned values. Keep `SUPABASE_SECRET_KEY` and `RESEND_API_KEY` server-only.

## Database

Run `supabase/schema.sql`. The schema creates:

- Patient profiles protected by Row Level Security
- A restricted callback queue with no public database policies
- A signup trigger that creates a profile owned by the authenticated user

## API routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/session`
- `POST /api/auth/logout`
- `POST /api/auth/recover`
- `POST /api/auth/accept-session`
- `POST /api/auth/update-password`
- `GET /api/auth/status`
- `POST /api/contact`

## Not a compliance certification

Code alone cannot make a clinic HIPAA compliant. Vendor agreements, configuration, operational safeguards, workforce procedures, monitoring, incident response, and a documented risk analysis are production gates. See `SECURE-PORTAL-SETUP.md`.
