# Canby Premium V10 — Issue / Fix Ledger

## User-reported blockers fixed

1. Appointment labels were visually separated from their inputs by a legacy form-progress injector. **Fixed:** V10 forms are excluded from the legacy meter and any existing injected meter is removed.
2. Appointment fields felt like loose underlines rather than a coherent product form. **Fixed:** compact bordered field groups with labels directly attached to controls.
3. Appointment page headline dominated the viewport and pushed the form too far away. **Fixed:** centered two-part appointment header and a single contained booking surface.
4. Preferred date was blank. **Fixed:** defaults to the next available weekday.
5. Preferred time was blank. **Fixed:** defaults to 10:00 AM.
6. Native time entry was awkward. **Fixed:** 30-minute time-slot selector from 9:00 AM through 4:30 PM.
7. Date selection gave no quick choices. **Fixed:** four upcoming weekday chips plus a native “other weekday” date field.
8. Weekend requests could still be chosen in the native control. **Fixed:** client and server validation continue to reject weekends.
9. Homepage “Prefer to talk?” card overflowed/cropped on desktop. **Fixed:** safer minmax columns, explicit max width, min-width guards, and responsive breakpoints.
10. Homepage clinic strip / patient portal edge alignment could run off screen. **Fixed:** constrained grid and explicit alignment.
11. Volunteer page mixed path selection and long applications on one page. **Fixed:** landing page now contains only a photo, explanation, and two choices.
12. Volunteer path titles/forms disappeared when toggling. **Fixed:** no toggle system; each path opens a dedicated page.
13. Volunteer application was longer than needed for initial screening. **Fixed:** reduced to contact, fit, availability, brief motivation/experience, and acknowledgments.
14. Medical volunteer screening mixed credentialing with application. **Fixed:** only essential license/certification screening is asked up front; deeper clearance happens after interview.
15. Non-medical screening asked for unnecessary references before interest was established. **Fixed:** references removed from the initial screening.
16. Volunteer workflow depended on opening the applicant's email client. **Fixed:** dedicated `/api/volunteer` submission flow.
17. Volunteer success state was not a real website confirmation. **Fixed:** in-page success confirmation with application ID.
18. Meaningful hero images frequently had empty alt text. **Fixed:** meaningful fallback alt text added across interior hero images.
19. Interior hero crops used one object-position rule for every photograph. **Fixed:** V10 face-safe crop defaults plus volunteer/about/contact overrides.
20. Volunteer hero image could crop the clinician's head too aggressively. **Fixed:** top-biased object position.
21. Page hero containers had multiple conflicting width systems from older design passes. **Fixed:** V10 desktop max-width/alignment guard.
22. Content bands could inherit old overflow from decorative layout rules. **Fixed:** min-width and overflow guards.
23. New application pages were missing language-equivalent routes. **Fixed:** medical/non-medical screens exist in English, Spanish, and Armenian.
24. Language switch on the new application pages could lose the selected volunteer path. **Fixed:** switching language stays on the equivalent medical/non-medical screening page.
25. New volunteer routes were absent from sitemap. **Fixed:** added.

## Remaining visual/content work after V10

26. The production Terminal-quality hero frame sequence is still an external asset gate.
27. Remote stock photography still needs a final bespoke/local art-direction replacement pass.
28. The secure production appointment endpoint must be connected before launch.
29. Volunteer email environment variables must be configured before production submissions can send staff email.
30. Final device QA should still be run on the deployed URL after environment variables and production assets are connected.
