{"number": 23, "slug": "testing", "title": "Runtime tests & type tests", "stage": 3, "description": "Test behavior, inference, rejected inputs, and integration at the boundaries that matter."}

## Where you are

The application talks to uncertain systems. Tests should protect its observable promises. A passing compiler proves only part of that promise, and passing runtime tests say little about a library's inference ergonomics.

## Mental model

Runtime tests execute values and effects. Type tests ask the compiler to accept or reject relationships. Integration tests exercise real boundaries between components. Each catches failures the others can miss; keep the cheapest meaningful test for each risk.

## JavaScript reality

An async test must await the operation or return its promise. Otherwise the runner can finish before the assertion or rejection occurs. Test cleanup matters: close servers, delete temporary files, cancel outstanding work, and restore modified state. A test suite that hangs is often reporting leaked resources rather than slow assertions.

## TypeScript model

Equality helpers can check exact inferred types in focused cases. Assignability checks can be more appropriate when compatibility is the promise. `@ts-expect-error` verifies that the following line produces an error, but not necessarily the intended one; isolate negative cases or assert diagnostic codes with a compiler harness. A stale directive becomes an error when the line no longer fails.

Do not use ts-ignore to silence educational examples. Deliberately invalid programs belong in separate fixtures checked for expected diagnostics. This repository compiles every valid example, executes it, captures the output, and invokes the compiler independently on each invalid fixture.

## Working example

{{example}}

{{output}}

The runtime assertion checks the actual selected value. The type constraint checks its inferred type. Deleting either check loses a different guarantee. The repository uses Node's maintained built-in test runner for runtime tests and the pinned TypeScript CLI for type contracts.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The unused expect-error proves the negative test no longer tests a rejected program. Remove the directive for a valid case or replace the case with an input the public API genuinely promises to reject. Do not add an unrelated error just to make the directive pass.

## Runtime drill

Write a helper that claims to preserve a selected property but always returns a different property through an assertion. A public type test might still pass because the signature is unchanged. A runtime test using distinct values exposes the lie. Conversely, widening a public return type can preserve runtime output while breaking consumer inference; the type test catches that.

## Professional pattern

Use fixtures that represent malformed and edge-case data. Mock the transport where deterministic failures matter, then add a small real HTTP integration test. Avoid asserting internal call counts unless they are the actual contract, such as enforcing a concurrency limit or bounded retries. Test generated package consumers after packing, not only source imports.

## Exercise

Add runtime tests for parsing, immutable updates, zero retry counts, and invalid transitions. Add type tests for a generic selector's output and rejected keys. Add an integration test for the CLI's stdout, stderr, and exit status. Make one implementation bug and one signature bug intentionally, proving that different tests catch them.

## Checkpoint

- You distinguish behavior tests from type contracts.
- You await async work and clean resources.
- You do not confuse any diagnostic with the intended diagnostic.
- You choose tests that survive a valid internal refactor.

## Sources

[Node test runner](https://nodejs.org/docs/latest-v24.x/api/test.html) and [TypeScript expect-error](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html).
