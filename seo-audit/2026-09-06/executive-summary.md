# SEO and AI-search audit — 2026-09-06

## PASS WITH RECOMMENDATIONS

The repository and canonical production site pass the audited discovery, metadata, internal-link, media, structured-data and route checks. The separate full production browser quality gate remains blocked by the existing Cloudflare-injected analytics issue. Search visibility and AI citations cannot be graded without account data.

## Before

The site already had 47 canonical/indexable candidates, unique titles/descriptions, one H1 per indexable candidate, working canonicals/sitemap/robots, and a valid shared 1200×630 PNG. None of the 47 was missing an OG image. There were no real broken internal links or indexable orphans. One raw crawler warning was a documented parser false positive on the 404 page's skip link, not a site defect.

Structured data was absent. Slash and index.html normalization used 307 temporary redirects. Every lesson used the generic course card. Production injected Zaraz/RUM and tracking requests despite the lightweight local build.

## Changes and current state

- Added factual WebSite, WebPage/LearningResource and breadcrumb JSON-LD on all 47 canonical pages, with visible breadcrumb navigation where appropriate. No invented author credentials, dates, ratings, rosters or Google course-list eligibility.
- Generated 41 distinct lesson/build PNG previews through Howl, plus the existing general course image: 42 unique images now cover all 47 canonical pages. Added explicit Twitter image/title/description/alt and Open Graph image type/site metadata.
- Added 48 exact permanent redirect rules for known routes and index.html. Tested live 301 responses, canonical 200 destinations and preserved query strings.
- Added regression checks for source-aligned social metadata, PNG dimensions and structured data. All 20 tests, 72 compiler fixtures, strict labs, packed consumer, lint/format and local browser checks pass.
- Independently fetched all 42 live PNGs: HTTP 200, image/png, 1200×630, exact bytes matching the build. All 47 canonical pages return 200; all 45 representative crawler/social-agent probes return 200. This does not verify real provider IP access.

Deployed Worker version: `d25637b1-692e-4f01-9f04-7b638a421222`. Page count stays 50 generated HTML files: 47 sitemap candidates, noindex search, noindex browser lab, and 404. No lesson copy, title, description or slug changed during this audit; only breadcrumb text was added. See raw/content-preservation.json and the final Git diff for exact file scope.

## Scores and measurements

P0 root causes: 0 before → 0 after. P1 root causes: 1 before → 1 after (existing production analytics/performance issue; owner access required). Two repository P2 fixes and one P3 social-preview enhancement are complete. Counts refer to root causes; issue rows list affected pages separately.

No internal SEO or AI-readiness score was assigned. Missing platform access is not evidence of zero traffic or zero citations, and a fabricated readiness percentage would conceal uncertainty.

Local Lighthouse 13.4.1 baseline home/lesson scores: performance 99, accessibility 100, best-practices 100, SEO 100. After local performance samples: home 89 then 97, lesson 96; accessibility/best-practices/SEO remain 100. The 89 run had a 12-second Speed Index outlier despite zero TBT and CLS. A repeat was retained rather than replacing it. Production lesson performance 74 before and 65 after, best-practices 73, accessibility/SEO 100. These are noisy single lab observations on a shared desktop, not a measured improvement or causal regression. Production third-party blocking remains unresolved. Field INP and other field CWV: NOT AVAILABLE — DATA ACCESS REQUIRED.

## Visibility and next action

A quoted-domain search in the available search tool returned no result on the audit date. This does not establish non-indexing or rank. Search Console, Bing account data, analytics/request logs, field CWV and controlled AI citation panels: NOT AVAILABLE — DATA ACCESS REQUIRED. The query and AI benchmark CSVs preserve comparable future prompts without fabricating outcomes.

Use the existing hostname-only Cloudflare rule to address injected analytics, then rerun the production browser suite and performance probes. Review Search Console/Bing and the current generative-AI inclusion setting; compare the saved inventory and benchmark set after 7, 28, 60 and 90 days. No training-crawler policy or unrelated DNS was changed.
