# Implemented changes — 2026-09-06

- Shared generator: accurate page/learning-resource schema, visible breadcrumbs, explicit social metadata, page-specific OG paths, 48 exact301 redirect rules.
- Howl: metadata-derived41-card manifest referencing real TypeScript/Markdown sources; supported validate/list/show/caption/render commands; two byte-identical SVG runs; all titles/bounds verified; source fonts embedded; PNG conversion and live-byte checks.
- Verification: stale manifest/title checks, PNG1200×630 checks, JSON-LD/breadcrumb checks; permanent production redirect requirement.
- Audit tooling: Python local/live inventory and edge probes, immutable baseline archive, raw receipts, all required CSV categories and dated reports. No production analytics, DNS, WAF, training policy or search-account changes.

Files: scripts/build.mjs, scripts/howl-cards.mjs, scripts/audit-site.py, scripts/audit-edge.py, scripts/production.mjs, tests/site.test.mjs, assets/site.css, assets/og/*.png, howl.json, package.json, eslint.config.mjs, README.md, ignore rules, verification receipts, and this audit workspace. Public lesson content did not change.
