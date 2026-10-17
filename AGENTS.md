# Quiet Space development guide

## Product contract

Quiet Space is an immersive, first-person 3D developer portfolio. The visitor is
inside a cozy office; the office itself is the primary interface. Phase 1.5 provides
procedural models and interactive device prototypes, not real projects or games.

**Never convert the main experience back into a conventional landing page,
dashboard, or small embedded 3D diorama unless explicitly requested.** Keep the
scene full viewport, the camera inside the room at human eye level, and the HUD
minimal. Do not add a traditional portfolio route without a separate request.

- Center: computer → a browser with selectable placeholder web-project tabs.
- Right: smartphone → simulated pickup, app launcher, and placeholder app screens.
- Left: TV and console → game library and placeholder launch screens. Pirate Battle
  has a reserved entry; it is not integrated or playable yet.
- Warm wood and interior lighting contrast with a rainy forest, distant mountains,
  and mist. Keep the stylized low-poly look, plants, books, and sleeping cat.
- Prioritize composition, recognizable devices, readable screens, and interactions.
  Detailed GLBs, real applications, game integration, complex rain, and audio await
  explicit future milestones. Preserve working features; avoid unrelated refactors.

## Stack and organization

Use the existing React, strict TypeScript, Vite, Three.js, React Three Fiber, Drei,
GSAP, Zustand, and Tailwind CSS v4 stack. No backend, router, physics engine, or
additional dependency is currently needed.

| Location | Responsibility |
| --- | --- |
| `src/App.tsx` | Full-viewport composition, discreet HUD/menu, Escape and focus restoration |
| `src/state/navigation.ts` | `office / computer / phone / console`, hover, travel lock, transition IDs |
| `src/scene/devices.ts` | Shared device placements, screen bounds, responsive camera poses |
| `src/scene/CameraRig.tsx` | GSAP travel, bounded pointer look, reduced motion |
| `src/scene/OfficeCanvas.tsx`, `models/` | Renderer, lights, fallback, room and replaceable device geometry |
| `src/scene/LabelProjection.tsx`, `ScreenProjection.tsx` | Main-DOM labels and screen alignment |
| `src/ui/DeviceExperience.tsx`, `src/ui/devices/` | Accessible browser, app launcher, game library and nested screens |
| `src/hooks/`, `src/styles.css`, `tests/` | Shared hooks, responsive styling, native Node regression tests |

Follow nearby code: two spaces, single quotes, no semicolons, ES modules, functional
components/hooks, PascalCase component files, and camelCase values. Use `import
type`, typed device IDs, and narrow Zustand selectors. Keep transient interface
state local. Avoid `any`, unexplained assertions/suppressions, speculative
abstractions, dependency churn, and weakening TypeScript or lint settings.

## Camera, navigation, and asset boundaries

- Use a perspective camera with a natural field of view (currently 52°). Preserve
  eye-level framing and keep all devices visible across viewport sizes. Compact
  layouts adjust placements and camera distance without leaving the room.
- Desktop pointer look changes only a small, damped look offset. No unrestricted
  orbit, FPS/WASD movement, or accidental camera escape. Touch uses a stable camera.
- Navigation entry locks atomically. Ignore conflicting device requests while
  traveling or inside another device. Back/Escape can interrupt travel; stale
  completion IDs must never unlock a newer transition. Clean up GSAP timelines.
- Device UI is HTML in the main React tree, aligned with the physical screen after
  camera arrival. Active cameras face screen planes directly. Keep hidden/traveling
  interfaces inert and preserve nested selection when resizing/reframing.
- Normalize future GLBs to the existing origin/dimensions inside the interaction
  wrapper; retain device identity, hit handling, and phone animation boundaries.
  Update screen anchors/placements in `devices.ts` rather than coupling camera or
  navigation to mesh internals. Keep the phone's stand on the desk during pickup.
- A future React/PixiJS game can mount inside `ConsoleInterface`'s game viewport;
  do not add an engine or embed Pirate Battle until requested.

## Accessibility, mobile, and performance

Keep named HTML controls alongside mesh interactions. Support Tab, Enter/Space,
arrow-key project tabs, visible focus, readable AA contrast, live status, and usable
touch targets. Never rely on hover or color alone. Focus a ready device interface;
restore its label (or fallback menu button) on exit. Nested app/game Back controls
restore launcher focus. Keep the device menu keyboard usable and Escape dismissible.

Respect live `prefers-reduced-motion`: skip camera travel, phone animation, pointer
look, and decorative CSS motion. If WebGL fails, the menu and every HTML device
interface must remain functional. Test desktop, 320px/390px portrait, and landscape;
prevent viewport overflow, clipped navigation, unreadable screens, and UI overlap.
Use scrollable device content on small screens instead of obscuring the room with
an unrelated modal. Physical-device testing complements browser emulation.

Preserve demand rendering, explicit invalidation during motion, capped DPR (1–1.5),
lazy scene loading, and one 1024px shadow-casting light. No continuous idle loops or
heavy postprocessing. Reuse vectors/resources, avoid per-frame React state updates,
and inspect draw calls, bundle sizes, and mobile smoothness before adding cost.

## Validation and Git workflow

Use the Node version in `.node-version` (24.19.0; supported minimum 22.12) and npm.
See [README.md](README.md) for local/Cloud startup and mobile preview options. Cloud
tasks are already isolated: use `/workspace/cozy-portfolio`; do not create a Git
worktree unless requested. No credentials, environment variables, or backend are
required. Live server processes must restart in new tasks.

1. Inspect `git status`, active branch, relevant code, and existing user work.
   Preserve unrelated changes and untracked files; use small, focused milestones.
2. Run against final changes before **every** commit, including documentation:

   ```sh
   npm run typecheck && npm run lint && npm test && npm run build
   ```

3. Native Node tests cover navigation races and camera/screen framing. For UI,
   camera, scene, or state changes, also verify all mesh and HTML entry points,
   screen alignment, tabs/apps/games, rapid clicks, cancellation, Back/Escape,
   focus, keyboard, touch, resize/orientation, reduced motion, and WebGL fallback.
   Check console errors and visually review desktop/mobile screenshots. Smoke-test
   the production build with `npm run preview`; use accessibility scans when available.
4. Fix failures before committing. Report actual passed/failed/skipped checks and
   warnings separately. Known non-failing warnings: Three.js's >500 kB raw chunk
   and an upstream `THREE.Clock` deprecation. Do not hide warnings or disable checks.
5. Stage explicit milestone paths, review `git diff --cached`, and run
   `git diff --cached --check`. Exclude secrets, dependencies, build output, and
   unrelated work. Local screenshots in `.local/review/` are ignored artifacts.
6. Commit each completed, tested milestone with a descriptive Conventional Commit,
   such as `feat(office): improve first-person device framing` or
   `docs(workflow): document immersive experience standards`.
7. Report changes, validation, branch, and commit hashes. Never push automatically
   or amend, rebase, reset, force-push, or rewrite history without authorization.
