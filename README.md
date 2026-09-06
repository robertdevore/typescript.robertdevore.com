# TypeScript Course

A standalone, free course at **https://typescript.robertdevore.com**: 36 substantial lessons, four progressive comparison builds, a milestone capstone, and optional specialization briefs. JavaScript runtime semantics, strict TypeScript, and validated boundaries remain distinct throughout.

## Install and verify

Use Node **24.20.0** (LTS baseline) and npm. The compiler is pinned to TypeScript **7.0.2**. Native compiler optional platform packages must be installed normally; don't omit optional dependencies.

```sh
npm ci
npm run verify
npm run check:package
npx playwright install chromium
npm run preview
```

In a second terminal:

```sh
npm run test:browser
```

`npm run dev` uses Wrangler's local static-assets server. `npm run preview` serves the existing dist directory with the small local preview server. Neither command starts an external job platform.

## What is checked

- 36 valid examples compile and execute with exact expected stdout.
- 36 invalid examples reject with exact expected diagnostic codes; captured diagnostics render into lessons.
- Exported inferred types shown by the explorer come from compiler-emitted .d.ts files.
- Library, CLI, HTTP application, DOM, class, and checked-JavaScript labs compile.
- Runtime tests exercise parsers, HTTP status, body limits, configuration, admission limits, SIGTERM cleanup, CLI exit codes, migration, and deliberately unsafe boundaries.
- The packed library installs into a temporary independent ESM consumer; declarations, inferred relationships, rejected calls, and runtime exports are checked.
- Static tests validate every internal route, fragment, asset, canonical, sitemap, content structure, and JavaScript size budget.
- Playwright and axe check desktop/mobile pages, search, stored progress, blocked storage, no-JS navigation, DOM guards, deep links, and console errors.

`npm run format` formats maintained sources. `npm run lint` checks JavaScript tooling with ESLint. The native TypeScript CLI checks educational TypeScript; no unverified type-aware linter/native API compatibility is implied.

## Architecture

The SSG is a small Node build using markdown-it and build-time highlight.js. It emits plain HTML with explicit directory-index routes, a sitemap, robots.txt, llms.txt, a lazy-loaded search index, and a tiny progressive-enhancement script. No client framework or runtime dependency on another course site is shipped.

Content lives in `content/lessons` and `content/builds`. The first line is a JSON metadata object; remaining content is Markdown. Keep first-line metadata on one line. Lesson placeholders load actual compiler-verified examples and diagnostic output. `scripts/content.mjs` owns ordering and stage metadata; `scripts/build.mjs` owns routes and rendering.

Headings, labels, tags, and decorative text use self-hosted Departure Mono. Body text uses self-hosted Inter. Font licenses are included under assets/fonts. All UI icons use the vendored Tabler SVGs in assets/tabler; their MIT license and upstream revision are included. The build emits one local icon sprite. The mobile menu uses a native modal dialog; without JavaScript, the header keeps its navigation links visible. Source and course content use the repository MIT license.

## Learning labs

Start with the course's build briefs, implement your own solution, then compare with `labs/stage1`, `labs/package`, `labs/cli`, and `labs/application`. The capstone is intentionally a specification with milestones and acceptance evidence, not a solved platform. The included HTTP application binds loopback and uses operator-configured upstream data; authentication and public deployment policy are learner architecture decisions.

Run `npm run check:labs` from the root to compile comparison implementations. To work on a lab independently, install its declared dependencies and build its dependency package first. The root harness creates only a local ignored package link for integration checks. Actual tarball consumer tests do not rely on that link.

The browser lab is served at `/labs/browser/`. Migration and class experiments are under their corresponding lab directories. Diagnostic and unsafe-boundary fixtures are excluded from application builds intentionally.

## Cloudflare deployment

The course uses **Workers Static Assets**, with no Worker script or server runtime. `wrangler.jsonc` limits deployment to the `typescript-course` application and the custom domain `typescript.robertdevore.com`. It disables workers.dev and preview URLs, forces canonical trailing slashes, and serves a real 404 page instead of an SPA fallback.

```sh
npm run deploy
```

Authenticate Wrangler using its supported login or a narrowly scoped deployment token provided through the environment. Never commit credentials. The command runs verification before deployment. Cloudflare provisions the custom-domain route and certificate; it must not replace unrelated zone records.

The parent Cloudflare zone injects Zaraz and Web Analytics by default. A hostname-scoped Configuration Rule must disable Zaraz and Real User Monitoring for `typescript.robertdevore.com`; the intended rule is recorded in `research/cloudflare-hostname-rule.json`. Append it to the existing `http_config_settings` ruleset without replacing unrelated rules. This zone setting is separate from Wrangler deployment and requires Configuration Rules edit permission. See [Cloudflare's settings documentation](https://developers.cloudflare.com/rules/configuration-rules/settings/).

After deploying, run the HTTP production gate and browser gate:

```sh
node scripts/production.mjs
SITE_URL=https://typescript.robertdevore.com npm run test:browser
```

GitHub Actions runs verification and browser checks on pushes and pull requests. Deployment is an explicit Wrangler operation; no undocumented source-connected auto-deploy or committed credential is required. If later enabling Cloudflare Builds, use `npm run verify` as the build command, `npx wrangler deploy` as deploy command, and main as production branch.

## Currency and maintenance

Read `research/evidence-ledger.json`, `research/currency.json`, and the public `/research/` page before changing compiler guidance. `node scripts/currency.mjs` checks the stable registry version and fetches current authoritative sources. It intentionally fails if stable has advanced, requiring a content review instead of silently claiming currency. Generated runtime verification records identify the actual compiler/runtime used.

For a compiler upgrade: read release notes and the current iteration plan, update the lockfile, check valid examples, review changed diagnostic codes, execute runtime fixtures, inspect declarations, test the packed consumer, compare browser output, then deploy and visit production. Do not update the verification date without doing that work.

## Repository boundaries

This repository lives independently at `/Users/robertdevore/2026/typescript.robertdevore.com`. Nearby Python and Rust repositories were read-only presentation references. The site has no runtime links or dependencies on them. No npm package is published by verification; the illustrative package name must be changed to an owned name before a learner publishes it.

## Search and social verification

The dated formal audit lives in `seo-audit/2026-09-06/`. It preserves the original build, live receipts, before/after inventories, crawler probes, Lighthouse reports, and measurement limits. Do not overwrite a completed audit; use a new dated workspace. SEO readiness does not prove indexing, rankings, or AI citations.

Each lesson and build has a Howl-generated 1200×630 PNG under `assets/og`; other pages share the course image. Images are committed so installation and CI do not require Howl. To regenerate them after changing a title or description, install Howl and Kujo, set `HOWL_BIN` and `KUJO` when they are not on PATH, then run `npm run social:cards`. `BROWSER_CHANNEL=chrome` uses installed Chrome. The command derives `howl.json` from course metadata, validates its real source-file references, renders offline SVGs, applies the Inter body font, and converts them to PNG. The normal tests check manifest freshness, image dimensions, and page metadata. Howl does not type-check examples.

JSON-LD describes the visible site, lesson resources, and breadcrumb trail. No ratings, publication dates, instructor credentials, or Google course-rich-result eligibility are inferred. Training-crawler policy remains unchanged. `llms.txt` is an optional index, not an SEO requirement.
