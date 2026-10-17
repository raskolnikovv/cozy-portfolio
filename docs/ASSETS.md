# Device asset workflow

The procedural office remains the default. No production model is configured or
downloaded yet. Replace one visual slot at a time; do not change the initial camera,
device identity, navigation, hitboxes, or HTML interfaces to accommodate an export.

## Add a model

1. Export glTF 2.0, preferably a self-contained `.glb`. Put files under
   `public/models/<slot>/`, for example `public/models/computer/computer-v1.glb`.
   Use lowercase kebab-case, case-sensitive paths, and version filenames when content
   changes. For `.gltf`, retain relative `.bin`/texture paths beside the document.
   Include authorship/license information alongside any third-party asset.
2. Normalize the export to the local contract below. Bake transforms in the DCC
   tool. Export only the device, not lights, cameras, desk, phone stand, or controller.
3. Opt in inside `src/scene/assets/catalog.ts`:

   ```ts
   export const modelAssets: Partial<Record<ModelId, ModelAsset>> = {
     computer: { path: 'models/computer/computer-v1.glb' },
   }
   ```

   Paths have no leading slash; the loader prefixes Vite's `BASE_URL`. Small
   `position`, `rotation` (XYZ radians), or uniform `scale` adjustments are available
   on an entry to normalize an export. These affect the visual only. Prefer a
   corrected export rather than compensating in camera/navigation code.
4. Run all validation commands in `AGENTS.md`. In Chromium, verify loading, failed
   requests, pointer and touch hitboxes, screen alignment, phone pickup, Back/Escape,
   keyboard focus, reduced motion, and portrait/landscape. Check network sizes and
   draw calls before accepting the replacement. Then smoke-test `npm run preview`.
5. Remove the catalog entry to restore the procedural visual. Retain those
   placeholders: they also serve as loading/error fallbacks.

## Coordinate and screen contract

Use one glTF unit per existing scene unit, Y up, X right, and **+Z toward the
visitor/screen front**. Scene dimensions are art-directed; do not rescale the room
to match a real monitor. Root rotation is zero and uniform scale is one after
normalization. Name the root `<slot>_root`; meaningful mesh names such as
`housing`, `screen_surface`, and `stand` help maintenance but are not runtime IDs.

| Visual slot | Local origin and main housing reference | Screen center XYZ | Screen width × height |
| --- | --- | --- | --- |
| `computer` | Desk contact center, Y=0; full assembly fits ~2.03 × 1.56, centered at (0, .78, 0) | (0, .91, .081) | 1.88 × 1.10 |
| `phone` | Bottom center, Y=0; housing .47 × .94 × .075, centered at (0, .5, 0) | (0, .5, .052) | .40 × .80 |
| `television` | Feet contact center, Y=0; housing 2.20 × 1.35 × .13, centered at (0, .88, 0) | (0, .9, .09) | 2.03 × 1.17 |
| `console` | Hardware center (0, 0, 0); housing .64 × .21 × .60 | None; uses TV | None |

Screen rectangles lie in the local XY plane facing +Z, without tilt or curvature.
The visible glass must fit these rectangles without a bezel covering the content.
An optional `screen_anchor` empty can mark the listed center in the export, but
the application deliberately does **not** discover anchors or camera targets from
GLB node names. `devices.ts` is authoritative. Test the final export against it.

`television` and `console` are separate visual slots but both navigate to device ID
`console`. The console hardware's parent uses `getConsolePosition` to support both
layouts. The phone's existing parent owns pickup/rotation/scale; its stand stays on
the desk. Hover affects visual scale; hitboxes remain stable. Loaded model materials
are static; the active HTML screen still appears on arrival. Custom idle screen
artwork or model animations require a later, separately tested change.

## Loading, failure, and ownership

- `AssetVisual` wraps each slot in a local Suspense and error boundary. Slow,
  missing, malformed, empty, or unsupported assets retain the original placeholder;
  they do not suspend the room or disable navigation. A discreet main-DOM live
  status announces loading/failure. Failure has no automatic retry loop; reload
  after correcting the deployment, or update the versioned catalog path.
- `GltfModel` uses Drei `useGLTF`, clones the scene per mounted instance (including
  skeleton ownership), and enables mesh shadows. Cached geometries/materials are
  shared and not disposed on unmount. Do not mutate shared materials or call
  `useGLTF.clear` on an in-use model. Keep the small finite asset cache; an unbounded
  dynamic catalog would need an explicit resource lifecycle.
- Draco and Meshopt decoding are disabled. There are no remote decoder requests.
  Start with ordinary glTF geometry and embedded PNG/JPEG textures. KTX2, compressed
  geometry, animation playback, and custom decoder hosting are not configured.
- The model loader and its dependencies are split from the normal scene. No model
  entry means no loader/model request. Configured devices are already visible, so
  their models load on scene mount. Do not preload a hypothetical future library.

## Performance review

Initial review budgets per replacement: at most **2 MB**, **20k triangles**, and
**8 material slots**, with textures normally at most **1024²**. These are starting
budgets to measure against, not proof of mobile performance. Prefer shared materials,
opaque surfaces, restrained textures, and fewer draw calls over dense detail.

Preserve demand rendering, capped DPR, existing lights/shadow budget, frustum
culling, and the accessible HTML fallback. Do not add idle animation loops or lights
inside GLBs. Check shader/texture upload stalls and GPU memory on a physical phone;
desktop software WebGL and device emulation cannot establish real-device FPS.

The Phase 1.6 review records the actual baseline and result in `README.md`. Compare
build gzip totals and the browser's requested chunks, not just the largest filename.
The existing Three.js size and upstream Clock warnings remain visible.
