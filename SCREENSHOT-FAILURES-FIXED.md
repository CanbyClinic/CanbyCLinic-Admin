# Screenshot failures fixed

## 1. Ambulance missing
**Cause:** the previous renderer used `fetch()` for `scene.gltf` and `scene.bin`. Chrome blocks that pattern when `index.html` is opened directly as a local `file://` document.

**Fix:** the GLTF JSON, model binary, and ambulance textures now have an embedded local-file-safe loading path. The normal hosted loading path remains available as a secondary path.

## 2. Giant headings overlapping
**Cause:** hero states switched classes at hard thresholds while opacity/transform transitions were still running. The previous state could remain visible while the next state entered.

**Fix:** the three copy states now use independent scroll envelopes with explicit computed opacity and visibility. Two full-size headings cannot occupy the hero simultaneously.

## 3. Large blank cream section
**Cause:** the final hero handoff started around 91% progress while the hero itself occupied 238vh. The screen could become mostly paper-colored before the next content chapter arrived.

**Fix:** the hero is shorter and the paper handoff begins only during the last 2.5% of the sequence.

## 4. People cropped badly
**Cause:** the previous Awwwards layer assigned pseudo-random `object-position` values and forced unrelated source photographs into rotating aspect ratios.

**Fix:** random focal placement is removed. Source-image dimensions now determine a clamped editorial ratio, portrait sources are handled explicitly, people imagery biases upward, and parallax movement is reduced.
