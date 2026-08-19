# Canby Community Clinic — V2 Release QA

## Screenshot blockers

- **Ambulance missing when opening `index.html` directly:** fixed with an embedded GLTF/binary/texture path.
- **Hero headings overlapping:** fixed with non-overlapping scroll opacity envelopes.
- **Large blank cream handoff:** fixed by shortening the hero and moving the paper handoff to the last 2.5%.
- **People cropped unpredictably:** fixed by removing random focal positioning and adding source-aware ratios/portrait treatment.

## V2 automated audit

- HTML pages: **63**
- HTML pages returning HTTP 200 from the local server: **63 / 63**
- Internal HTML links checked: **2,855**
- Fragment targets checked: **240**
- Local asset references checked: **632**
- Editorial photo placements: **86**
- Unique editorial photo IDs: **86**
- Reused editorial photo IDs: **0**
- Forms: **17**
- Unlabeled fields: **0**
- Buttons without accessible names: **0**
- Placeholder `href="#"` links: **0**
- Pages without exactly one `<h1>`: **0**
- Duplicate element IDs: **0**
- JavaScript syntax failures: **0**
- CSS brace-balance failures: **0**
- V2 stylesheet missing from a route: **0**

## Ambulance integrity checks

- `canby-ambulance-embedded.js` is loaded before the cinematic renderer on English, Spanish and Armenian homepages.
- Embedded `scene.bin` byte-for-byte matches `assets/ambulance/source/scene.bin`.
- Embedded texture payloads remove the `file://` texture-request failure path.
- Normal hosted GLTF/BIN loading remains in the renderer as a secondary path.
- A local rendered Canby ambulance still is the resilience fallback instead of unrelated photography.
- Scroll-linked travel, wheel rotation, suspension/body movement and camera choreography remain enabled.

## Photography/layout checks

- The arithmetic/random `object-position` system was removed.
- Image containers now adapt to loaded source aspect ratios within controlled editorial limits.
- Portrait sources get dedicated portrait treatment.
- Page hero and article parallax amplitude is lower so subjects do not slide out of frame.
- Mobile image ratios are taller and use subject-safe vertical focus.

## Browser note

The build environment used for this pass cannot provide a trustworthy GPU-backed Chromium visual run for the WebGL hero. I therefore do **not** mark the final 3D appearance as visually browser-proven here. The model payload, source-binary match, renderer syntax, direct-file loading path, DOM structure, local server routes, links, fragments and assets were validated. A final physical Chrome/Safari/iPhone visual check is still appropriate before DNS launch.

See `QA-AWWWARDS-V2-20260815.json` for the machine-readable report.
