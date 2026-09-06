# Editorial and technical review — 2026-09-06

This is an internal review against the specification and named contributor lenses. No named contributor personally reviewed or endorsed the course.

The curriculum contains 36 original lessons across five stages, four progressive comparison builds, a milestone capstone, and six optional project tracks. Lessons teach JavaScript at the point of need, static types separately, working examples, actual diagnostics, runtime-boundary exercises, and practical checkpoints. The written lessons and build briefs exceed 26,000 words before inserted source/output examples.

## Review decisions

- Preserve structural typing and assignability direction; do not force nominal expectations onto interfaces. Explicitly teach fresh-literal excess checks and output projection.
- Distinguish unknown, any, never, and void precisely, including ignored callback return values and asynchronous ownership.
- Prefer input-output generic relationships, standard utilities, readable unions, and measured complexity. Constrained generic factories do not construct arbitrary T.
- Treat predicates, assertions, brands, readonly views, and declarations according to their real limits. Deliberate unsafe fixtures execute JSON assertion, ambient declaration, DOM-global, array covariance, and method-bivariance failures.
- Use explicit NodeNext/ESM application configuration and a real independent packed consumer. Teach Node's current require/ESM caveats rather than old absolute prohibitions. Do not advertise untested CJS or browser package support.
- Treat TypeScript 7.0.2 as stable. Explain native CLI/LSP and incomplete programmatic API separately. Do not assume old embedded compiler integrations moved automatically.
- Inspect current iteration issue body rather than cached search schedule. Record the issue's update date in the currency report.
- Identify decorators as a TC39 proposal at the current repository's stated stage. Finished proposals and host support remain separate; explicit resource management's listed publication year is 2027.
- Keep Zod as an optional maintained comparison. The owned small parser avoids a required schema dependency and demonstrates all checks directly.
- Keep the capstone unsolved, as requested. The earlier application is a loopback teaching service with explicit limits and a public-deployment/authentication discussion, not an unsupported claim of internet-ready security.

## Reproducible evidence

- `research/verification.json`: 36 compiled/executed examples and exact diagnostic-code expectations, using TypeScript 7.0.2 and Node 24.20.0.
- `examples/expected/*.txt`: actual compiler output inserted into lesson pages, regenerated after formatting.
- `research/package-verification.json`: actual packed files, fresh ESM consumer runtime/type checks, exact rejected-input diagnostic.
- `tests/runtime.test.mjs`: parser edge cases, overflow, real HTTP, request admission, body limit, signal shutdown, CLI process boundary, and JS migration.
- `tests/boundaries.test.mjs`: executed examples of unsoundness and runtime/compiler distinctions.
- `tests/site.test.mjs`: every generated internal href/src/fragment, canonical metadata, sitemap, content shape, and script-size budget.
- `research/browser-verification.json`: Chromium/Chrome checks of accessibility, responsive layouts, search, progress, DOM guards, deep refresh, no-JS navigation, and blocked storage.
- `research/production-verification.json`: canonical-domain DNS, trusted TLS, indexed routes, static assets, real 404, and redirects after deployment.

Browser installation from the Playwright CDN timed out locally. The supported BROWSER_CHANNEL=chrome override uses installed Chrome; this is recorded as the tested browser instead of claiming the unavailable bundled revision was run. CI can install Playwright Chromium normally.

## Maintenance boundary

The repository has no runtime dependency on the reference courses, no client framework, no live browser compiler, no npm publication side effect, and no committed deployment credentials. Runtime application limits are explicitly documented. Future edition currency checks and normal dependency upkeep are maintenance procedures, not unresolved implementation findings.

## Production release status

Workers Static Assets deployment and the 47-route HTTPS production gate passed. GitHub Actions run 34062993335 passed on Node 24.20.0 and 26.x, including browser checks. The local browser report passes; the production browser gate is currently blocked by inherited zone-level Zaraz analytics and associated CSP errors. `research/deployment.json` records the distinction. The proposed hostname-only Configuration Rule is in `research/cloudflare-hostname-rule.json`; it has not been applied because both API credentials lack rule-edit permission. Do not mark the production browser gate complete until the rule is applied and the unchanged browser tests pass against the canonical site.
