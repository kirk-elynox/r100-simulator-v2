# R100 Simulator v2

An interactive Next.js simulator for the Rule of 100 course. It plays back scripted
"scenes" inside recreations of three tool chromes — ChatGPT, Slides, and a Google
Docs-style workbook — so learners can step through workflows exactly as they appear
in the course material.

## How it works

- Each combination of **chrome** (`chatgpt` | `slides` | `google-docs`) and
  **workflow** (`wf0`–`wf5`) is rendered at `/simulator/[chrome]/[wf]`.
- Scene data is loaded client-side from static JSON in `public/data/<wf>/<chrome>-scenes.json`.
- A shared sidebar lets you jump between workflows and step through the scenes of
  the current one (keyboard: `←`/`→` to navigate, `S` to toggle the sidebar).

## Project structure

```
app/                          Next.js App Router pages
  page.tsx                    Landing page (pick a chrome/workflow)
  layout.tsx                  Root HTML layout, imports global styles
  globals.css                 Tailwind base + imports the three chrome stylesheets
  simulator/
    layout.tsx                Shared full-height layout for simulator routes
    [chrome]/[wf]/page.tsx    Simulator route — validates params, loads the shell

components/
  chrome/
    SimulatorShell.tsx        Top-level shell: nav + sidebar + viewport, owns active scene state
    SimulatorViewport.tsx     Fetches scene JSON and renders the right chrome root
    chatgpt/                  ChatGPT chrome: chat view, GPT editor view, sidebar, input bar
    slides/                   Slide layouts (title, persona, branded-graphic, marker-guide, closing, concept-overlay)
    google-docs/              Workbook/doc chrome: block renderers (text, callout, marker, cards, etc.)
  nav/
    TopNav.tsx                Top bar (chrome switcher)
    Sidebar.tsx                Workflow tabs + scene list + prev/next controls
  ui/                         Small shared UI primitives (button, badge, separator) built on Radix
  landing/                    Landing-page-only components

lib/
  types.ts                    Scene/chrome/workflow types and metadata (single source of truth)
  utils.ts                    Small helpers (e.g. `cn` for class merging)

styles/
  design-tokens.css           CSS custom properties (colors, spacing, etc.) shared by all chromes
  chatgpt.css                 ChatGPT chrome styles
  slides.css                  Slides chrome styles
  google-docs.css             Workbook chrome styles

public/data/wf0..wf5/         Static scene JSON, one file per chrome per workflow
  chatgpt-scenes.json
  slides-scenes.json
  google-docs-scenes.json
```

Each chrome's stylesheet is a straight port of a legacy standalone HTML capture
harness (used to generate screenshots), so some CSS is scoped only loosely to the
chrome and can leak into the surrounding app shell — keep that in mind when editing
`styles/*.css`.

## Setup

Requires Node.js (18+) and npm.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
```

### Adding/editing scene content

Scene content lives entirely in `public/data/<wf>/<chrome>-scenes.json` — no code
changes are needed to tweak copy, add a scene, or reorder a workflow. The shape of
each scene is defined by the corresponding type in `lib/types.ts`
(`ChatGPTScene`, `SlideScene`, `DocScene`).
