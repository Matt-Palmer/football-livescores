# Football Livescores

A live football scores app built with Next.js 16 (App Router, React 19) and the
[Sportmonks Football API v3](https://docs.sportmonks.com/football).

- **Home** — today's fixtures, grouped by country and competition, with scores
  updating every five seconds while matches are in play.
- **Fixture** (`/Fixture/[id]`) — a single match, with tabs for statistics,
  events, lineups, the league table and head-to-head history.

Dates and kickoff times are resolved in **the viewer's own timezone**, so
"today" means today where you are.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Sportmonks API token

The app will not display anything without one. Create `.env.local` in the
project root:

```
SPORTMONKS_API_KEY=your_token_here
```

Get a token from [my.sportmonks.com](https://my.sportmonks.com/) under
**API Tokens**. `.env.local` is gitignored — never commit it.

If the variable is missing, every API route returns an explicit
`SPORTMONKS_API_KEY is not set` error rather than failing silently.

### 3. Run the dev server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

> **Note on API plans.** Sportmonks' free tier covers only a small number of
> competitions, so the homepage will legitimately show just one or two
> countries. A sparse list is usually your plan's coverage, not a bug.

## How it works

The Sportmonks token is **server-side only**. The browser never talks to
Sportmonks directly; it calls this app's own routes under `app/api/`, which
attach the token and proxy the request.

```
components/         React components, grouped by the screen they belong to
  Fixtures/         Homepage: country -> league -> fixture list
  Fixture/          Match detail page and its tabs
  Shared/           Components used by both
hooks/              Context accessors (useFixturesContext, useFixtureContext)
services/
  Api/              Browser-side client for this app's own /api routes
  Sportmonks/       Server-side Sportmonks client (server-only)
  Date/             Timezone-aware date handling
  MatchStates/      Interpreting Sportmonks state ids
app/api/            Route handlers proxying Sportmonks
utils/Sportmonks/   Static reference data (countries, states, types)
design/             Design source files (not served or deployed)
```

### Live updates

Both context providers poll every five seconds while a match is in play, on a
single long-lived interval that reads current state through refs. In-flight
requests are cancelled on unmount via `AbortController`.

Polling starts automatically when a fixture passes its kickoff time, and stops
once the match is complete.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve a production build |
| `npm run lint` | Lint the project (ESLint 9 flat config) |
