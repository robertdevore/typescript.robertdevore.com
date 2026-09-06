{"number": 24, "slug": "static-analysis", "title": "Linting, formatting & static analysis", "stage": 3, "description": "Give each quality tool a clear job and keep ecosystem compatibility explicit."}

## Where you are

Your tests cover behavior and type relationships. Linting and formatting address other costs: likely mistakes and inconsistent presentation. They complement the compiler; their rules are not the language definition.

## Mental model

The compiler checks static language contracts. A linter applies selected analysis rules. A formatter makes presentation consistent. Runtime tests execute behavior. Validation proves data at an ingress. Passing any one of them does not imply the others passed.

## JavaScript reality

A floating promise can reject after its owner has finished. Syntactically valid code can compare the wrong variables or forget a cleanup path. Some lint rules identify these patterns, but rule effectiveness depends on parser support and, for type-aware rules, access to type information.

## TypeScript model

A compiler can accept a void callback returning a promise whose result gets ignored. A type-aware promise rule may flag that use, but TypeScript 7's native API transition affects tools that embed the older checker. Verify the exact parser and plugin support matrix before enabling a type-aware configuration against 7.x. Do not assume installing the newest compiler automatically upgrades an embedded consumer.

This course uses ESLint's current flat configuration for its JavaScript site tooling, Prettier for source presentation, and the native compiler directly for TypeScript examples. It does not claim a type-aware ESLint integration that was not tested. The application exercises teach explicit promise ownership independent of a particular lint rule.

## Working example

{{example}}

{{output}}

The promise has an explicit rejection owner. The second operation is awaited as part of the top-level module lifecycle. Adding void to a promise call can express deliberate ignoring to some lint rules, but it does not catch a rejection.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The compiler checks the return contract; a formatter cannot fix it. In a separate JavaScript tooling file, introduce an unused binding and see ESLint report it. Then change whitespace and let Prettier normalize it. Keep these checks separate so a failure identifies the responsible layer.

## A small workflow

From the course repository run:

```sh
npm run check:examples
npm test
npm run lint
npm run format:check
```

Pin tool versions and commit the lockfile. Use a format command locally and a format check in CI. Avoid mixing several competing formatters. Scope configuration so generated diagnostics and binary fonts are not rewritten as source.

## Runtime drill

Create an unawaited rejecting promise in an isolated experiment. Observe the process outcome in the supported Node runtime. Then attach a rejection handler and decide how its failure should affect exit status. A linter suppression is not error handling.

## Professional pattern

Enable a small justified ruleset, fix or document violations, and add a rule when it protects an observed mistake. Avoid mass auto-fixes across a repository during an unrelated change. Keep temporary suppressions local and explain the invariant that makes them acceptable.

## Exercise

Add check, test, lint, and format-check scripts to the application. Introduce one failure for each and confirm the right command catches it. Evaluate a maintained TypeScript linter parser's declared compiler compatibility before adoption. If native type-aware integration remains unsupported, document the gap and retain direct compiler checks rather than silently using different compiler semantics.

## Checkpoint

- You can explain each tool's unique responsibility.
- You own promises explicitly.
- You verify plugin/compiler compatibility.
- You do not present style preferences as language truths.

## Sources

[ESLint getting started](https://eslint.org/docs/latest/use/getting-started), [Prettier installation](https://prettier.io/docs/install), and [TypeScript 7 ecosystem notes](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/).
