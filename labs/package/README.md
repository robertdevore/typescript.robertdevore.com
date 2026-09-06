# Job summary library

A course package with strict runtime parsing and a small ESM API. Install from the local tarball created with `npm pack`. This illustrative scope is not a claim of an npm publication or name reservation. Change it to an owned package name before publishing.

`parseJob(unknown)` and `parseJobs(unknown)` return discriminated results. They reject extra keys, empty labels, invalid IDs, negative or unsafe attempts, duplicate IDs, and lists above 10,000 entries. Labels are trimmed. Parsed objects and the list are frozen; all fields are primitive. `summarize` returns totals and rejects an unsafe numeric total. `groupBy` preserves element and key inference.

The package targets Node 24+ ESM. CommonJS require and browser bundlers are not advertised compatibility guarantees. It has no runtime dependencies. Build with `npm install` then `npm run build`, inspect `npm pack --dry-run`, and test a fresh installed consumer before publication. The course root automates consumer tests with `npm run check:package`.

The source map embeds original TypeScript; declaration maps reference original source. This package includes inline source for runtime debugging, but does not promise declaration-map source navigation from the tarball. Remove declarationMap if your consumers do not benefit, or ship source intentionally.
