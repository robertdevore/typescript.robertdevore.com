# Unresolved items — 2026-09-06

1. **P1: existing Cloudflare analytics injection.** Live Lighthouse and the browser gate observe third-party requests/blocking and CSP errors. Apply the already-reviewed hostname-only rule in research/cloudflare-hostname-rule.json using authorized rule-edit access. No CSP relaxation. Existing SignalBox signal: sig_05b073b8-455d-419a-af1e-f469b0ce9549. No duplicate capture is needed.
2. **Platform measurements:** Search Console/Bing coverage, generative-AI inclusion setting, request logs, actual rankings, CrUX/RUM and controlled citations are NOT AVAILABLE — DATA ACCESS REQUIRED. Never interpret this as zero traffic or absence from all search engines.
3. **Optional www-prefixed subdomain:** www.typescript.robertdevore.com is not provisioned or advertised. The canonical typescript.robertdevore.com host is healthy. Do not alter unrelated robertdevore.com DNS to satisfy a generic checker.
4. **Performance interpretation:** local timing samples varied and production remains affected by third parties. Repeat isolated runs and obtain field data before claiming a regression or improvement. The audit added no browser JavaScript or on-page image downloads for the OG cards.

No confirmed external404/410 links were found. One post-change GitHub transfer was indeterminate and independently retried; see the raw receipt. Historical error enumeration and external fragment validity remain outside available evidence.
