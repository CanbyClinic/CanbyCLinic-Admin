# Canby Community Clinic — Premium V20 Medical Release

Build marker: `premium-v20-medical-release-20260819`

A multilingual community-clinic website with a scroll-linked organic-division hero, editorial page architecture, patient/resource journeys, secure-integration boundaries, unique editorial photography, and a sitewide responsive/form/media polish layer.

## Preview locally

### Fastest preview
You can open `index.html` directly in Chrome. The hero is generated locally by a native WebGL runtime, with no external animation or image dependency.

### Recommended full-site preview on Mac
Double-click `START-SITE.command`.

### Node
```bash
npm run dev
```
Then open `http://127.0.0.1:4173/`.

### Python
```bash
python3 -m http.server 4173
```
Then open `http://127.0.0.1:4173/`.

## V20 medical release layers

- `assets/css/canby-cell-hero.css`
- `assets/css/canby-v16-polish.css`
- `assets/css/canby-v19-final-polish.css`
- `assets/css/canby-v20-medical-release.css`
- `assets/js/canby-cell-hero.js`

V19 centers the scroll-revealed hero message, eases scroll input into the organic division sequence, and compacts the homepage hub and first-visit story. It also applies a restrained editorial type scale, shorter section rhythm, safer image framing, and consistent responsive proportions across all interior templates and all three language journeys.

V20 removes the remaining legacy viewport-height spacing, centers each hero beat independently, gives Spanish and Armenian the same self-contained organic hero, keeps every desktop dropdown inside the viewport, and uses complete-image framing for localized hero photography.

## Cell-division hero

The English homepage uses one consistent procedural organic material. A smooth signed-distance field stretches, narrows, separates, and multiplies from one form into two, four, and finally six forms. There are no mismatched still-image swaps, duplicated microscopy renders, scientific interface labels, particle fields, or explanatory slogans. Scroll progress drives the story directly and reverses exactly when the visitor scrolls upward. Only restrained ambient membrane motion continues while the hero is visible. Canvas output scales to a maximum 3840 × 2160 backing surface.

Hero copy is limited to the requested clinic message, address, and actions. It reveals letter by letter as the user scrolls. Previously revealed characters remain white; only the character currently being typed is highlighted in Canby green. Headlines are centered in the viewport at a restrained scale, and reduced-motion users receive a stable, fully legible hero state.

## Photography

Current editorial-photo placements: **81**. Current unique editorial-photo IDs: **81**. No editorial photo ID is reused. V16 retains source-aware aspect ratios and uses `contain` framing for portrait-safe media so people are not cropped out.

See:
- `PHOTO-SOURCES.md`
- `PHOTO-SOURCES-AWWWARDS-PASS.json`
- `PREMIUM-V19-QA.json`
- `PREMIUM-V20-QA.json`

## Languages

- English
- Spanish
- Armenian

English, Spanish, and Armenian content and forms retain their existing localized journeys. The new cell cinematic is used on the English front page.

## Secure integrations

Configure approved production services in `assets/js/config.js` for portal login/signup/reset, secure intake, administrative callbacks, volunteer submission and hosted donation checkout. The public frontend intentionally does not pretend to store medical records or payment-card data.

## V2 audit

Read:
- `SCREENSHOT-FAILURES-FIXED.md`
- `AWWWARDS-V2-40-MORE-IMPROVEMENTS.md`
- `PAGE-BY-PAGE-AUDIT.md`
- `QA-AWWWARDS-V2-20260815.json`
- `RELEASE-QA.md`

## Premium V10 — August 17, 2026

V10 focuses on the screenshot-reported usability and formatting defects:

- Rebuilt appointment form structure with labels attached to controls.
- Defaults appointment request to next available weekday and 10:00 AM.
- Added upcoming-day shortcuts and a 30-minute clinic-hours time selector.
- Rebuilt volunteer landing into photo + Medical Professional / Non-Medical choices.
- Added six localized volunteer screening pages and `/api/volunteer`.
- Fixed homepage Start/Call grid overflow and desktop alignment.
- Added final interior width/crop guards and protected critical headings from legacy reveal failures.

See `PREMIUM-V10-FULL-AUDIT.md`, `PREMIUM-V10-QA.json`, and `PRODUCTION-VOLUNTEER-SETUP.md`.
