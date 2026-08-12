# Canby V74 Publish QA

## Automated checks completed
- 72 HTML pages audited.
- Every page has a title and H1.
- 0 broken internal HTML link targets in the packaged site.
- 0 missing local script/style/image references in the packaged site.
- 410 desktop animation frames at 3840×2160.
- 410 mobile animation frames at 1440×2560.
- Legacy V58 and old sprite folders removed from the publish package.
- Animation controller has no active duplicate vehicle overlay.
- JavaScript syntax checked for the animation controller, V74 site system, and legacy core script.
- Portal, account creation, password reset, and dashboards are noindex.
- New intake form does not request Social Security Number or driver's license.
- No common advertising/session-replay tracking scripts detected.

## Human/clinic sign-off still required before accepting real patient data
- Verify public phone number, address, clinic hours, and every service claim.
- Connect `/api/auth/login` and `/api/patient-intake` to the clinic's protected backend.
- Configure secure staff notification without PHI in ordinary notification email.
- Review consent language, Notice of Privacy Practices, and retention policies.
- Verify Spanish and Armenian content with qualified reviewers.
- Run final accessibility/Lighthouse tests on the deployed production URL.
