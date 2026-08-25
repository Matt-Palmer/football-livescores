# Handover

State of this project after two completed work phases: hardening, then the
Next 16 upgrade. Written so the next person or session can pick up without
re-deriving decisions or re-discovering the traps.

Covers work through `2382ea6`. A formatted version of this document lives at
https://claude.ai/code/artifact/2cb6ee40-0128-4b47-b49e-7983521dcc61

---

## Where things stand

Both work phases are merged into `main` via pull requests. Nothing is
local-only.

| Commit | What | Landed |
| --- | --- | --- |
| `2382ea6` | Merge PR #2 — the Next 16 upgrade | tip of main |
| `577989c` | Remove dead API-Football data, ignore generated agent files | PR #2 |
| `6a829c7` | Upgrade to Next 16, React 19, Headless UI v2 | PR #2 |
| `a0b4b61` | Merge PR #1 — hardening | — |
| `8cce891` | Harden data fetching, error handling and live polling | PR #1 |
| `147c6d2` | Remove IDE files from version control, target es6 | PR #1 |

### Versions

| Package | Version | Note |
| --- | --- | --- |
| next | 16.3.2 | Turbopack is the default bundler; `next lint` was removed |
| react / react-dom | 19.2.8 | StrictMode double-invokes render functions in dev |
| @headlessui/react | 2.2.10 | named exports; `data-selected` attributes |
| eslint | 9.39.5 | pinned — see decisions |
| typescript | 5.9.3 | pinned — see decisions |
| tailwindcss | 3.4.19 | v4 deliberately deferred |
| node | 26.5.0 | Next 16 requires >= 20.9 |

Removed during this work: `firebase`, `firebase-admin` (imported but entirely
unused), `moment` (replaced by native `Intl`), `react-loader-spinner` (zero
imports), `@headlessui/tailwindcss` (only supplied the `ui-selected:` variant).

---

## Running it

The app renders nothing without a Sportmonks token. `.env.local` is gitignored.

```bash
# .env.local
SPORTMONKS_API_KEY=your_token_here
```

```bash
npm install
npm run dev
```

### A sparse homepage is correct, not broken

The Sportmonks **free tier covers only the Danish Superliga**. Expect one
country and often a single fixture — sometimes none at all. Detail data is
full and rich for covered matches (statistics, events, lineups, timeline,
standings, head-to-head).

Do not go hunting for a bug in an empty fixture list before checking that the
date actually has fixtures.

The fixture used throughout testing: `19713978` — Brøndby IF 3–1 Silkeborg IF,
season `27897`, played 2026-08-24. It is finished, so it exercises every tab
but never the live-polling path.

---

## Architecture

The Sportmonks token is server-side only. The browser never talks to Sportmonks
directly; it calls this app's own routes under `app/api/`, which attach the
token and proxy the request.

```
app/api/            Route handlers proxying Sportmonks
components/
  Fixtures/         Homepage: country -> league -> fixture list
  Fixture/          Match detail page and its tabs
  Shared/           Used by both
hooks/              Context accessors
services/
  Api/              Browser-side client for this app's own /api routes
  Sportmonks/       Server-side Sportmonks client (imports `server-only`)
  Date/             Timezone-aware date handling
  MatchStates/      Interpreting Sportmonks state ids
utils/Sportmonks/   Static reference data (countries, states, types)
design/             Design source files (not served or deployed)
```

Both context providers poll every five seconds while a match is in play, on a
single long-lived interval that reads current state through refs. Polling
starts when a fixture passes its kickoff time and stops when the match
completes.

---

## Phases

### Phase 0 — Branch and tidy — **done**

- Removed committed `.idea/` files; added IDE entries to `.gitignore`.
- Committed the pending `tsconfig` target change, es5 → es6.

### Phase 1 — Harden on Next 13 — **done**

- **The original failure was a missing API key**, disguised by `catch` blocks
  that logged `"test"` and returned `[]`. The app was never broken, only
  unconfigured.
- Added `services/Sportmonks` (server-only) and `services/Api` (browser).
  Routes now return real HTTP statuses; a missing key throws an explicit,
  named error.
- Rewrote both context providers: one stable interval each, refs instead of
  stale closures, `AbortController` actually attached to the fetch.
- Dates resolve in the **viewer's timezone**, not UTC; timezone forwarded to
  Sportmonks.
- Removed Firebase entirely, plus `getFetchUrls`, the unused
  `GetInPlayFixtures` route, and the dead `Logo` component.

### Phase 2 — Upgrade to Next 16 — **done**

- Next 13.4 → 16.3.2, React 18 → 19, Headless UI 1.7 → 2.2.10, ESLint 8 → 9
  flat config.
- `params` is now a Promise; `images.domains` → `remotePatterns`; `jsx` →
  `react-jsx`.
- Deleted `utils/LeagueStatus` — 3.4 MB, 142,374 lines, zero importers.
- Verified in-browser: all five tabs, both team lineups, both pollers at
  exactly 6 requests / 30s.

### Phase 3 — Favourites — **NOT STARTED**

This is the outstanding, already-specified piece of work.

- The `StarIcon` in `components/Shared/FixturesLeagueFixture/index.tsx` renders
  on every fixture row with **no click handler**. It is a dead affordance.
- Agreed design: toggle on click, persist to `localStorage`, pin favourited
  fixtures to the top of the list. No backend, no accounts.
- It already sits outside the row's `<Link>`, so it can take its own click
  without navigating.

---

## Decisions — settled, with reasons

Do not relitigate these without new information.

| Decision | Why |
| --- | --- |
| Tailwind stays on 3.x | v4 is a config rewrite across ~50 arbitrary-value-styled components. Deliberately not compounded with the Next migration. |
| TypeScript pinned to 5.9.3 | `@latest` now resolves to 7.x, the Go compiler. Nothing requires it; same no-compounding reasoning. |
| ESLint pinned to 9 | Not preference — `eslint-config-next` depends on `eslint-plugin-import`, which peers at ESLint 9 maximum. ESLint 10 is genuinely broken here. |
| Firebase removed, not finished | A half-built Firestore cache: `db`, `getDoc`, `setDoc` imported and never used. Next's own caching covers the same ground without a second vendor. |
| Client polling kept | Server Components were considered and declined. The architecture is unchanged; only its implementation was corrected. |
| Route stays `/Fixture/[id]` | Capital F is unconventional but consistent, and renaming breaks existing links for no functional gain. |
| Pitch images kept | Intended for a future custom lineup pitch. The `.psd` moved to `design/` so it is not publicly served. |
| `AGENTS.md` / `CLAUDE.md` gitignored | Generated by `next dev` from Next 16 on. Build artefacts tied to the local Next version, not source. |

---

## Conventions this codebase follows

- **Never mutate during render.** No `sort`, `splice` or in-place writes on
  state or props inside a render path. Copy first.
- **Refs sync in effects**, never by assignment during render, and are declared
  *before* the interval effects so timers never read a stale ref.
- **Failures are loud.** Routes return real HTTP statuses; the UI shows a
  message and a retry. Never return `[]` to mean "it broke".
- **The API token is server-side only.** `services/Sportmonks` imports
  `server-only`, so importing it from a client component fails the build. Error
  messages never include the request URL, which carries the token.
- **Dates go through `services/Date`**, which resolves the viewer's timezone.
  No `toISOString().split("T")[0]` — that is UTC and wrong for most of the
  world.
- **Effect dependencies are honest.** Fixed properly rather than suppressed;
  expensive fetches are keyed on stable ids so the 5s poll does not refetch
  standings and head-to-head.

---

## Traps

Things that cost real time. Read before debugging.

### Mutation during render — three separate instances

*Symptom: content silently empty, no console error.*

The same bug appeared in `FixtureHead2Head` (`splice` on state) and
`ParticipantLineup` (`sort` + `splice` on a prop). Fixing one instance without
sweeping for the rest is how the second survived until React 19 exposed it.

**This pattern has not been exhaustively audited.** A deliberate grep is worth
doing.

### Orphaned Next worker processes

*Symptom: routes taking 10–30s; `Restoring pack failed`; spurious 404s.*

`pkill -f "next dev"` does **not** kill the child workers. They keep running
and thrash the shared `.next` cache. 37 accumulated in one session and looked
convincingly like an application performance bug.

```bash
pkill -9 -f "next-router-worker"
pkill -9 -f "next-render-worker"
pkill -9 -f "next dev"
```

### Blank screenshots that aren't rendering bugs

*Symptom: page appears empty in a screenshot but the DOM is full.*

When a browser preview pane is hidden it stops compositing frames and
screenshots come back blank. Check the DOM before concluding the page is
broken — a rendering regression and a hidden pane look identical.

### Mac toolchain architecture mismatch

*Symptom: `libxcrun.dylib ... incompatible architecture`.*

`/usr/bin/git` and `python3` were broken because the Command Line Tools install
was x86_64 on an arm64 Mac — the signature of a Migration Assistant transfer
from an Intel machine. Fixed by reinstalling CLT:

```bash
sudo rm -rf /Library/Developer/CommandLineTools
sudo xcode-select --install
```

Homebrew is *still* the Intel build at `/usr/local` running under Rosetta. Not
broken, not urgent, but it will keep drifting from what arm64 Macs expect.

---

## Not verified

The honest limits of what has been tested. Everything was checked against **one
finished fixture**, plus a temporary mock that faked an in-play state. That
mock was removed before committing and is not in the repo.

- **A genuinely live match has never been observed.** Polling was verified by
  request count against a mock, not against real changing scores.
- **Multiple concurrent fixtures** have never rendered — the merge-by-id logic
  in `updateFixtures` is untested at scale.
- **Multi-country grouping** has never run. Only Denmark has ever appeared.
- **Day rollover** (the clock noticing local midnight and refetching) is
  untested.
- **No automated tests exist.** There is no test runner in the project. Every
  check so far has been manual.

---

## Where to pick up

1. **Phase 3 — favourites.** The agreed, specified, not-started work.
2. **Delete merged branches.** `harden-and-upgrade-next16` and
   `upgrade-next-16` are fully merged, local and remote.
3. **Sweep for mutation during render** rather than waiting for the next
   framework upgrade to surface another instance.
4. **Consider a smoke test suite.** Declined once as scope, but the polling
   logic with fake timers is the highest-value thing to lock down.
5. **Deferred majors:** Tailwind 4, TypeScript 7, arm64 Homebrew. Each is its
   own job.

### Check local main before branching

It fell behind `origin/main` twice in one session because merges happened on
GitHub. Branching from a stale `main` silently drops merged work.

```bash
git checkout main && git pull
```
