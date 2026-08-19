# Canby Community Clinic — Awwwards V2
## 40 additional improvements implemented after the screenshot review

The screenshot review exposed four release blockers: the ambulance did not render when `index.html` was opened directly from Finder, hero text states overlapped while scrolling, the paper-colored handoff occupied too much scroll distance, and the photography system used arbitrary crop positions that cut people unpredictably. This pass fixes those first, then adds a second premium-detail pass.

1. **Direct-file ambulance support** — the GLTF scene no longer depends on `fetch()` when the site is opened with `file://`.
2. **Embedded model binary** — the ambulance `scene.bin` is bundled into a local classic script for direct-open reliability.
3. **Embedded livery textures** — ambulance textures are embedded as data URIs so local-file origin restrictions cannot break them.
4. **Preserved hosted mode** — the normal GLTF/BIN loading route still remains available as a fallback when the embedded payload is absent.
5. **Local ambulance fallback still** — the generic/HVAC fallback image was replaced by a locally rendered Canby ambulance frame.
6. **No remote dependency for hero fallback** — the hero can still make visual sense if the network is unavailable.
7. **Hero scroll length reduced** — the opening sequence is shorter and no longer traps the user in a long cinematic.
8. **Dead cream handoff removed** — the paper-colored transition begins only at the very end of the hero.
9. **Copy states rebuilt as non-overlapping envelopes** — each hero statement now has its own entry/hold/exit range.
10. **Hero copy transitions are driven by scroll state** — no CSS transition lag can leave two giant headings on top of each other.
11. **Secondary hero statement shortened** — “Primary care. Prevention. Follow-up.” is clearer and fits the composition.
12. **Hero type scale recalibrated** — large enough to feel cinematic without filling the viewport with one broken line.
13. **Hero line length capped** — headings now preserve deliberate line breaks instead of uncontrolled wrapping.
14. **Hero metadata measure tightened** — phone/address copy remains readable and does not stretch across the screen.
15. **Scroll cue simplified** — the cue is quieter, more directional, and uses the clinic motion accent.
16. **Loader language simplified** — the loader no longer explains internal failure states to patients.
17. **Progressive-enhancement reveal system** — page content stays visible if JavaScript fails instead of producing blank pages.
18. **Blank-page failure mode removed** — reveal opacity is only activated after the motion system is known to be running.
19. **Random image focal points removed** — the previous arithmetic crop randomizer was deleted.
20. **Source-aware image ratios added** — loaded image dimensions now influence the containing composition.
21. **Portrait-source detection added** — portrait photographs get a dedicated layout rather than being forced into a landscape crop.
22. **Wide-source detection added** — cinematic source images get a different focal treatment from portrait images.
23. **Face-safe vertical focus** — hero and people imagery bias the crop upward instead of cutting heads and upper bodies.
24. **Hero images no longer use excessive over-height parallax** — image height now matches the visual frame rather than extending far beyond it.
25. **Parallax amplitude reduced** — motion is present without dragging the crop through the subject.
26. **Article hero photography normalized** — long-form imagery uses source-aware ratios and a controlled maximum width.
27. **Portrait article images become intentional editorial insets** — they are not stretched into billboard proportions.
28. **Article-card crop ratios normalized** — arbitrary square/portrait/landscape cycling was removed.
29. **Homepage story-media crop ratios normalized** — photos keep more human context.
30. **Mobile crop rules rebuilt** — mobile uses taller media frames with safer subject positioning.
31. **Page heroes vertically recentered** — text and image now feel like one composition instead of two independent columns.
32. **Page-hero spacing rebuilt** — the visual begins lower than the header and ends with a consistent chapter rhythm.
33. **Page heading scale refined by route type** — medical articles are quieter than primary landing pages.
34. **Header spacing tightened** — navigation feels deliberate rather than stretched across the viewport.
35. **Mega-menu sheet refined** — larger reading area, stronger link hierarchy, quieter address column, consistent viewport centering.
36. **CTA hover motion reduced** — buttons now use small physical movement instead of obvious template animation.
37. **Content-band rhythm increased** — sections have more breathing room and less repetitive card stacking.
38. **Service index redesigned as stronger editorial rows** — clearer number/title/description/action hierarchy.
39. **Forms upgraded with calmer focus states** — better field contrast, focus feedback, spacing, and product-like precision.
40. **Long-page finishing details added** — calculated reading time, accessible back-to-top control, and external-link indicators.

## Additional changes included in the same pass

- 4K/ultrawide spacing refined.
- Footer rhythm tightened.
- Location composition rebalanced.
- Homepage visit steps enlarged and simplified.
- Patient interface receives a restrained product frame and depth treatment.
- Article text width and line-height were corrected for long-form medical reading.
- Article sidebars are more clearly separated from clinical copy.
- All 63 HTML routes now load the V2 art-direction stylesheet.
- English, Spanish, and Armenian homepages all receive the direct-file ambulance payload.
- Reduced-motion users retain a stable, non-blank hero.
