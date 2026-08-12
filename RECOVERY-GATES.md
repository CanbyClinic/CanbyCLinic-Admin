# Canby Terminal Animation Recovery Gates

## Locked target

Reproduce the Terminal Industries opening in motion, composition, pacing, and
cinematic structure, replacing its 18-wheeler with the uploaded Mercedes
Sprinter ambulance and keeping Canby Community Clinic branding clearly visible.

This file is the completion contract. A ZIP must not be packaged while any
required gate is marked FAIL.

## Active baseline

- Active baseline: restored clean-ambulance composite; the rejected V58 3D Sprinter sequence is no longer connected
- Desktop background: 410 V55 WebP frames
- Mobile background: 409 V55 WebP frames
- Vehicle: clean Canby ambulance render and matching X-ray overlays
- Branding: Canby Community Clinic logo and blue/green physical livery baked into every vehicle frame
- Technical vehicle: a wireframe conversion of the same model, in the same physical position
- Camera views: sunset side tracking, elevated orbit, centered front view, X-ray conversion, and windshield push-through
- Integration: reversible, direct frame-for-scroll canvas sequence pinned for 300svh
- Scroll mapping: `floor(progress * (frameCount - 1))`
- Preloading: first frame immediately, then batches of eight every 50ms

## Acceptance audit

| Requirement | Status | Evidence |
| --- | --- | --- |
| Canby logo readable at normal viewing size | PASS | The clinic logo is baked onto the upper rear body panel at large size. |
| Logo clears the sliding-door hinge | PASS | The decal ends behind the sliding-door seam and does not cross the hinge line. |
| Blue and green Canby livery | PASS | Shortened blue and green body stripes stay on the lower side panel and do not extend past the nose. |
| Headlights active in the dark section | PASS | Scene lights illuminate the road from the Sprinter's front without artificial floating lens dots. |
| Same ambulance throughout | PASS | All physical and X-ray frames come from the same uploaded Sprinter geometry. |
| Vehicle travels perfectly straight | PASS | Vehicle yaw stays at zero; its Z position advances to the stop and remains fixed there. |
| Wheel rotation follows vehicle travel | PASS | Wheel spin is calculated from the actual travel distance, freezes at the stop, and reverses automatically with frame reversal. |
| Vehicle settles before the camera orbit | PASS | Vehicle translation ends at frame 120; all later angle changes come from the camera. |
| Clinic stop has location context | PASS | The warehouse carries a baked Canby Community Clinic sign with address and phone. |
| Continuous cinematic camera progression | FAIL | The clean ambulance is restored, but its separate side/angle/front assets do not yet create a seamless camera orbit. |
| Camera motion and parallax | PASS | Warehouse, road markings, barriers, lights, and vehicle share one 3D scene, so parallax is continuous. |
| Terminal phase timing | PASS | Warm tracking, clinic stop, camera orbit, X-ray conversion, and push-through are separate timed phases. |
| Technical/wireframe transformation | PASS | The physical Sprinter fades into a cyan wireframe of the same geometry without a sprite swap. |
| Through-vehicle page transition | PASS | The camera pushes through the front and cabin before the white page handoff. |
| Production scroll length and pinning | PASS | The canvas remains sticky inside a 300svh sequence, matching the live three-viewport structure. |
| Direct reversible scroll control | PASS | Browser checks ran desktop `0 -> 119 -> 255 -> 391 -> 255 -> 119 -> 0` and portrait `0 -> 66 -> 229 -> 311 -> 409 -> 0`. |
| Guaranteed first and final frames | PASS | Desktop and portrait modes both reach frame 409 and return to frame 0. |
| Three staged title beats | PASS | The centered 112px desktop/54px mobile copy displays the three requested messages and contact details in order. |
| Navigation cleanup | PASS | The former tiny pill is replaced by a full-width 72px desktop/60px mobile bar with larger logo, links, and contact action. |
| Layer continuity | PASS | Vehicle, livery, building, X-ray, and camera are baked into one frame sequence; old sprite overlays are disabled. |
| Desktop sequence integrity | PASS | All 410 V58 WebP files are present and the browser loader reaches ready state. |
| Mobile sequence integrity | PASS | All 410 V58 portrait WebP files are present and the browser reaches frame 409. |
| JavaScript/browser health | PASS | JavaScript syntax passes and final desktop/mobile browser runs report no warnings or errors. |
| Terminal-quality material and atmosphere | FAIL | The composition and timeline now match the production structure, but the current VTK render does not yet equal Terminal's Cinema-quality materials, reflections, atmospheric depth, and fine yard detail. |
| Exact shot-for-shot visual match | FAIL | Camera beats and pacing are mapped, but the rendered imagery is still visibly an approximation rather than a vehicle-for-vehicle production composite. |

## Packaging gate

FAIL. Do not package a final ZIP yet.

The remaining production work is limited to the two visual-fidelity failures.
Passed branding, timing, camera continuity, frame-count, mobile, copy, menu, and
reversible scroll behavior must remain unchanged unless a visual-match correction
requires a tightly scoped adjustment.
