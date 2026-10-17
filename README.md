# Quiet Space

An immersive, first-person developer portfolio. The full-viewport office is the
interface: a computer straight ahead, a smartphone on the right, and a TV/console
on the left, with a rainy forest outside the window.

**Phase 1.5** replaces the earlier editorial landing page and isometric diorama.
Device screens are interactive prototypes: web-project tabs, an app launcher, and
a game library with a reserved Pirate Battle entry. There are no real applications,
playable games, backend, audio, or rain simulation yet.

## Develop

Use Node.js **22.12+** and npm; `.node-version` pins the validated **24.19.0**.
Run these commands from the repository root:

```sh
npm ci
npm run dev
```

The dev server listens on all interfaces, normally port 5173. To require that port,
use `npm run dev -- --port 5173 --strictPort`. If the machine's default npm
cache is read-only, prefix installation with
`NPM_CONFIG_CACHE=/tmp/cozy-npm-cache`.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

`npm run preview` serves the built `dist/` directory, normally on port 4173;
rebuild after changes. It is a local verification server, not a production host.

### Deploy to Netlify

Import the repository as a Vite site, using these build settings:

| Setting | Value |
| --- | --- |
| Base directory | Repository root (leave blank) |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node.js | Use the committed `.node-version` (24.19.0) |
| Application environment variables / API keys | None |

Keep `package-lock.json` committed and install build-time devDependencies: Vite,
TypeScript, and Tailwind are needed to generate `dist/`. The deployed site serves
only static output; it does not run Node, Vite, or `npm run preview` on requests.
For a manual upload, build first and upload the contents of `dist/`, not the source
checkout. Do not enable a server-rendering adapter or add functions for this app.

Vite's default root base and `/favicon.svg` are correct for a Netlify site served
at the domain root; JavaScript, CSS, and lazy scene chunks are emitted into
`dist/assets/`. All current geometry and device interfaces are bundled locally;
there are no external models, textures, fonts, or runtime API dependencies.

No `netlify.toml` is needed for these standard build settings. Device navigation
uses Zustand without changing the URL, so there are no client-side routes and no
SPA rewrite is required. If URL routes are introduced later, add a fallback such
as `/* /index.html 200` in `public/_redirects` and recheck direct visits/reloads.

Before deploying, run the validation commands below and smoke-test the built site
with `npm run preview`, including all three devices. After the first real Netlify
deploy, check its HTTPS URL on desktop and a physical phone, confirm the favicon
and lazy scene chunks return successfully, and check the browser console. Local
production validation does not establish that Netlify's build or deployment ran.
Known limitations are the Three.js bundle-size/Clock warnings and device-specific
WebGL performance; the HTML fallback remains available without WebGL.

### Cloud development

Use the existing checkout at `/workspace/cozy-portfolio`. Cloud tasks are already
isolated; create a separate Git worktree only when explicitly requested.

```sh
cd /workspace/cozy-portfolio
NPM_CONFIG_CACHE=/tmp/cozy-npm-cache npm ci
npm run dev -- --port 5173 --strictPort
```

Use the prepared dependencies if already present and consistent with the lockfile;
reinstall when needed. Keep the server in a persistent execution session, inspect
startup errors, and verify the returned page contains the Quiet Space title.
Server processes must restart in new tasks even when dependencies are restored.
The Cloud environment draft stores installation and startup instructions; review,
save, and publish in environment settings to make that configuration reusable.
Saving a draft alone does not run scripts or publish a snapshot. No environment
variables, credentials, or external services are required.

### Previewing on a mobile device

| Option | How it works | Limits |
| --- | --- | --- |
| Local Wi-Fi/LAN | Run `npm run dev -- --port 5173 --strictPort` on your computer. Connect the phone to the same network and enter `http://<computer-lan-ip>:5173` in its browser. Use your computer's LAN address, not `0.0.0.0` or the phone's loopback address. | The computer must remain running; its firewall and Wi-Fi must allow device-to-device connections. For a built preview, run `npm run build` then `npm run preview -- --port 4173 --strictPort` and use port 4173. |
| Cloud port forwarding | If the Cloud provider offers an authenticated forwarded port or HTTPS preview URL, forward 5173 and open the provider-issued URL on the phone. | This onboarding UI does not currently provide a supported web preview link. A container's private IP or loopback address is not reachable from your phone. Publishing an environment snapshot does not deploy the website. |
| Approved tunnel | A separately configured HTTPS tunnel can forward the dev or preview server to a phone-accessible URL. | Requires a tunnel service, suitable access controls, and explicit authorization before exposing the server. No tunnel is configured by this project. |
| Static preview deployment | After an explicitly authorized deployment, open the hosting provider's HTTPS URL. Build with `npm run build` and publish `dist/`. | Requires a hosting destination and deployment setup; none is currently configured. |

Desktop browser device emulation is useful for checking layout before using a
phone, but it does not replace real touch/WebGL performance testing. On the phone,
check all three devices, Back, portrait/landscape, and the system's reduced-motion
setting. Never enable unrestricted Vite host access (`allowedHosts: true`) simply
to resolve a forwarded-host error; allow only the specific trusted host if needed.

### Development workflow

Read [AGENTS.md](AGENTS.md) for the project conventions and contribution workflow.
Make small, focused milestones and commit each completed, tested milestone using
Conventional Commits, for example `docs(workflow): document development conventions`.
Before every commit, including documentation changes, run:

```sh
npm run typecheck && npm run lint && npm test && npm run build
```

Review the staged diff and stage only relevant files. Preserve working features;
do not push automatically or rewrite history. `npm test` uses Node's built-in test
runner and type stripping, without another test dependency. Its six regression
tests cover atomic entry, cancellation, stale completion, hover guards, eye-level
room bounds, and viewport/screen fitting. UI and visual changes also need browser
smoke checks as described in `AGENTS.md`. The production build emits a non-failing
Three.js chunk-size warning; R3F also triggers an upstream `THREE.Clock` deprecation.
Report these warnings rather than suppressing them.

## Explore

Click or tap a device, its scene label, or an entry in the discreet device menu.
Keyboard users can Tab to controls and press Enter or Space.

- **Computer:** the camera approaches the monitor and an HTML browser aligns with
  its screen. Switch between three project tabs; Left/Right, Home, and End also
  navigate tabs. Content is explicitly placeholder material.
- **Phone:** the phone lifts off its stand while the camera approaches. Tap Notes,
  Weather, Focus, or Habits to open a placeholder app. **All apps** returns to the
  launcher and restores focus. Selection survives orientation changes.
- **TV or console:** the TV activates and displays a game library. Select Pirate
  Battle or another entry for a placeholder launch screen; **Game library** returns.
  No game engine or actual game is loaded.

**Back to Office** or **Escape** returns to the original office pose and restores
focus. Entry is locked during camera travel; Back/Escape can cancel safely. Desktop
pointer movement adds bounded look motion. Touch uses a stable camera. Reduced-motion
settings skip travel, pickup, and pointer look. If WebGL is unavailable, use the
menu to access the same HTML interfaces. No separate traditional portfolio route
has been built.

## Structure

```text
src/
  scene/
    devices.ts              # Placements, screen bounds, responsive camera poses
    CameraRig.tsx           # GSAP travel and bounded desktop pointer look
    OfficeCanvas.tsx        # Renderer, lighting, WebGL/error fallback
    LabelProjection.tsx     # World-anchored HTML navigation labels
    ScreenProjection.tsx    # HTML rectangles aligned with physical device screens
    models/
      Office.tsx            # Room, forest, furniture, simple decorations
      Devices.tsx           # Replaceable devices and phone pickup animation
      InteractiveDevice.tsx # Shared guarded pointer interactions
      Primitives.tsx        # Small reusable geometry helpers
  state/navigation.ts       # View, hover, transition lock and generation IDs
  hooks/useReducedMotion.ts
  ui/
    DeviceExperience.tsx    # Screen composition and readiness/focus handling
    SceneLabels.tsx         # Accessible device entry controls
    devices/                # Computer, phone, and console HTML interfaces
    Icon.tsx
  App.tsx                   # Full viewport, minimal HUD/menu, Escape, return focus
  styles.css                # Tailwind entry, HUD and responsive screen interfaces
tests/navigation.test.mjs    # Six native Node navigation/framing regressions
```

### Replacing models

Replace geometry inside `InteractiveDevice` with a normalized GLB, retaining its
device identity, interaction wrapper, and phone animation boundaries. World
placements and local screen bounds live in `scene/devices.ts`; navigation does not
inspect mesh internals. Keep the stand separate from the animated phone. Use Drei
`useGLTF` and preloading when actual assets are introduced.

### Camera and screen rendering

The initial camera sits inside the room at eye level, with a 52° perspective field
of view. Portrait layouts compact the devices and adjust distance while keeping
the camera inside. Desktop pointer look uses a damped, bounded target offset; there
is no FPS/WASD movement or unrestricted orbit.

Zustand locks entry atomically and assigns transition IDs. GSAP moves camera position
and target over 0.9 seconds, killing superseded timelines; only the current ID can
complete travel. The phone has a separate 0.75-second lift/scale/orientation tween.
Reduced motion makes these operations immediate. Back can interrupt a move.

Focused cameras face device screen planes directly. `ScreenProjection` projects
their corners into a rectangle in the main HTML tree, so text stays crisp and the
interface sits inside the visible bezel. It is hidden/inert during travel, then
focused on arrival. Local nested state stays mounted during reframing and resets
when leaving the device. This intentionally avoids a browser engine, extra React
roots, iframe integration, or interactive screen textures. Future React/PixiJS
content can mount in `ConsoleInterface`'s bounded game viewport.

### Validation and current limits

The Phase 1.5 review exercised Chromium at 1440×900, 390×844, 320px portrait, and
844×390 landscape. Checks covered actual mesh clicks/taps (including console
hardware), camera destinations, bounded look, tabs, nested app/game screens,
Back/Escape, rapid input/cancellation, focus restoration, reduced motion,
orientation persistence, production loading, accessibility scans, and a genuinely
WebGL-disabled fallback. Normal rendering produced no runtime errors. Browser
emulation does not establish physical-phone GPU performance or Safari compatibility.

Review screenshots are local, ignored artifacts in `.local/review/`:
`desktop-office.png`, `computer-focused.png`, `phone-focused.png`,
`console-focused.png`, and `mobile-office.png`. They are not application assets or
an automated visual baseline; recapture them after relevant changes.

Demand rendering, capped DPR, one shadow-casting light, simple low-poly geometry,
and lazy scene loading keep the prototype modest. Static streaks and layered forest
geometry suggest the weather. Detailed assets, real projects/games, rain simulation,
and audio belong to separately authorized future milestones. Preserve the immersive
first-person entry point; do not return it to a conventional landing page or diorama.
