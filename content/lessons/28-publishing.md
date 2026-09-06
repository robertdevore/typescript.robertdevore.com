{"number": 28, "slug": "publishing", "title": "Publishing typed packages", "stage": 4, "description": "Test the tarball that consumers install, including exports, declarations, and compatibility."}

## Where you are

Your declarations describe a reviewed API. Packaging determines whether consumers can actually load that API. A source import inside a workspace is not equivalent to installing the published archive.

## Mental model

The release artifact is a tarball containing JavaScript, declarations, metadata, documentation, and license information. Test that artifact as a consumer would. Repository-only paths, missing build output, and mismatched exports often remain invisible until this step.

## Runtime and package-manager reality

Node reads the installed package.json and loads actual files. npm's files field and ignore rules decide what enters the tarball. A types entry cannot compensate for missing JavaScript. A source map referring to an unshipped source file may provide poor debugging; decide whether to include source or inline source content.

## TypeScript model

Declaration format must match runtime format. ESM declarations and CommonJS declarations represent different module identities; dual packages may require distinct .d.mts and .d.cts paths. Do not point both conditions at one declaration blindly. For this course's first package, ESM-only output keeps the contract small and explicit.

An exports map defines public entry points. Put the types condition before runtime conditions, and use an explicit types field for compatible tooling. Test supported subpaths and reject private deep imports. If supporting CommonJS is a real consumer need, add and test that delivery path deliberately rather than publishing speculative dual output.

## Working example

{{example}}

{{output}}

The example illustrates a tiny exported surface. The complete package in `labs/package` emits JavaScript and declarations and is consumed by a fresh external fixture during verification.

## Package workflow

From `labs/package`, build and inspect before publishing:

```sh
npm run build
npm pack --dry-run
npm pack
```

Install the resulting archive in an empty temporary consumer, import the package by its public name, type-check, and run the emitted JavaScript. The repository automates this in `scripts/check-package.mjs`; it does not contact the npm publication endpoint.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The public contract rejects the wrong argument. A package's compatibility tests should preserve that rejection across release builds, rather than only checking its source signature in the development repository.

## Runtime drill

Remove dist/index.js from a copy of the packed artifact while keeping declarations. Observe that consumer checking can succeed while runtime import fails. Then remove the declarations and observe the opposite boundary. Restore the artifact; both are required.

## Professional pattern

Document the supported Node range, module format, compiler support floor, and browser assumptions. Type changes can be breaking even when runtime behavior is unchanged: narrowing accepted input, widening a return, or changing inference may break callers. Review release notes, run compatibility fixtures, and follow semver for your advertised contract.

Before a real publish, choose an owned unique package name, review files, authenticate through the package manager's supported mechanism, and use its current trusted publishing or 2FA workflow. Never put credentials in example config. This course produces publish-ready artifacts; publishing the learner's own package is an intentional release action.

## Exercise

Complete [Build 4: package and consumer](/builds/package-consumer/). Pack your library, install it outside the monorepo, type-check good and bad calls, and execute the consumer. Test at the oldest supported Node version and the current LTS. Write a release note describing one type-level compatibility change.

## Checkpoint

- You validate actual archive contents.
- You test declarations and runtime imports independently.
- You choose an explicit module support policy.
- You understand type-level semver consequences.

## Sources

[Node package exports](https://nodejs.org/docs/latest-v24.x/api/packages.html), [TypeScript declaration publishing](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html), and [npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack).
