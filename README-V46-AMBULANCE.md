# Canby Clinic V46 — Ambulance Cinematic

This build replaces the previous procedural medical-map hero with a scroll-controlled ambulance cinematic.

## Included
- 96 pre-rendered 1280×720 WebP frames from one consistent 3D scene
- Canby Community Clinic logo physically mapped onto 3D side planes during rendering
- front-quarter → side tracking → rear-three-quarter camera progression
- wheel rotation and moving road markers
- dark-to-light transition into the existing clinic homepage
- direct scroll-to-frame control with interpolation for trackpad smoothness
- reverse-scroll support
- sticky canvas hero
- prioritized nearby-frame loading and sparse timeline preloading
- mobile framing bias and reduced-motion support
- source renderer: `assets/ambulance/render_source_v46.py`

## Run
This is a static website. Open `index.html` through any static server. Example:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.
