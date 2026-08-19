# Canby Community Clinic — Premium Audit: 100 Improvements

**Audit date:** 2026-08-17  
**Build reviewed:** `Canby-Community-Clinic-PREMIUM-FINAL-20260815(1).zip`  
**Status key:** `DONE` = implemented in this pass; `PARTIAL` = improved but requires visual/browser refinement; `OPEN` = still to do; `ASSET GATE` = cannot be honestly completed until final production media exists.

## What the source audit found

- 63 HTML pages.
- 3,641 internal/external links scanned; 0 missing internal file targets in the static build.
- 89 `<img>` elements; 86 currently depend on remote image URLs; all 89 currently have empty `alt` attributes.
- 17 forms, with existing JS handling for portal/intake/administrative fallbacks.
- Legacy shared stylesheet was approximately 163 KB before cleanup and contained 519 `!important` declarations, indicating substantial cascade debt.
- The former hero was a static ambulance render plus CSS scroll transforms/light sweep/typewriter behavior—not a production cinematic frame sequence.
- The bundled former ambulance GLTF was far too low-detail for an automotive-commercial hero and has been removed from the production runtime path.

## 100 premium improvements / issues

### Hero, motion, and cinematic system

1. **DONE** — Remove the former low-fidelity ambulance hero from all three language homepages.
2. **DONE** — Remove the low-poly ambulance runtime asset directory so it cannot accidentally be reactivated.
3. **DONE** — Remove the crude dark ambulance fallback renders from production assets.
4. **DONE** — Remove the fake CSS “sun/light sweep” that attempted to simulate cinematic lighting.
5. **DONE** — Remove the scroll-typed/highlighted headline gimmick from the retired hero.
6. **DONE** — Remove the old long-scroll hero CSS module and legacy hero selectors from the active stylesheet.
7. **DONE** — Disable the legacy WebGL hero binding in shared JS so an old watchdog cannot restore it.
8. **DONE** — Replace the hero architecture with deterministic scroll-progress → frame-index mapping.
9. **DONE** — Make reverse scrolling reverse the requested frame instead of playing an autonomous animation.
10. **DONE** — Add a high-DPR canvas renderer with sensible DPR caps.
11. **DONE** — Add a nearest-decoded-frame fallback to prevent blank canvas states while frames stream.
12. **DONE** — Add directional preloading so the cache favors the direction the user is scrolling.
13. **DONE** — Add separate desktop and mobile sequence definitions instead of relying on a center crop.
14. **DONE** — Add a reduced-motion path that avoids forcing cinematic movement on users who opt out.
15. **DONE** — Add a manifest gate so the site cannot falsely claim the final movie is installed before approved frames exist.
16. **DONE** — Use an honest healthcare-photo fallback while production cinematic frames are unavailable instead of showing a cheap 3D ambulance.
17. **ASSET GATE** — Produce a genuinely photoreal American Type III Canby ambulance with commercial-grade body, wheel, glass, lighting, panel, underbody, and livery detail.
18. **ASSET GATE** — Render a 180–300-frame offline master sequence rather than trying to make a low-poly browser model look expensive.
19. **ASSET GATE** — Match Terminal’s shot progression: strong sunset introduction, yard/elevation reveal, photoreal→technical transition, connected-system phase, then clean page release.
20. **ASSET GATE** — Build the changing sun/highlight/reflection choreography into the rendered frames; do not fake it with gradients.
21. **ASSET GATE** — Create a dedicated portrait/mobile camera composition and render, not merely a desktop crop.
22. **ASSET GATE** — Perform frame-level livery QA at side, three-quarter, close, and high-angle states.
23. **ASSET GATE** — Perform side-by-side Terminal/Canby motion QA at fixed scroll checkpoints before approving the hero.
24. **ASSET GATE** — Validate slow, normal, fast, and reverse scroll against the finished frame set.
25. **PARTIAL** — Keep hero copy subordinate to the cinematic; refine final copy timing only after the movie is visually locked.

### Visual system and art direction

26. **DONE** — Add a tighter premium spacing system with consistent page gutters and maximum content widths.
27. **DONE** — Strengthen the header hierarchy and reduce the “generic template navigation bar” feeling.
28. **DONE** — Make the header work as an overlay on the dark hero and transition cleanly into light content.
29. **DONE** — Refine mega-menu dimensions, spacing, background, and shadow so dropdowns feel intentional rather than layered on top of each other.
30. **DONE** — Tighten global heading scale, line-height, and line-length for more editorial authority.
31. **DONE** — Improve page-hero proportions so interior pages have a stronger first viewport.
32. **DONE** — Improve media framing and `object-fit` behavior to reduce awkward crops and partial people cut-offs.
33. **DONE** — Reduce excessive border/shadow dependence and move more hierarchy into spacing and composition.
34. **DONE** — Refine cards toward quieter architectural surfaces instead of floating “AI bento” tiles.
35. **DONE** — Upgrade form control sizing, focus states, and surface styling.
36. **DONE** — Redesign the footer treatment to feel like a deliberate ending instead of utility content appended to the page.
37. **PARTIAL** — Reduce the number of competing greens/teals and standardize the exact accent hierarchy across old and new CSS layers.
38. **PARTIAL** — Normalize radii; some older components still use inconsistent rounded-card language.
39. **PARTIAL** — Normalize button height, icon spacing, hover distance, and type weight across legacy components.
40. **OPEN** — Replace generic stock-photo art direction with a coherent editorial photography system that feels specific to Canby and Reseda.
41. **OPEN** — Self-host approved photography so imagery is stable, optimized, privacy-conscious, and not dependent on third-party hotlinks.
42. **OPEN** — Create page-specific crop rules for portrait, landscape, clinician, family, building, and detail imagery.
43. **OPEN** — Add a small set of bespoke non-cartoon clinical diagrams where information benefits from explanation.
44. **OPEN** — Establish a consistent icon family; remove any mismatched generic icon styles.
45. **OPEN** — Add controlled image masks/crops as a signature device rather than relying on repeated rectangular photos.

### Homepage structure and storytelling

46. **DONE** — Give the homepage one true H1; the “Start here” section was demoted to H2 for correct hierarchy.
47. **DONE** — Place clear appointment and portal actions directly in the hero instead of hiding the next step.
48. **DONE** — Shorten the new hero copy so the cinematic is not buried under paragraphs.
49. **PARTIAL** — Improve the first post-hero handoff so it reads as the continuation of one story rather than the start of a second website.
50. **PARTIAL** — Simplify the first-action rail so new patients can understand their route within seconds.
51. **PARTIAL** — Create stronger visual contrast between “care,” “visit,” “portal,” “journal,” location, and community chapters.
52. **PARTIAL** — Reduce equal-weight treatment of every homepage section; only two or three moments should be visually dominant.
53. **OPEN** — Re-edit homepage copy to remove any remaining generic marketing language and make every sentence useful to a patient.
54. **OPEN** — Make the location/hours moment more tangible with building/location photography and a clear directions action.
55. **OPEN** — Create a more convincing transition from service overview to appointment preparation.
56. **OPEN** — Replace decorative motion with micro-motion tied to comprehension: reveal, focus, progress, navigation, and state change.
57. **OPEN** — Add one memorable, non-hero signature interaction after the opening so the rest of the homepage does not feel static by comparison.
58. **OPEN** — Reconsider section lengths so the scroll rhythm alternates between dense utility and spacious editorial moments.
59. **OPEN** — Ensure the portal preview does not look more functional than the actual integration status allows.
60. **OPEN** — Give pregnancy/preventive-care article promotion stronger editorial prominence without turning the homepage into a blog feed.

### Interior pages and layout differentiation

61. **PARTIAL** — Use existing `data-page-kind` and `data-aw-layout` attributes to differentiate care, patient, clinic, community, article, and legal heroes.
62. **OPEN** — Break up the 27 interior pages that currently share essentially the same `page-hero + content-band` structural signature.
63. **OPEN** — Give service overview pages a distinct “decision / service selection” layout rather than article-like reading pages.
64. **OPEN** — Give individual service pages a distinct “what we do / what to expect / next step” anatomy.
65. **OPEN** — Give appointment/new-patient pages task-first layouts with preparation steps above editorial content.
66. **OPEN** — Give legal/privacy/accessibility pages calm document layouts with better reading width, anchors, and version metadata.
67. **OPEN** — Give article pages true editorial treatment: deck, metadata, readable measure, pull facts, source notes, and related reading.
68. **OPEN** — Vary visual chapter placement so interior pages do not all alternate the same left/right image formula.
69. **OPEN** — Remove redundant section labels and eyebrow text where the heading already communicates the same idea.
70. **OPEN** — Increase whitespace before major changes in topic instead of using separators everywhere.
71. **OPEN** — Audit every photo crop at desktop, tablet, and phone sizes; people should never be accidentally cut at joints or faces.
72. **OPEN** — Standardize maximum paragraph width to prevent long, low-prestige text lines on large displays.
73. **OPEN** — Add purposeful sticky side navigation only on long articles/policies where it materially improves orientation.
74. **OPEN** — Reduce repeated “card grids” on resources and article lists; mix index/table/editorial formats.
75. **OPEN** — Give About/Community/Get Involved pages warmer human storytelling distinct from clinical service pages.

### Navigation, responsive behavior, and interaction

76. **PARTIAL** — Improve mega-menu collision/overlay behavior with safer dimensions and stacking; still requires visual browser QA at all breakpoints.
77. **OPEN** — Test every navigation item, submenu, language route, CTA, and footer route in a real browser matrix.
78. **OPEN** — Reduce top-level navigation density where multiple links lead to closely related patient tasks.
79. **OPEN** — Make the current section/page state more visible without adding heavy pills or badges.
80. **OPEN** — Make the mobile navigation feel designed for thumb use, not merely collapsed desktop navigation.
81. **OPEN** — Preserve emergency/contact/appointment access within one or two taps on mobile.
82. **OPEN** — Verify language switchers preserve the equivalent page when a translated route exists.
83. **OPEN** — Ensure fixed/sticky elements never cover anchor targets, form errors, or focused controls.
84. **OPEN** — Remove hover-only meaning; every interaction must work with touch and keyboard.
85. **OPEN** — Audit 320px, 375px, 430px, tablet portrait, tablet landscape, 1440p, and 4K layouts explicitly.

### Accessibility, forms, and patient usability

86. **DONE** — Add stronger `:focus-visible` treatment to interactive controls.
87. **DONE** — Preserve an explicit reduced-motion experience for the new hero.
88. **OPEN** — Review all 89 image alt states; meaningful images need useful alt text and truly decorative images should remain intentionally empty.
89. **OPEN** — Test keyboard order through mega menus, language controls, portal forms, volunteer forms, and modal states.
90. **OPEN** — Verify every form exposes clear inline error text, not color-only validation.
91. **OPEN** — Verify form success/error announcements use appropriate live regions for assistive technology.
92. **OPEN** — Confirm color contrast after the final photography/color pass, especially text over media and muted green text.
93. **OPEN** — Verify visible labels remain present for all sensitive or medically relevant fields; placeholders are not sufficient labels.
94. **OPEN** — Make disconnected secure features unmistakably unavailable rather than visually mimicking a live patient system.
95. **OPEN** — Run WCAG-oriented automated and manual audits after final layout lock.

### Performance, engineering, trust, and release quality

96. **DONE** — Add `content-visibility:auto` to appropriate below-fold sections to reduce initial rendering work.
97. **PARTIAL** — Reduce dead hero CSS; continue decomposing the legacy ~155 KB shared stylesheet and its remaining 500+ `!important` cascade overrides.
98. **OPEN** — Replace 86 remote image dependencies with optimized local AVIF/WebP variants and responsive `srcset`/`sizes`.
99. **OPEN** — Run final Lighthouse/performance, console-error, broken-route, form, accessibility, and mobile thermal tests on the deploy build—not just source files.
100. **OPEN** — Do not call the website “premium-final” until the production Terminal-matched hero frames and full visual QA pass are actually complete.

## First-pass conclusion

The main failure was not that the old hero needed “more polish.” It was the wrong asset and the wrong rendering strategy. That path is now retired. The site has a proper production frame-sequence runtime and a cleaner global visual layer, but the real Terminal-level result still depends on creating and approving the final photoreal Type III ambulance movie. Until those frames exist, the build deliberately shows an honest healthcare fallback rather than pretending a cheap 3D animation is finished.
