Technical verification date: **September 6, 2026**. This is a dated edition, not a claim that a dependency or proposal will never change. The repository keeps a machine-readable evidence ledger and reproducible compiler, runtime, package, and browser checks.

## Stable teaching baseline

| Area                                                | Verified state                                                                                                                       | Course decision                                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| TypeScript                                          | **STABLE: 7.0.2** from npm latest                                                                                                    | Pin examples and diagnostics to 7.0.2                                                   |
| TypeScript 7 native compiler                        | **STABLE**                                                                                                                           | Use tsc; explain native architecture without requiring Go knowledge                     |
| TypeScript 7 language service                       | **STABLE**, LSP based                                                                                                                | Verify the editor's selected integration and project                                    |
| Native programmatic API                             | **EXPERIMENTAL / PROPOSED stabilization**                                                                                            | Do not teach the old JS compiler API as the permanent native API                        |
| TypeScript 7.1                                      | **PROPOSED**, active iteration plan; nightly builds exist                                                                            | Keep its planned features out of the core baseline                                      |
| Registry beta/RC tags                               | beta 6.0.0-beta, rc 7.0.1-rc at inspection                                                                                           | Older tags do not override the newer stable release                                     |
| Node                                                | **STABLE: Node 24 LTS**, tested at 24.20.0                                                                                           | Explicit Node ESM configs and runtime tests                                             |
| ESM and promises                                    | **STABLE ECMAScript**                                                                                                                | Teach runtime semantics, not TypeScript substitutes                                     |
| Decorators                                          | **TC39 PROPOSAL**, current repository reports Stage 2.7                                                                              | Separate from stable JS; legacy experimentalDecorators is a different model             |
| Explicit resource management / iterator helpers     | **STABLE / finished proposals**; resource-management publication expected 2027, iterator helpers published 2025; host support varies | Core uses explicit finally and ordinary iteration; verify host APIs before optional use |
| Legacy Node10/classic module resolution and baseUrl | **SUPERSEDED / removed in TS7**                                                                                                      | Teach NodeNext or a justified bundler pipeline                                          |

The [TypeScript release announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) describes the native transition and changed defaults. The [current 7.1 iteration plan](https://github.com/microsoft/TypeScript/issues/63703) was updated September 5; plans can move, and cached search results can show older dates. Its current API stabilization work is not treated as already shipped.

## Authoritative source ledger

- [Handbook](https://www.typescriptlang.org/docs/handbook/intro.html): inference, narrowing, generics, structural compatibility, and type transformations.
- [Design goals](https://github.com/microsoft/TypeScript/wiki/TypeScript-Design-Goals): compatibility and deliberate limits; types do not become runtime checks.
- [Module theory](https://www.typescriptlang.org/docs/handbook/modules/theory.html) and [module reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html): host-dependent resolution and emit.
- [TSConfig reference](https://www.typescriptlang.org/tsconfig/): strict policies, environment declarations, and build configuration; release notes take precedence for changed TS7 defaults.
- [Declaration guidance](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html): declarations describe existing runtime APIs.
- [TypeScript repository](https://github.com/microsoft/TypeScript) and [native changes](https://github.com/microsoft/typescript-go/blob/main/CHANGES.md): implementation changes, migration caveats, and current tooling work.
- [Node 24 packages](https://nodejs.org/docs/latest-v24.x/api/packages.html) and [TypeScript execution](https://nodejs.org/docs/latest-v24.x/api/typescript.html): actual runtime loading and the distinction between stripping syntax and checking.
- [ECMAScript specification](https://tc39.es/ecma262/) and [TC39 proposal tracking](https://github.com/tc39/proposals): stable semantics versus proposals. The living specification can be ahead of a chosen host runtime.
- [Node test runner](https://nodejs.org/docs/latest-v24.x/api/test.html), [ESLint](https://eslint.org/docs/latest/use/getting-started), [Prettier](https://prettier.io/docs/install), and [Zod](https://zod.dev/): maintained tool choices and optional schema comparison.

## Contributor reference lenses

These people did not review or endorse this course. Their published work provides questions to apply during an editorial review. Contributions were checked through primary publications and repository history rather than inferred from popularity.

| Lens               | Verified contribution                                                                                                                                                                                                       | Applied review                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Anders Hejlsberg   | [Native-port architecture announcement](https://devblogs.microsoft.com/typescript/typescript-native-port/) and [recursion work](https://github.com/microsoft/typescript-go/commit/12548e2a13b61004a2464686df7cbfe88640bbf9) | Does the course respect inference and the actual language model?             |
| Ryan Cavanaugh     | [Maintained compiler FAQ](https://github.com/microsoft/TypeScript/wiki/FAQ), including method bivariance                                                                                                                    | Are assignability and deliberate unsoundness explained correctly?            |
| Daniel Rosenwasser | [7.0 release](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) and [7.1 planning](https://github.com/microsoft/TypeScript/issues/63703)                                                                | Are releases, migration, and future plans separated?                         |
| Andrew Branch      | [Native content-mapper work](https://github.com/microsoft/typescript-go/commit/01b9e721f3d7f8037d700daff94f5808c1afb97e) and published module guidance                                                                      | Do emitted files and package conditions work for real consumers?             |
| Wesley Wigham      | [Native API test portability work](https://github.com/microsoft/typescript-go/commit/16c25522e1230b69b11210cfad066d779e6319ba)                                                                                              | Are declaration and tooling claims backed by tests?                          |
| TC39               | [Proposal process and current tracking](https://github.com/tc39/proposals)                                                                                                                                                  | Are proposals kept distinct from stable JavaScript and runtime availability? |

## Verification policy

Every numbered working example is compiled and executed. Invalid examples are separate programs checked against expected diagnostic codes; their actual output is inserted into the lesson. Exported inference shown by the explorer comes from emitted declarations. Runtime-boundary tests deliberately execute unsafe examples in isolation to show the difference between accepted types and actual behavior.

The package check builds and packs the library, installs the tarball into a temporary consumer, checks declarations and inference, rejects a bad call, and executes the consumer. Browser tests cover search, completion persistence, responsive layout, DOM guards, accessibility, and console errors. The production check visits the canonical domain and verifies routes and assets after deployment.

The full internal ledger is [in the repository](https://github.com/robertdevore/typescript.robertdevore.com/tree/main/research). It includes source provenance, feature status, lesson scope, runtime implications, review decisions, and verification records. Future maintainers should rerun the currency gate before changing the published date.
