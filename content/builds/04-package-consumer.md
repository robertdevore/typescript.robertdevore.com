{"slug": "package-consumer", "title": "Build 4: package & independent consumer", "stage": 4, "description": "Prepare a releasable package and prove its runtime and declaration contracts from a fresh install."}

## The brief

Turn the library into a publish-ready npm artifact and consume that artifact from a separate application. The objective is a reliable consumer experience, not a public registry upload. Choose an owned package name before any real publication.

Budget three to five hours. Use the source package from Build 2 and the API-design lessons to review its public surface before adding package metadata. The course comparison uses an illustrative @typescript-course scope without claiming that scope on npm.

## Milestone 1 — Define the support envelope

Write down module format, supported Node range, compiler version or support floor, browser assumptions, and public entry points. ESM-only is a reasonable first delivery target. Supporting CommonJS too is a separate compatibility promise requiring real tests.

Acceptance: the README tells a consumer exactly how to import the package and what is supported. It never suggests a require path that has not been tested.

## Milestone 2 — Produce both artifacts

Build JavaScript and declarations into a clean dist directory. Inspect exported signatures and ensure implementation-only types do not leak. Decide whether source maps and declaration maps include or reference source you are willing to distribute.

Acceptance: every declared runtime export exists and every exported type is intentional. Deleted source files leave no stale output after a clean build.

## Milestone 3 — Configure package exports

Create a package exports map with a types condition and the intended runtime condition. Add types and files metadata. Include documentation and license. Keep internal modules out of public exports unless they are deliberately supported subpaths.

Acceptance: supported entry points load. A private deep import fails. The runtime and declaration target files actually exist in the archive.

## Milestone 4 — Inspect the tarball

Run npm pack --dry-run and review the file list. Pack the actual archive. Check that it excludes credentials, test caches, local environment files, and accidental development output. Package size and source disclosure should match your intent.

Do not infer archive contents from the repository tree. npm packaging rules and metadata determine the shipped files. Keep a test for required JavaScript and declaration paths so a future build change cannot quietly remove one.

## Milestone 5 — Install outside the workspace

Create an empty temporary project and install the archive by file path. Copy only consumer source and its config, not your source package. Compile through the package's public name and run the emitted JavaScript.

The course does this automatically:

```sh
npm run check:package
```

Its consumer checks a parser result, summary totals, and generic grouping inference. A negative fixture verifies that an invalid public argument is rejected. The command never invokes npm publish.

Acceptance: the consumer cannot accidentally resolve repository-only files or a root workspace dependency. Both strict checking and execution pass against the packed artifact.

## Milestone 6 — Review compatibility

Change one public return from number to number-or-undefined and observe the consumer effect. Change a runtime error policy and observe behavior tests. These are different compatibility dimensions. Restore the release candidate or document a breaking release deliberately.

For a support matrix, test the oldest advertised runtime and current supported LTS. If claiming browser bundler or CommonJS support, add those consumers too. Do not describe untested combinations as verified.

## Type-checker drill

Expose a private implementation type through an inferred public return. Inspect the emitted declaration and consumer diagnostic when that dependency is missing. Add a deliberate public annotation or exported owned contract to reduce coupling.

## Runtime-boundary drill

Keep a declaration export but remove its JavaScript counterpart from an isolated packed copy. Show that a type check can succeed while execution fails. Restore the package and keep an integration test asserting the actual export's behavior.

## Documentation and release notes

Document input validation, unknown-key policy, mutability, errors, cancellation if applicable, and public module paths. Include one minimal working example compiled by the same version as the library. Explain which changes are breaking, which are fixes, and how consumers migrate.

For actual publication, inspect the registry's current authentication and trusted publishing workflow. Use package-manager authentication, not a token committed to .npmrc. Review the final artifact before uploading; publishing an npm version creates an external release with consequences beyond the local exercise.

## Review rubric

A strong package has a small understandable API, useful inferred consumer types, precise runtime validation, explicit module support, reproducible output, clean contents, and independent consumer tests. It does not require callers to import src files or add assertions to compensate for declaration errors.

## Completion checkpoint

Complete this build when the tarball passes content inspection, runtime import tests, type contract tests, and documented compatibility checks. Keep the artifact and release notes as evidence for the capstone package milestone.
