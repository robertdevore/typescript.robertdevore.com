{"number": 36, "slug": "shipping", "title": "Shipping & maintaining TypeScript", "stage": 5, "description": "Make releases reproducible and preserve runtime, type, package, and operational contracts."}

## Where you are

You have the skills to implement a serious TypeScript system. Shipping combines them into repeatable evidence. A release is a claim about a concrete artifact and its supported environments, not just a green editor.

## Mental model

A release gate covers installation, strict checking, behavior tests, type contracts, linting, formatting, clean build output, package contents, compatibility, and operational verification. Each gate should correspond to a real promise. More redundant commands do not necessarily increase confidence.

## Runtime and tooling reality

A lockfile makes dependency resolution reproducible, but the runtime, operating system, and native optional compiler packages also matter. Record supported Node versions and use npm ci. Clean generated output so deleted source cannot survive a release. Tests must run against the same artifact that will ship.

Security boundaries still require validation, authorization, bounded work, and careful logging. Types do not make an arbitrary URL safe to fetch or a shell command safe to execute. The capstone executes a fixed registry of owned job handlers rather than arbitrary code supplied by users.

## TypeScript model

Compiler upgrades can change inference, declarations, module resolution, default libs, and strict defaults. Read release notes and current iteration plans, but keep previews out of the production baseline unless explicitly evaluated. Compare public declaration output and run consumer tests before accepting an upgrade.

A type-only breaking change can require a major release under your contract. A dependency's declaration change can propagate through an exposed public type. Reduce that coupling by exporting your own stable domain contracts where appropriate. Keep the compiler support floor honest by testing it, not by hoping syntax is old enough.

## Working example

{{example}}

{{output}}

The executable release check asserts an invariant rather than merely printing a success banner. The course repository's verify command runs real examples, diagnostic fixtures, site checks, lint, and format checks; browser and package checks add integration evidence.

## Type-checker drill

{{invalid}}

{{diagnostic}}

A release metadata contract expects a numeric schema version. Parse metadata from external storage and review compatibility when changing it. An annotation on a JSON file is not a migration strategy.

## Release procedure

Use an isolated branch for dependency and compiler upgrades. Record the old and new versions, read changes, install from the lockfile, and run the complete gate. Inspect emitted declarations and package contents. Test an installed consumer and the deployed URL. Keep a known previous deployment available for rollback.

For the course repository:

```sh
npm ci
npm run verify
npm run check:package
npm run test:browser
```

Review the research ledger's verification date before using its currency claims in a later release. Registry tags and iteration plans can change independently; a stale beta tag does not supersede a newer stable release.

## Runtime drill

Build, remove a source module, and rebuild without cleaning in a throwaway copy. Inspect the stale output that can remain. Then use the clean build procedure and confirm it disappears. Repeat the package consumer test against the exact tarball to catch release-only import mistakes.

## Professional pattern

Keep release notes focused on consumer impact and migration actions. Track compiler timings when a change materially alters type complexity. Review deprecations before removals. Make a rollback decision based on the failure's effect, not on whether the deployment provider says the upload succeeded.

## Exercise

Finish the [job execution capstone](/builds/capstone/). Produce a release candidate, a package tarball, an installed consumer check, runtime integration tests, type tests, and an operator runbook. Introduce one schema-version change and document migration behavior for older persisted jobs. Demonstrate graceful cancellation and recovery after restart.

## Checkpoint

- You can reproduce a release from a clean checkout.
- You review compiler and dependency upgrades deliberately.
- You test installed and deployed artifacts.
- You can explain which guarantees remain runtime responsibilities.

## Sources

[TypeScript releases](https://devblogs.microsoft.com/typescript/), [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci), and [Node release support](https://nodejs.org/en/about/previous-releases).
