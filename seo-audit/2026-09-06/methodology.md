# Methodology — 2026-09-06

## Scope and evidence

Audit https://typescript.robertdevore.com: English, free self-guided TypeScript education for developers with basic programming knowledge. Reader goals are finding a lesson, completing exercises, and returning through the reference index. No conversion rates are claimed.

Delivery chain: content metadata/Markdown plus verified examples → Node static generator → dist HTML/assets → Wrangler Workers Static Assets, typescript-course → Cloudflare zone/edge → browser/crawler. There is no origin server or client-rendered core curriculum. Production source is independent of the Python/Rust references.

Baseline commit is recorded in raw/baseline-commit.txt. Build with pinned Node 24.20.0 and npm dependencies. The untouched generated tree was copied outside dist and archived as raw/baseline-dist.tar.gz, with SHA-256. Archive contents and all 50 live receipts were reopened before editing the site. Raw receipts remain immutable. The original parser flagged the 404 page's valid local skip anchor once; raw/baseline-correction.json documents this false positive without changing the original receipt. Actual broken internal links at baseline: zero.

## Inventory and review

All 50 generated HTML pages were reconciled with sitemap and HTML navigation: 47 canonical indexable pages, search, browser lab, and 404. The latter three deliberately stay outside the sitemap. The link graph follows real HTML anchors and fragments, including static no-JS navigation. Page depth is shortest link distance from the homepage. Canonical-page metadata duplication is checked separately from diagnostic/noindex pages.

All 47 indexed pages receive a purpose/topic/query inventory based on their real headings and descriptions, plus section and content hashes. Structural checks cover all lessons and builds; deeper editorial review sampled setup, values/types, narrowing, runtime validation, modules, testing, library design, publishing, performance, and capstone. This is not an independent compiler-maintainer peer review. Technical validation reruns the owned compiler/runtime fixtures.

The course's evidence is its runnable source, actual diagnostics, exercises and progressive builds, with primary documentation links. Introductory narrowing versus advanced exhaustiveness, early errors versus runtime safety, and library design versus packaging serve distinct learning intents; retain their cross-links rather than merge them for keyword similarity. Header/footer boilerplate does not establish thin-content or near-duplicate findings. No word-count target or bulk keyword rewrite was used.

No author expertise, publication date or instructor roster was invented. The About/source links establish ownership context; substantive biographical credentials require the owner's own statements. No contact/commerce/privacy-law claim was added. There is no pagination, localization/hreflang, video, product checkout or RSS promise, so those categories are not applicable.

## Reproduction

- `python3 scripts/audit-site.py --phase baseline --root .work/seo-baseline` captures a phase once; use a new `--out` workspace to repeat a completed audit.
- `python3 scripts/audit-edge.py --phase baseline` captures redirect and crawler probes once.
- After deployment: same commands with `--phase after --root dist` for the site crawl.
- Lighthouse 13.4.1, Chrome headless, mobile simulated throttling, unchanged host/machine per local before/after pair. Raw receipts include exact environment and timings.
- `npm run verify`, `npm run check:package`, preview plus `BROWSER_CHANNEL=chrome npm run test:browser`.
- `npm run social:cards` invokes the supported Howl launcher; record HOWL_BIN/KUJO locally, never bake machine paths into the repository.

External links are checked once per unique URL with real GETs and final URLs. Full external redirect-hop counts are not captured and remain labeled as such. Blocks/timeouts are indeterminate;404/410 would require review, not automatic replacement. External fragments and all historical URL variants cannot be verified from this inventory.

## Search/AI interpretation

A quoted domain search returned no results in the available search tool on 2026-09-06. This is not proof of non-indexing, nor a Google rank observation. Representative topic searches surfaced the TypeScript Handbook/module docs and Total TypeScript; those sources provide official precision and guided practice. This site's distinct contribution is the strict, runnable, staged whole-system path. Search positions, controlled AI citations and field performance remain unavailable. No synthetic readiness score is assigned; raw coverage and failure counts are more defensible than points for inaccessible data.

Local status fields describe generated-file resolution (with the404 fixture mapped explicitly), while production status fields come from real HTTP requests. The static browser suite independently exercises representative local templates. Schema vocabulary/JSON and visible breadcrumb/source correspondence were checked locally; no Google rich-result display is claimed.
