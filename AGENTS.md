# Development guide

## Purpose and scope

Quiet Space is a personal portfolio imagined as a cozy, stylized low-poly developer
office. Phase 1 is working: primitive models, three device destinations, cinematic
camera transitions, and placeholder interfaces. Preserve these behaviors. Begin
Phase 2, real portfolio content, playable games, GLB integration, audio, or complex
rain only when explicitly requested. Prefer the smallest maintainable solution;
avoid speculative abstractions, unrelated refactoring, and dependency churn.

## Visual direction

- Warm interior lighting, wooden furniture, muted greens, cream, and clay accents.
- A peaceful rainy forest, distant mountains, and atmospheric mist outside; no city
  skyline or sunset. Rain is currently suggested by static window marks.
- Keep the computer centered, smartphone on the desk's right, and TV/game console
  on the left. Devices must remain recognizable and easy to select.
- Preserve the plants, sleeping cat, uncluttered composition, and calm indie-game
  mood. Prioritize framing and interaction over decorative complexity.
- Camera moves should feel smooth and cinematic, remain interruptible, and return
  reliably to the overview. The overview is composed, not freely orbitable.

## Architecture

The stack is React, strict TypeScript, Vite, Three.js, React Three Fiber, Drei,
GSAP, Zustand, and Tailwind CSS v4. There is no backend or router.

| Location | Responsibility |
| --- | --- |
| `src/App.tsx` | Page composition, keyboard handling, focus restoration |
| `src/state/navigation.ts` | Shared view, hover, and camera-transition state |
| `src/scene/devices.ts` | Typed device registry, model transforms, label anchors, camera poses |
| `src/scene/OfficeCanvas.tsx` | Renderer, lights, loading/error and WebGL fallbacks |
| `src/scene/CameraRig.tsx` | GSAP camera transitions and responsive framing |
| `src/scene/models/` | Replaceable geometry, room, furniture, and pointer interaction |
| `src/scene/LabelProjection.tsx` | Projects world anchors into existing HTML label elements |
| `src/ui/` | Accessible HTML labels, controls, device panels, and native dialog |
| `src/hooks/`, `src/styles.css` | Shared hooks, Tailwind entry point, responsive styling |

Keep scene rendering, camera logic, application state, and HTML UI separate. Use
Zustand selectors for shared navigation; keep temporary UI state local. Device
content and labels belong in the main React DOM tree, not additional React roots
or screen textures. Preserve the projection's camera-matrix update.

For future GLBs, replace geometry inside `InteractiveDevice`, retaining its event
wrapper and registry identity. Normalize models to the existing local origin and
dimensions; adjust intentional anchor changes in `devices.ts`. Keep navigation
and camera behavior independent of model internals. Load assets only when needed.

## Coding conventions

- Follow nearby code: two-space indentation, single quotes, no semicolons,
  functional components, hooks, and ES modules. Use `import type` for type imports.
- Use PascalCase for components/component files, `useCamelCase` for hooks, and
  camelCase for functions and values. Reuse typed device IDs and configuration.
- Keep TypeScript strict. Avoid `any`, unexplained type assertions, and lint/type
  suppressions. Fix causes instead of weakening configuration.
- Keep components focused; extract shared behavior when duplication warrants it.
  Clean up GSAP timelines, subscriptions, and listeners. Support Strict Mode.
- Use existing Tailwind utilities and semantic CSS classes; respect responsive
  breakpoints and reduced-motion rules. Do not add a second styling system.
- Install with `npm ci`. Change manifests/lockfiles only for an intentional
  dependency change; justify new dependencies and keep the lockfile consistent.

## Accessibility and responsive behavior

- Every device must remain usable by mouse, keyboard, and touch through named HTML
  buttons as well as scene interactions. Never require hovering to discover or act.
- Preserve Tab navigation, Enter/Space activation, visible focus, and readable
  contrast. Do not convey state through color alone; provide usable touch targets.
- Selecting a device focuses its panel heading. Back, close, and Escape return to
  the office and restore focus to the device navigation. Preserve dialog focus
  containment, Escape dismissal, and return focus.
- Keep semantic headings, accessible names, navigation state, and live status
  announcements. Decorative graphics should not add screen-reader noise.
- Honor live `prefers-reduced-motion` changes: skip camera travel and suppress
  decorative CSS motion. Keep the HTML workflow usable when WebGL fails.
- Check narrow screens (including 320px), portrait/landscape, and desktop. Prevent
  horizontal overflow, overlapping labels, and panels obscuring the selected device.

## Performance

Preserve demand rendering, explicit invalidation during camera animation, capped
pixel ratio (currently 1–1.5), lazy scene loading, and one shadow-casting light with
a 1024px shadow map. Do not introduce continuous idle animation or postprocessing
without a clear need. Reuse geometry/materials where practical; keep assets small.
Avoid allocations and React state updates in frame callbacks. When adding visual
cost, inspect draw calls, asset/bundle sizes, and camera smoothness on mobile;
optimize measured problems rather than adding complexity preemptively.

## Running and validation

See [README.md](README.md) for local/Cloud startup and mobile preview options. Use
the Node version in `.node-version` (validated: 24.19.0); the supported minimum is
22.12. No environment variables, credentials, or external services are required.
Cloud tasks are already isolated: use `/workspace/cozy-portfolio` and do not create
a Git worktree unless requested. Run the server in a persistent execution session;
processes must restart after a new Cloud task or snapshot restoration.

Run all three checks against the final changes **before every commit**, including
documentation milestones:

```sh
npm run typecheck && npm run lint && npm run build
```

There is no checked-in unit/E2E suite or `npm test` command. These checks do not
prove visual behavior. For UI, scene, camera, or state changes, also run the app
and smoke-test all three devices: geometry clicks and hover, HTML controls, panel
content, camera arrival, rapid switching, Back/close/Escape, and focus restoration.
Check keyboard, touch, resizing, reduced motion, WebGL fallback, and browser console
errors. Inspect the changed views visually. For rendering/loading changes, also
serve the production build with `npm run preview`; use a browser accessibility
scanner when available. Documentation-only work requires the three commands and
review of command/path accuracy, without adding a test framework.

Report checks actually executed, failures, skipped checks, and warnings distinctly.
Vite currently warns that the Three.js chunk exceeds 500 kB before compression;
the build succeeds. Do not suppress that warning or disable checks to claim success.

## Git workflow

1. Inspect branch, status, and relevant files before editing. Preserve existing
   edits and untracked files. Do not change unrelated files or start another phase.
2. Complete one small, focused milestone. Update documentation when behavior or
   setup changes; verify existing working features still behave correctly.
3. Run the required checks above and any relevant smoke tests. Fix failures before
   committing; report external blockers instead of making an unverified commit.
4. Stage explicit paths for that milestone. Review `git diff --cached` and run
   `git diff --cached --check`; do not sweep unrelated or pre-existing untracked
   files into a commit. Never include secrets, generated output, or dependencies.
5. Create a commit after each completed, tested milestone. Use a concise,
   descriptive Conventional Commit subject: `type(scope): imperative summary`.
   Examples: `docs(workflow): document development conventions`,
   `fix(camera): preserve phone framing in portrait`,
   `feat(scene): add a replaceable desk model`. Scope is optional; use `docs`,
   `feat`, `fix`, `refactor`, `test`, `perf`, or `chore` as appropriate.
6. Report the checks, commit hash, branch, and remaining work. Do not push unless
   explicitly authorized. Do not amend, rebase, reset, force-push, or otherwise
   rewrite Git history without explicit authorization.
