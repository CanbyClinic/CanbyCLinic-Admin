# Canby V47 — Terminal-style ambulance opening

The homepage opening is now a pinned, scroll-controlled image-sequence hero.

- 120 desktop WebP frames at 1600x900
- 120 separately reframed mobile WebP frames at 720x1280
- direct normalized scroll -> frame mapping; scrolling backward reverses the sequence
- critical/key frames preload first; neighboring frames are prioritized in scroll direction
- no hundreds of IMG elements are inserted into the DOM; frames render into one full-viewport canvas
- dark industrial front-quarter -> moving front-side -> side branding reveal -> rear three-quarter -> bright white handoff
- the existing clinic site continues after the opening

The sequence uses five consistent, photorealistic Canby ambulance anchor renders created during this project and turns them into cinematic shots with camera crop/zoom/pan and short shot dissolves. It does not AI-generate every frame and does not use optical-flow/morph interpolation.

For a future true continuous 3D camera orbit with identical geometry at every intermediate angle, replace the anchor-shot sequence with a licensed production-grade E-450 Type III Blender model render while keeping the included scroll/canvas loader unchanged.
