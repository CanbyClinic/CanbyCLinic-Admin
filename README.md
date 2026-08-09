# Canby Clinic — Terminal-Style Ambulance Opening Prototype

This ZIP contains **only the opening homepage animation prototype**.

## What it is

- Terminal-style sticky scroll sequence
- 110 rendered JPEG frames
- Canby Clinic branded ambulance replacing the truck concept
- Dark cinematic road / medical HUD environment
- Vivid controlled palette: cyan, red, green, deep navy
- Static HTML/CSS/JS, no build step required

## How to preview

Open `index.html` in a browser, then scroll.

## File structure

```txt
index.html
assets/css/ambulance-hero.css
assets/js/ambulance-hero.js
assets/frames/canby_ambulance_frame_001.jpg ... 130.webp
```

## Notes

This is a scroll-controlled frame sequence, matching the interaction pattern from the Terminal-style reference. The ambulance is generated as a high-resolution rendered frame sequence, not a live GIF and not a stock photo.

For the final production version, the next improvement would be replacing these generated frame renders with Blender/Cinema4D renders of a true 3D ambulance model using the same frame sequence player.
