# Canby Community Clinic — Terminal Lock V3

## Creative lock

The hero is no longer a new ambulance animation concept.

**Terminal Industries is the choreography source.** The Canby ambulance occupies the truck role while the site keeps its existing clinic content and page architecture.

### Scroll movie structure

1. **Opening / side authority** — low, side-dominant ambulance against a warm industrial sunset.
2. **Tracking** — vehicle travels laterally through the yard; no turntable and no generic orbit.
3. **Yard reveal / elevation** — camera rises and the environment reveals through layered parallax while the ambulance remains the visual subject.
4. **Light sweep** — directional warm light moves through the scene rather than using a decorative overlay.
5. **Physical → technical** — the ambulance dissolves toward a registered technical/system state.
6. **Connected system** — near-black environment with restrained nodes, rings, connections and technical depth; no medical cliché graphics.
7. **Release / handoff** — technical chapter resolves into the warm-light clinic site.

The animation maps directly to scroll progress and reverses when the user scrolls backward. There is no autoplay timer.

## Reliability strategy

- Primary path: production Canby GLTF ambulance renderer.
- `file://` compatibility: ambulance GLTF/BIN data remains embedded.
- WebGL/model failure path: locked 2D Terminal-structure frame sequence on a high-DPR canvas.
- Fallback is still scrubbed by scroll and reverses correctly.
- Old oversized hero copy is suppressed inside the movie to prevent text collisions and preserve the cinematic sequence.

## V3 color system

The rest of the site retains the approved structure but moves away from a flat teal/cream medical palette.

| Role | Color | Hex |
|---|---|---|
| Deep forest ink | Navigation, footer, high-contrast UI | `#071816` |
| Secondary forest | Dark surfaces | `#0B2724` |
| Warm bone | Main paper/background | `#F4EFE5` |
| Warm white | Reading surfaces | `#FBF8F1` |
| Eucalyptus mist | Alternating chapters | `#DCE8E3` |
| Mineral blue | Care / homepage accent | `#1B6074` |
| Botanical green | Patient accent | `#438B6D` |
| Soft chartreuse | Tiny high-attention details only | `#A8D85F` |
| Terracotta | Health editorial accent | `#DB6748` |
| Muted plum | Community / volunteer accent | `#76536A` |

### Page-family color identities

- **Home + Care:** mineral blue
- **Patients:** botanical green
- **Health articles:** terracotta
- **Community:** muted plum
- **Clinic/About:** deep eucalyptus
- **Legal/Policy:** neutral gray-green

The page never relies on rainbow gradients. Accent colors are used as controlled editorial signals while the base remains forest ink + warm paper.

## V3 verification

- 63 HTML pages checked
- 2,937 local/internal link references checked
- 240 hash targets checked
- 698 local asset references checked
- 0 missing local assets
- 0 broken internal HTML links
- 0 broken hash targets
- 0 duplicate IDs
- 0 pages with incorrect H1 counts
- 8 JavaScript files parse with `node --check`
- 6 CSS files have balanced structure
- all 3 language homepages load the Terminal-lock renderer + fallback
- production GLTF and BIN files are present

## Visual verification limitation

This environment cannot reliably initialize a GPU-backed Chromium/WebGL context, so the final rendered 3D frames cannot be truthfully signed off here from live browser screenshots. Static implementation, model dependencies, scripts, fallback sequence, route integrity and asset integrity are verified. Final launch QA should include Chrome, Safari and iPhone Safari with real GPU rendering.
