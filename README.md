# Mattress Match Score

A transparent, personalized mattress-matching product. Instead of a single generic star
rating, shoppers get a rule-based **Match Score** built from their own sleep profile
(position, weight, firmness preference, budget, temperature, motion sensitivity), with
auditable sub-scores, risk flags, and review highlights ranked to their profile.

## Stack

Next.js (App Router) + TypeScript (strict) + Tailwind CSS + Radix UI primitives, with a
JSON-file data layer behind repository modules so it can later be swapped for a database
without touching UI code.

## Getting started

```bash
npm install
npm run dev
```

## Key scripts

```bash
npm run dev          # start the dev server
npm run build         # production build
npm run lint          # eslint
npm run typecheck     # tsc --noEmit
npm run test          # unit tests (vitest)
npm run test:e2e      # end-to-end tests (playwright)
npm run ingest         # regenerate data/mattress-catalog.json and data/review-tags.json
                        # from data/raw/*.json
npm run score-demo     # print a deterministic scoring result from the real scoring engine
```

## Architecture

- `contracts/mattress-match.ts` — the single source of truth for `SleepProfile`,
  `Mattress`, `RecommendationResult`, and every other shared type. Scoring, the API, and the
  UI all consume these types directly; nothing forks its own shape.
- `lib/scoring/` — the versioned scoring engine (`engine.ts`, currently `v0.1`) and its
  rule matcher (`conditions.ts`). Rules live in `data/scoring-rules.json`, not hard-coded in
  components.
- `lib/repositories/` — read (and, for sponsored placements, write) access to the JSON
  datasets. Swappable for a real database later.
- `lib/recommendations/build-recommendations.ts` — combines scoring, review relevance,
  affiliate link generation, and sponsored-placement resolution into the final
  `RecommendationResult[]` returned by `/api/score` and rendered everywhere.
- `data/raw/` — seed source data; `scripts/ingest-mattresses.js` normalizes it into
  `data/mattress-catalog.json` and `data/review-tags.json`.
- `tests/unit/` — Vitest coverage for scoring, risk flags, review relevance, affiliate
  links, sponsored placement/verification, and validation.
- `tests/e2e/` — Playwright coverage for the full user journey, comparison, sponsored
  labeling, affiliate tracking, API contracts, an internal link audit, and mobile viewport
  checks.

See `/methodology`, `/sponsored-policy`, and `/affiliate-disclosure` in the running app for
the user-facing explanation of how scoring, sponsorship, and affiliate links work.
