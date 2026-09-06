{"slug": "library-cli", "title": "Build 2: reusable library & CLI", "stage": 2, "description": "Extract domain behavior, preserve inference, and test both runtime and public type contracts."}

## The brief

Refactor the Stage 1 utility into a reusable library plus a thin command-line adapter. The library must not read process arguments, print logs, or decide exit status. A second consumer should be able to summarize jobs without inheriting CLI behavior.

Budget three to five hours. Use lessons 8–17 to improve contracts, not to decorate the code with every type operator. The comparison library lives in `labs/package`; its CLI consumer is added in `labs/cli`.

## Public domain contract

Expand a job to include an ID, a nonempty label, and a nonnegative safe integer attempts count. Define an explicit ID grammar such as `job_` followed by lowercase letters or digits. Keep parsing from unknown at the public boundary.

The public API should include parsing one job, parsing a list, summarizing a readonly list, and one useful generic grouping helper. Export only the domain contracts and functions consumers need. Do not expose the CLI's filesystem details or internal validation implementation.

## Milestone 1 — Separate ownership

Move pure parsing and summary code into the library. Keep file reads and output formatting in the CLI. Give both a clear package boundary, or start with separate modules and promote them to packages in Stage 4. Use .js relative import specifiers for emitted Node ESM.

Acceptance: importing the library has no process side effects. A test can call the parser without opening a file or capturing console output.

## Milestone 2 — Use precise results

Return a discriminated result from parsing. Give errors stable codes and useful messages. Make success values easy to consume after one discriminant check. Reject duplicate job IDs and decide whether a list-size limit belongs in this boundary.

This build rejects unexpected record keys and trims labels. Document the policy change from Stage 1's projection behavior. Freeze parsed primitive-only records if your library promises stable owned data; otherwise document readonly as a static view with aliasing limits.

Acceptance: adding an error variant produces reviewable feedback in exhaustive consumers. A malformed JSON record never reaches the summary function through the parser's success branch.

## Milestone 3 — Add one justified generic

Implement groupBy taking a readonly list and a key selector. Use a Map so key relationships remain explicit without asserting Object.keys results. Preserve the original element type and the inferred key type in the output.

Try the ordinary consumer first: grouping jobs by attempts should infer numeric keys and job values. Grouping a richer job object should retain its additional fields. Do not make a generic parser that returns arbitrary T without a caller-supplied runtime parser.

Acceptance: consumers need no explicit type arguments for ordinary use, and invalid callback operations receive clear errors.

## Milestone 4 — Test runtime contracts

Test parsing successes and failures, normalization, unknown-key policy, duplicates, immutability policy, empty input, grouping collisions, and aggregate overflow. Use distinct fixture values so a helper returning the wrong property cannot pass accidentally.

Run the CLI in a child process for at least one valid and one invalid fixture. It should map parser errors to stderr and nonzero status while keeping successful stdout suitable for piping.

## Milestone 5 — Test type contracts

Add compile-only positive and negative consumer fixtures. Check that grouping preserves a richer element's fields, the key type remains numeric, and invalid keys or values are rejected. A small Expect/Equal helper is enough; use a dedicated type-test tool only if its current compiler compatibility has been verified.

Remember that expect-error detects some error on the next line, not necessarily the intended error. Isolate each rejected input. The course harness checks diagnostic codes for lesson examples and an exact rejection in the installed consumer.

## Runtime-boundary drill

Pass an unknown object containing all expected fields plus an internal flag. Demonstrate the parser's chosen rejection. Then bypass the parser in a controlled fixture and serialize through a narrower parameter type. Explain why structural typing leaves the extra flag at runtime.

## Type-checker drill

Replace groupBy's return with a broad Map of unknown arrays. Observe how runtime tests still pass while consumer property access loses inference. Restore the generic relationship and add a type test preventing that regression.

## Compare after implementation

The course comparison code can be exercised with:

```sh
npm ci
npm run check:labs
npm test
node labs/cli/dist/main.js labs/cli/jobs.json
```

Inspect the library's exported declarations and compare its assertions with yours. A localized justified brand assertion may be reasonable later; this build does not need one.

## Review rubric

A strong submission has a small public API, no accidental process imports, useful inference, exhaustive outcome handling, bounded input, and tests that survive internal refactoring. A weak submission adds many conditional types while returning any from its JSON boundary.

## Completion checkpoint

Complete this build when a second program can consume the library cleanly, every intentional escape hatch has an evidence-based explanation, runtime tests pass, and consumer type tests protect meaningful relationships. Save its package boundary for the application and publishing stages.
