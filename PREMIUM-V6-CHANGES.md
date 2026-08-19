# Canby Community Clinic — PREMIUM V6

## Locked site, replaced homepage animation

- Kept the website structure and page content locked.
- Replaced the broken ambulance/WebGL intro on the homepages with a reliable scroll-driven 4K-style typography hero.
- Removed the heavy embedded ambulance payload, fallback frame blob, and cinematic WebGL script from `index.html`, `es.html`, and `hy.html`.
- Added `assets/css/canby-scroll-hero-v6.css`.
- Added `assets/js/canby-scroll-hero-v6.js`.
- Added progressive text reveal states:
  - CANBY
  - CANBY COMMUNITY CLINIC
  - PRIMARY CARE IN RESEDA
- Added a green scroll progress line and a green reveal edge on the text.
- Kept the hero fail-open and file-open safe: it works from `file://` and does not depend on 3D loading.
- Preserved the rest of the site.
