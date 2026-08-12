# Canby Community Clinic — V74 Publish Plan

## 1. Homepage and animation
- Homepage starts with the ambulance cinematic.
- One navigation system is used over the animation and through the rest of the site.
- Desktop animation uses a 3840×2160 delivery sequence generated from the recovered V58 frames; this is 4K pixel output, not a native 4K rerender of the original 3D scene.
- Camera framing is 9% wider on desktop so the vehicle sits farther from the viewer.
- Typography is smaller and less intrusive.

## 2. Navigation
Dropdowns: Care, Patients, Resources, About, Language. Portal remains a direct action.

## 3. Portal and intake
- Portal action opens the login page immediately.
- Create Account opens a patient registration form based on Adult Patient Chart April.
- Insurance fields are optional.
- No Social Security Number is collected on the web form.
- Protected intake POST target: `/api/patient-intake`.
- Staff notification should contain only intake ID/timestamp and a link to the protected staff system; no PHI in ordinary notification email.

## 4. Backend before production patient data
Required before accepting real intake data: secure authentication, TLS, encrypted database, access controls, audit logs, retention policy, backups, staff roles, secure password recovery, vendor BAAs as applicable, and clinic/legal compliance review.

## 5. Analytics / tracking
Do not put advertising pixels, session replay, or unreviewed third-party tracking on authenticated pages or intake forms.

## 6. Interior pages
All pages share the V74 header, language menu, restrained section motion, and standardized visual system. Remove prototype/version labels.

## 7. Publish gates
- Verify phone, address, hours and all service claims.
- Connect secure auth/intake backend.
- Review Notice of Privacy Practices and consent wording.
- Run Lighthouse/axe/link checks on deployed URL.
- Verify English/Spanish/Armenian content.
