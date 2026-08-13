# PRODUCTION MODEL ACQUISITION GATE

STATUS: BLOCKED — DO NOT BEGIN BEAUTY RENDER

The approved Final Two-Stage Production Directive requires a high-quality American Type III ambulance
close to the locked 6.85m x 2.45m x 2.80m envelope.

## Project assets inspected
- Old Type-I donor: REJECTED by directive.
- Sprinter source: REJECTED by directive.
- PREVIS-D dimensional proxy: CAMERA USE ONLY; not a production model.
- Previous CANBY_AMBULANCE_FINAL_A output: visually confirmed to still be low-detail proxy geometry.

## Why Stage A stops here
The geometry gate must happen before final materials, livery, sunset lighting, or six beauty frames.
Using the proxy would invalidate the gate and force a later camera/material rebuild.

## Acceptable incoming source
Provide a legitimately licensed Type III ambulance in one of:
- FBX
- OBJ + textures
- GLB / glTF
- Blender source

Target:
- near locked dimensions
- realistic cab/module proportions
- detailed wheels/tires
- real mirrors/grille/headlights
- compartment doors/seams/hinges/latches
- proper emergency light housings
- clean UVs / PBR-capable materials
- close-shot geometry quality

Once present, the next exact operation is:
1. normalize to locked envelope
2. render 4 clay geometry frames
3. mark geometry categories PASS/FAIL
4. only then begin Canby livery/material/lighting work
