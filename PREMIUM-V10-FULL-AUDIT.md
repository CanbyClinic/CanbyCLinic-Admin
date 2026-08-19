# Canby Community Clinic — V10 Full Audit and Repair Order

## P0 — usability / conversion blockers

1. **Appointment label-to-input separation** — legacy “Form progress” UI was being injected between labels and controls. **FIXED V10.**
2. **Appointment form felt visually broken and sparse** — underlined inputs made it difficult to see where to type. **FIXED V10.**
3. **Appointment headline was oversized relative to the actual task.** **FIXED V10.**
4. **Appointment form started too far from the page heading.** **FIXED V10.**
5. **Preferred date had no intelligent default.** **FIXED V10: next available weekday.**
6. **Preferred time had no intelligent default.** **FIXED V10: 10:00 AM.**
7. **Native time input was unnecessarily awkward.** **FIXED V10: 30-minute clinic-hour selector.**
8. **Choosing a date required opening a native picker immediately.** **FIXED V10: four upcoming weekday shortcuts plus another-date control.**
9. **Server accepted times outside the clinic’s displayed hours.** **FIXED V10: 9:00 AM–4:30 PM request window.**
10. **Server could accept old weekdays.** **FIXED V10: past dates rejected.**
11. **Weekend requests needed stronger validation.** **FIXED: client and server reject weekends.**
12. **Homepage phone card was visibly cut off in the supplied screenshot.** **FIXED V10: safe grid constraints and width guards.**
13. **Homepage clinic strip / patient portal edge could run off the viewport.** **FIXED V10.**
14. **Old home layout rules could add uneven left/right padding to the conversion gateway.** **FIXED V10 for the appointment gateway.**

## P1 — volunteer experience

15. **Volunteer landing page was doing too many jobs at once.** **FIXED V10.**
16. **Medical and non-medical forms appeared/disappeared in place.** **FIXED V10: no toggling.**
17. **The path titles could feel like transient UI rather than navigation.** **FIXED V10: permanent two-option cards.**
18. **Volunteer page did not lead with a strong human image plus choice.** **FIXED V10.**
19. **Medical path did not have its own dedicated page.** **FIXED V10.**
20. **Non-medical path did not have its own dedicated page.** **FIXED V10.**
21. **Volunteer application was too long for an initial screening.** **FIXED V10: shortened to contact, fit, availability, brief motivation, acknowledgments.**
22. **Initial application asked for references too early.** **FIXED V10: removed from screening.**
23. **Initial screening mixed interview-stage onboarding with first contact.** **FIXED V10: background/health/training are acknowledgments, not long fields.**
24. **Medical screening needed a concise credential check.** **FIXED V10: professional role, specialty, license/certification fields, experience, CPR/BLS.**
25. **Medical applicants could infer that submitting authorizes clinical care.** **FIXED V10: explicit approved-scope acknowledgment.**
26. **Non-medical roles were not clearly grouped.** **FIXED V10: outreach, welcome/wayfinding, admin, events, language support, logistics, education support.**
27. **Availability was a free-text homework field.** **FIXED V10: weekday chips + daypart + cadence.**
28. **Volunteer form relied on the applicant opening their email client.** **FIXED V10: `/api/volunteer`.**
29. **Volunteer submit had no premium in-page success state.** **FIXED V10.**
30. **Volunteer workflow had no application identifier.** **FIXED V10.**
31. **Volunteer production email workflow was undocumented.** **FIXED V10: `PRODUCTION-VOLUNTEER-SETUP.md`.**
32. **Volunteer path did not persist when changing languages.** **FIXED V10.**
33. **New volunteer application routes were missing from sitemap.** **FIXED V10.**

## P1 — page alignment / photography

34. **Interior pages inherited several generations of competing width rules.** **FIXED V10 with a final desktop alignment guard.**
35. **Decorative section rules could create horizontal overflow.** **FIXED V10 with min-width/overflow guards.**
36. **Hero photos used nearly the same crop position regardless of subject.** **IMPROVED V10 with face-safe crop rules.**
37. **Volunteer clinician photo crop was too centered vertically.** **FIXED V10 with top-biased crop.**
38. **About/contact/community hero crops could cut heads.** **IMPROVED V10 with page-family crop overrides.**
39. **Homepage care photography could center on torsos instead of faces.** **IMPROVED V10.**
40. **Homepage journal photography used the same generic center crop in all languages.** **IMPROVED V10.**
41. **Some meaningful interior hero images had empty alt text.** **FIXED for hero imagery in V10.**
42. **Old reveal observers could cause headings to disappear if the observer misfired.** **FIXED V10: critical headings are always visible.**
43. **New appointment/volunteer forms could still inherit the old form meter.** **FIXED at both JS and CSS layers.**
44. **Desktop and mobile form layouts were not using the same compact structure.** **FIXED V10.**
45. **Form controls lacked a consistent focus container.** **FIXED V10.**
46. **Date and time selection did not visually communicate the selected state.** **FIXED V10 with active date chips and selected time.**
47. **Appointment request drawer and dedicated appointment page could drift into different UX patterns.** **FIXED V10 by updating the shared drawer markup.**

## P2 — remaining premium gates

48. **Terminal-quality production hero frames still do not exist in this ZIP.** OPEN — do not reintroduce cartoon 3D.
49. **81 remote Pexels images remain.** OPEN — replace with final unique/local art direction rather than simply renaming stock assets.
50. **64 empty alt states remain across decorative/editorial images.** REVIEW — some are intentionally decorative; meaningful images need individually written descriptions.
51. **Production appointment secure endpoint still needs the clinic-approved service configuration.** OPEN.
52. **Production volunteer email needs Resend environment values / verified sender.** OPEN.
53. **Final deployed-device QA is still required after production services and final hero media are connected.** OPEN.
54. **Photography needs a final human art-direction pass at 390, 768, 1440, 2560, and 3840 widths.** OPEN.
55. **The site still carries older CSS layers beneath V10.** OPEN — V10 stabilizes them, but a future code-cleanup pass should consolidate them after visual sign-off to avoid changing approved appearance.

## Volunteer screening research applied

The screening flow intentionally mirrors a common healthcare-volunteer sequence: short application/pre-application first, coordinator review/interview second, then background checks, health clearance, orientation, confidentiality/safety training, and role placement as required. It does not collect Social Security numbers, vaccination records, patient data, or detailed background-check information in the first web form.
