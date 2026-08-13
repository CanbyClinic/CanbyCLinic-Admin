# Canby V72.2 — Sprinter Animation Polish

This build uses the baked V58 desktop/mobile WebP sequences as the single visual source of truth.

## Fixed
- Removed the duplicate sprite ambulance layer that caused the double-car glitch.
- Removed the competing side/three-quarter/front sprite camera system.
- Camera-angle and X-ray FX now come directly from the V58 rendered frame sequence.
- Smoothed scroll rendering by coalescing work to requestAnimationFrame.
- Improved frame preload order for faster first interaction and fewer visible frame gaps.
- Extended the scroll runway slightly for a more controlled camera move.
- Reworked the end handoff into a softer late crossfade instead of an early white wash.
- Added first-frame preloads for desktop and mobile.
- Updated cache-busting to V72.2.

## QA
- 410 desktop V58 frames present.
- 410 mobile V58 frames present.
- JavaScript syntax checked with Node.
- The animation no longer instantiates the old vehicle overlay system.

A literal Lighthouse 100/100 cannot be guaranteed until the deployed URL is audited because hosting, cache headers, third-party fonts, and live network conditions affect the score.
