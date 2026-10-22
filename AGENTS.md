# AGENTS.md — PUBLIC / MOVE

Guidance for AI coding agents. Read this first; you should be productive in ~5 minutes.

## 1. Project Overview

**What it is:** A fully simulated, static, single-page *concept app* set in 2040. It shows a public transportation network where government-owned autonomous cars, shared shuttles, mass-transit lines, emergency units and residents' contributed cars operate as **one public network**, built for public benefit rather than profit.

**Primary users:** Visitors to the public demo (https://dwdike-maker.github.io/public-move/): civic advocates, city officials, transit/disability-rights communities, and the general public being persuaded. The author (dwdike-maker) uses it to advocate for public self-driving mobility as a public right.

**Main goals**
- Make the vision tangible: book a simulated trip, watch it on a live map, see costs, guarantees and impact.
- Show accessibility-first, transparent, non-extractive service design.
- Be honest and credible: sourced real-world statistics, clearly labelled projections, named open questions.

**Explicit non-goals**
- Not a real transit product: **no real vehicles, accounts, payments, dispatch, maps, or user data.**
- No backend, auth, analytics, tracking, ads or third-party services.
- Not a generic framework demo; don't "productionize" it into a different stack.
- Don't add features that contradict the concept's promises: no surge pricing, tips, ads, premium tiers or paid queue-jumping (these are shown as things the network *never* has).

## 2. Architecture

**High-level:** Zero-build static site. `index.html` loads `styles.css` and one classic script `app.js` (no modules, no bundler). Everything runs client-side in the browser.

**Major components (all in `app.js`, in this order)**
1. **Icons** (`P`, `ic()`): inline SVG path strings, rendered via `ic('name')`.
2. **Data** (`DEST`, `OPTS`, `DISTRICTS`): fictional destinations, ride options, service-area guarantees.
3. **State** (`S`): one mutable global object (screen, step, destination, option, accessibility flags, community-service state, trip simulation, fictional city stats).
4. **Pricing** (`quote(k)`): single source of truth for fare, benefit coverage, $18 monthly cap and cost breakdown (energy 38% / upkeep 47% / accessible service 15%).
5. **Map** (`buildMap`, `PATHS`, `buildVehicles`, `place`): procedurally generated SVG city (seeded via `Math.sin` hash so it is deterministic) with ambient vehicles animated along SVG paths.
6. **Camera** (`insets`, `fit`, `bboxNow`, `retarget`, `applyVB`): animates the SVG `viewBox` to frame the relevant area; layout differs at ≥900px (side sheet) vs mobile (bottom sheet).
7. **Views** (`viewHome`, `viewOptions`, `viewApproach`, `viewRide`, `viewArrived`, `viewCity`, `viewServe`, `viewRights`, `viewAccess`, `viewImpact`): pure-ish functions returning HTML strings.
8. **Render** (`render`, `renderTabs`, `syncMap`): swaps `#sheet` innerHTML, updates tabs, syncs map.
9. **Simulation** (`frame`, `startTrip`, `SIM`, `addEvent`): `requestAnimationFrame` loop drives ambient vehicles, the trip state machine and the emergency-vehicle event.
10. **Events** (single delegated `click` listener on `document`): dispatches on `data-act` / `data-id`.

**Data flow:** user click → `data-act` handler mutates `S` → `render()` (or `keepScroll()` for in-place toggles) → view functions read `S`/`quote()` → HTML string → `#sheet`. The rAF loop mutates the SVG and updates a few live DOM nodes (`#eta`, `#bar`, `#street`, `#events`) directly without re-rendering.

**Trip state machine:** `S.step`: `home → options → approach → ride → arrived`; `S.sim.phase`: `idle → matching → approach → wait → ride → done`.

**State management:** Plain global object + full re-render of the active view. Only accessibility prefs persist (`localStorage` key `pm-access`). Everything else resets on reload by design.

## 3. Technology Stack

- **Languages:** vanilla HTML5, CSS3, ES2015+ JavaScript (`'use strict'`).
- **Frameworks/libraries:** none. **Runtime dependencies: zero. No `package.json`.**
- **Browser APIs used:** SVG DOM, `requestAnimationFrame`, `localStorage`, `speechSynthesis` (opt-in audio navigation), `inert`.
- **Fonts:** system font stack only (no web fonts).
- **Build tools:** none.
- **Hosting:** GitHub Pages, branch `main`, path `/` (legacy build type) at https://dwdike-maker.github.io/public-move/.
- **Deployment:** `git push origin main` → Pages rebuilds automatically (~1 min). No CI.
- **Local run:** open `index.html`, or `python -m http.server 8000`.
- **Repo:** https://github.com/dwdike-maker/public-move (public, MIT).

## 4. File Structure

| Path | Purpose |
|---|---|
| `index.html` | Static shell: map container, brand, gear button, `#sheet` (main), `#tabs`, toast/live regions, full-screen intro dialog. |
| `app.js` | All logic, data, views, simulation (~650 lines). |
| `styles.css` | All styling (~320 lines, dense/minified-style rules). Design tokens in `:root`; breakpoints at 640 / 899-900 / 380 px; `prefers-reduced-motion` and `.calm` handling. |
| `README.md` | Public description and run instructions. |
| `LICENSE` | MIT. |
| `AGENTS.md` | This file. |

**Special caution**
- `quote()` and the cost-split percentages: values are repeated in the receipt (`viewOptions`) and the Impact chart (`viewImpact`). Keep them consistent (they were once out of sync).
- `bboxNow()` / `fit()` / `insets()`: camera math is coupled to CSS layout (sheet width 440px + 120px left inset at ≥900px). Changing layout requires updating these.
- `buildMap()` hard-codes coordinates (routes in `DEST`, `PATHS`, station/hub positions, pins). Route endpoints must match map geometry.
- `frame()`: runs every animation frame; avoid allocations and DOM re-renders here.
- Intro dialog focus/`inert` handling (`setBg`, `closeIntro`): keep keyboard users out of the background while the intro is open.
- Facts in `FACTS_REAL` / `FACTS_PROJ`: factual claims with sources. Do not alter numbers without checking the original source.

## 5. Development Principles

- **Simplicity first:** static files, no build. If a change needs tooling, reconsider the change.
- **Maintainability over cleverness:** readable beats compact. (Note: existing code is dense; don't make it denser, and don't mass-reformat it.)
- **Minimize dependencies:** zero today. Keep it that way.
- **Mobile-first:** the bottom-sheet layout is the baseline; ≥900px is the enhancement. Test at ~360px and ~1280px widths. Respect `safe-area-inset`.
- **Accessibility is a core promise of the product, not a nicety.**
  - Semantic buttons with `aria-pressed` / `aria-checked` / `role="switch"|"radio"` as already used.
  - Visible `:focus-visible` styles; move focus to the `#h` heading on view changes (`render()` does this).
  - Announce changes via `#live` (`announce()`) and `#toast`.
  - Touch targets ≥44px; color contrast ≥ WCAG AA; support `.calm` (reduce motion), larger text (`html` font-size 18px), quiet/audio options.
  - Never convey information by color alone.
- **Tone:** plain, warm, specific. Concept copy states facts or labelled projections only.

## 6. Coding Standards

- **Naming:** camelCase for functions/variables (`startTrip`, `buildMap`); `viewX` for view functions; SCREAMING_CASE for constant tables (`DEST`, `OPTS`, `TICKS`); short DOM helpers (`$`, `ic`, `money`, `clock`) already exist, so reuse them. CSS: short kebab/lowercase class names (`.opt`, `.rline`, `.proof`); state via `aria-*` attributes or `data-*` attributes rather than ad-hoc classes where possible.
- **Actions:** add UI behaviour via a `data-act="name"` attribute and a new `case` in the single click switch. Don't attach per-element listeners.
- **File organization:** keep `app.js` sections in the existing order, delimited by `/* ---------- section ---------- */` comments. New views follow the `viewX()` + `TABS`/`render` map pattern.
- **Component structure:** a view is a function returning a template string; shared fragments (`sw()`, `backBtn()`, `proof()`) are small helpers. Reuse existing CSS classes (`card`, `promise`, `fine`, `eyebrow`, `chip`, `never`, `dark`, `green`) before adding new ones.
- **Styling:** use CSS variables from `:root` (the UI is a dark theme; map colors are light and hard-coded in the SVG). Avoid new hard-coded colors in HTML templates.
- **Error handling:** wrap browser-storage and speech APIs in `try/catch` and degrade silently (see `applyAccess`, `announce`). No exceptions should reach users.
- **Logging:** none currently; no `console.log` left in committed code. User-facing feedback goes through `toast()` / `announce()`.
- **Comments:** only where non-obvious.

## 7. Security Rules

This is a static site with no secrets, backend or user accounts, but:

- **Never expose or commit secrets** (tokens, API keys, `.env`). None are needed; if a task seems to need one, stop and ask.
- **Never add third-party scripts, trackers, fonts or CDNs** without explicit approval. They would add privacy and supply-chain risk to a site that promises minimal data use.
- **Sanitize anything dynamic.** Views build HTML with template literals assigned to `innerHTML`. Today all interpolated values come from in-file constants or app state. **If you ever interpolate user-provided text** (form input, URL params, `localStorage` contents), escape it or use `textContent`. `localStorage` (`pm-access`) is parsed in `try/catch`; only trust boolean flag keys from it.
- **Don't add real data collection.** No real location, accounts, payments, cookies or analytics. The product's concept argues for privacy; the demo must not contradict it.
- **Least privilege:** don't request browser permissions (geolocation, notifications, etc.). `speechSynthesis` is opt-in and permissionless.
- **Document risks:** if you introduce anything with a security or privacy implication, note it in the PR/commit message and here.
- **Content/credibility risk:** statistics are public claims. Keep sources accurate and label modelled/disputed figures as such.

## 8. Agent Workflows

When making changes:
1. **Understand** the existing implementation: read the relevant section of `app.js`, the matching CSS, and `index.html` before editing.
2. **Reuse** existing patterns (helpers, CSS classes, `data-act` dispatch, `quote()`).
3. **Minimize scope.** Surgical edits; no drive-by reformatting.
4. **Explain trade-offs** briefly when more than one reasonable approach exists.
5. **Identify risks before coding:** state sync (receipt vs impact), camera/layout coupling, accessibility regressions, rAF performance, factual claims.
6. **List impacted files** in your summary/commit message.
7. Validate (section 9), then commit with a clear message. Include the trailer `Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>` when an AI agent authored the commit. Pushing to `main` publishes to the public site, so confirm before pushing risky changes.

## 9. Agent Constraints

- Do **not** introduce frameworks, bundlers, TypeScript, or CSS preprocessors unless clearly justified and approved.
- Do **not** add dependencies without explaining why and getting approval.
- Prefer modifying existing code over rewriting; preserve the architecture unless told otherwise.
- Avoid premature optimization (the sim is light); optimize only measured problems.
- Don't remove or weaken accessibility features or the "never has" promises.
- Don't present fictional numbers as real, or real numbers without a source.

## 10. Testing Expectations

There is no automated test suite. At minimum:

**Automated sanity**
- `node --check app.js` (syntax).
- Open the page and confirm there are no console errors.

**Manual verification**
1. Load at ~360px and ~1280px; intro appears, "Start the journey" and "Explore the city first" both work; Esc closes intro; Tab can't reach background content while it's open.
2. Go tab: pick each destination (Work, Healthcare, Market) → each ride option → Confirm → wait for the vehicle → "I'm Ready" → arrival. Work trips show the emergency-vehicle yield event; verify receipt, "You pay", and fare-cap behaviour (Market is capped at $18/month).
3. Cancel mid-trip (always free) and reset works.
4. City tab: stats update, legend toggles show/hide vehicle types.
5. Serve, Guarantee (district switcher), Impact tabs render with no layout breakage; cost split matches the receipt (38/47/15).
6. Accessibility screen (gear): toggle every option; confirm wheelchair mode hides the community vehicle option, larger text and reduce-motion apply and persist after reload.
7. Keyboard-only run-through; screen-reader announcements for trip events; `prefers-reduced-motion` on.

**Edge cases**
- Wheelchair on + Community option previously selected (falls back to car).
- Fare near the $18 cap (partial coverage); `localStorage` unavailable or corrupt; resizing during a trip; switching tabs mid-trip and back; rapid repeated clicks; very small (≤380px) and very wide screens; `speechSynthesis` missing.

## 11. Future Improvements & Known Technical Debt

- **Theme mismatch:** CSS is a dark theme, but `<meta name="theme-color">` is `#fbf8f2` (light) and the map is light. Reconcile or add a deliberate light/dark scheme.
- **Duplicated constants:** cost percentages, the $18 cap and "48" emergency units appear in several places; extract named constants.
- **Dense code:** `app.js` and `styles.css` use long one-line rules/statements. Gradually split when touching them; consider ES modules (still no build) once it grows past ~1,000 lines.
- **Full re-render on every toggle** with `keepScroll()` focus restoration is fragile; consider targeted updates if views grow.
- **Hard-coded map geometry** couples routes, pins, stations and labels; consider a single geometry config.
- **No tests or CI:** add a small Playwright smoke test and a GitHub Action for syntax/link checks if the project grows.
- **Return-trip copy** is generic for non-work trips; could be tailored.
- **Sources:** add a dedicated "Sources" section/page with links and access dates; periodically re-verify statistics.
- **Advocacy features:** shareable links/OG tags, a printable one-pager, and a "who to contact" guide for local pilots.
- **Translations / localization** and a proper light theme.
