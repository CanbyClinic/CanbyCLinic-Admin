# Backend Integration Notes — Canby Community Clinic V4

The V4 portal is a front-end prototype only. It demonstrates the intended patient experience, but it does not connect to an EHR, scheduling system, pharmacy, laboratory, secure messaging service, or clinical database.

## Replace the demo layer before production

1. Connect patient identity and authentication.
2. Replace local browser storage with protected server-side records.
3. Add verified password reset and multi-factor authentication.
4. Add role-based access controls and audit logs.
5. Connect appointments, patient-facing notes, prescriptions, results, documents, and secure messaging.
6. Connect the first-page demographic intake to the clinic's approved secure workflow.
7. Configure staff notifications without placing sensitive patient details in ordinary email.
8. Complete privacy, security, legal, and accessibility reviews before launch.

## Configuration file

Public service URLs are reserved in `assets/js/config.js`:

- `donationCheckoutUrl`
- `portalLoginUrl`
- `portalSignupUrl`
- `portalResetUrl`
- `secureCallbackUrl`
- `secureIntakeUrl`

The current front-end portal intentionally uses local browser storage and displays a warning not to enter real medical information.
