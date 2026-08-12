# Canby Site Rebuild Gates

Updated: August 10, 2026

## Stage 1 - Reference and structure: PASS

- RS reference reviewed for scale, typography, system lines, section pacing, and interaction hierarchy.
- Existing ambulance intro left unchanged by request.
- Generic post-intro homepage replaced with the patient command center.

## Stage 2 - Patient pathways: PASS

- New Patient Intake, Portal Information, Patient Forms, and Call Clinic are first-screen actions.
- New-patient steps, insurance guidance, multilingual resources, visit information, and community care are present.
- English, Spanish, and Armenian tabs switch correctly.
- Internal links and visual assets referenced by the new experience exist.

## Stage 3 - Privacy and patient safety: PASS FOR PUBLIC-SITE SCOPE

- Public portal credential form removed from the live experience.
- Medication and portal data are no longer stored in browser storage by active site scripts.
- Public pages do not collect health information.
- Website Privacy, Notice of Privacy Practices, Nondiscrimination and Language Access, and Accessibility pages were rebuilt.
- A clinic privacy/security review and an approved portal vendor are still required before collecting or transmitting PHI.

## Stage 4 - Responsive and 4K layout: PASS

- 3878 x 2181 browser viewport: centered 1680px content system, zero horizontal overflow.
- 390 x 844 responsive frame: zero horizontal overflow and no detected content overflow.
- 768 x 1024 responsive frame: zero horizontal overflow and no detected content overflow.
- Post-intro motion uses transform and opacity only and respects reduced-motion settings.

## Stage 5 - Browser verification: PASS

- Homepage replacement loads without direct-page browser errors.
- Policy pages render with no forms or health-information inputs.
- Portal information page contains no login form or password input.
- Clinic and community images load at their natural dimensions.

## Deferred Stage - Ambulance intro: NOT STARTED IN THIS PASS

- The current intro remains the inherited 3D/2D hybrid.
- The final replacement must use polished 2D ambulance renders with continuous camera-angle transitions.
- Do not package a ZIP until the separate animation gate passes.
