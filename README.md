# Quiet Space

A cozy, primitive-built 3D developer office. Phase 1 is an interactive prototype;
the device interfaces are deliberately placeholders, with no actual portfolio
projects, game launches, backend, audio, or rain simulation.

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
npm run build
npm run preview
```

`npm run preview` serves the built `dist/` directory, normally on port 4173;
rebuild after changes. It is a local verification server, not a production host.

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
npm run typecheck && npm run lint && npm run build
```

Review the staged diff and stage only relevant files. Preserve working features;
do not push automatically or rewrite history. There is no checked-in unit/E2E test
suite yet. Changes to interactions or visuals also need browser smoke checks as
described in `AGENTS.md`. The production build currently emits a non-failing
warning about the Three.js chunk size; report it rather than suppressing it.

## Explore

Click or tap the computer, phone, or television—or use their HTML labels and the
device navigation below the scene. Keyboard users can Tab to a device and press
Enter or Space. **Back to the office**, the panel close button, or **Escape** returns
to the overview. Focus returns to the selected device's navigation button.
Reduced-motion settings skip camera animation. If WebGL is unavailable, the HTML
navigation and device interfaces still work.

## Structure

```text
src/
  scene/
    devices.ts              # Device IDs, world transforms, camera poses
    CameraRig.tsx           # Interruptible GSAP transitions, portrait framing
    OfficeCanvas.tsx        # Renderer, lighting, failure fallback
    models/
      Office.tsx            # Room, forest, furniture, simple decorations
      Devices.tsx           # Replaceable placeholder device meshes
      InteractiveDevice.tsx # Shared pointer interaction
      Primitives.tsx        # Small reusable geometry helpers
    LabelProjection.tsx     # Projects world anchors into the main HTML tree
  state/navigation.ts       # Zustand navigation and hover state
  hooks/useReducedMotion.ts
  ui/                       # Accessible HTML interfaces and controls
  App.tsx                   # Page composition, keyboard and focus management
  styles.css                # Tailwind entry point and visual design
```

### Replacing models

Replace each device's geometry inside `InteractiveDevice` with a loaded GLB,
normalized to the existing local origin and approximate dimensions. Keep the
wrapper: it owns pointer events and device selection. Camera and label
anchors live in `scene/devices.ts`, separate from the models. Use Drei `useGLTF`
and preloading when actual assets are introduced; no model loader or external
assets are needed for this phase.

### Choices and limits

- One scene and one navigation store, without a router or physics engine.
- Device content uses HTML, keeping text crisp, responsive, and keyboard usable.
  It is a companion panel, not a fully interactive screen texture.
- The overview is intentionally composed rather than freely orbitable, so framing
  and device camera transitions remain predictable on touch and keyboard.
- Demand rendering, capped pixel ratio, one shadow-casting light, shared simple
  geometry patterns, and no postprocessing or continuously animated weather.
- Fog-colored forest layers and static window streaks suggest rain. Real rain,
  audio, detailed GLBs, and portfolio content belong to future phases.

Phase 2 is not started. Commit each completed, tested development milestone;
push only with explicit authorization.
