# Canby V72 Sprinter Build

This package combines the recovered V72 website code with the approved V58 white Canby Sprinter ambulance animation assets.

Animation controller fixes:
- Desktop frames: assets/ambulance/desktop-v58 (410 WebP frames)
- Mobile frames: assets/ambulance/mobile-v58 (410 WebP frames)
- Supporting sprites: sprites-v55, sprites-v56, sprites-v57
- Controller updated from v55 frame paths to v58 frame paths
- Mobile frame count corrected from 409 to 410
- Cache-busting query added to the homepage animation JS/CSS references

Deployment note: this recovered code-only source intentionally does not contain the site's non-animation PNG/WebP/JPG image library. When deploying to the existing CanbyCLinic-Admin repository, overlay this package on top of the existing repository rather than deleting the existing image assets first.
