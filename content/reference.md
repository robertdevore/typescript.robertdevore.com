Use this index when you already know the question. For the complete sequence, return to the [learning path](/course/). For an error message, [search the course](/search/).

## Runtime versus static contracts

| Question                                     | Start here                                                    |
| -------------------------------------------- | ------------------------------------------------------------- |
| Why doesn't a type annotation validate JSON? | [Runtime validation](/lessons/runtime-validation/)            |
| What is unknown vs any?                      | [any, unknown, never, void](/lessons/any-unknown-never-void/) |
| Why can a readonly value change?             | [Objects and aliasing](/lessons/objects-arrays-tuples/)       |
| Why does this compile and still fail?        | [Runtime safety](/lessons/runtime-safety/)                    |
| Is a brand an authorization check?           | [Advanced type design](/lessons/advanced-design/)             |

## Inference and modeling

| Concept                                       | Lesson                                                           |
| --------------------------------------------- | ---------------------------------------------------------------- |
| Literal widening, const versus let            | [Values and types](/lessons/values-and-types/)                   |
| Control-flow analysis, guards, truthiness     | [Narrowing](/lessons/narrowing/)                                 |
| Structural typing, excess property checking   | [Structural typing](/lessons/structural-typing/)                 |
| Interface extension, intersections, merging   | [Interfaces and aliases](/lessons/interfaces-and-aliases/)       |
| Assertions, as const, satisfies               | [Assertions and satisfies](/lessons/assertions-const-satisfies/) |
| Generic constraints and inference             | [Generics](/lessons/generics/)                                   |
| keyof, typeof, T[K]                           | [Indexed access](/lessons/keyof-typeof-indexed-access/)          |
| Partial, Pick, Omit, key remapping            | [Mapped types](/lessons/mapped-types/)                           |
| infer, distributive conditionals              | [Conditional types](/lessons/conditional-types/)                 |
| String event names                            | [Template literal types](/lessons/template-literal-types/)       |
| Discriminated unions, never, state machines   | [Exhaustiveness](/lessons/exhaustiveness/)                       |
| Contravariance, covariance, method bivariance | [Variance](/lessons/variance/)                                   |

## Applications and libraries

| Concept                                              | Lesson                                           |
| ---------------------------------------------------- | ------------------------------------------------ |
| target, lib, strict, exactOptionalPropertyTypes      | [tsconfig](/lessons/tsconfig/)                   |
| NodeNext, moduleResolution, ESM/CJS, package exports | [Modules](/lessons/modules/)                     |
| Promises, AbortController, async iteration           | [Async](/lessons/async/)                         |
| fetch, status, retries, pagination                   | [HTTP clients](/lessons/http-clients/)           |
| Tests, inference tests, expected failures            | [Testing](/lessons/testing/)                     |
| ESLint, Prettier, compiler responsibilities          | [Static analysis](/lessons/static-analysis/)     |
| Process signals, configuration, graceful shutdown    | [Node application](/lessons/node-application/)   |
| Overloads, public inference                          | [Library design](/lessons/library-design/)       |
| .d.ts, ambient declarations, DefinitelyTyped         | [Declaration files](/lessons/declaration-files/) |
| npm pack, types, ESM delivery                        | [Publishing](/lessons/publishing/)               |
| Workspaces, project references                       | [Large repositories](/lessons/workspaces/)       |
| Compiler timings, native parallelism                 | [Performance](/lessons/performance/)             |
| allowJs, checkJs, JSDoc                              | [Migration](/lessons/javascript-migration/)      |
| Prototypes, private fields, generics in classes      | [Advanced design](/lessons/advanced-design/)     |
| Domain boundaries, adapters, DTOs                    | [Architecture](/lessons/architecture/)           |
| Parser, binder, checker, emit, LSP                   | [Compiler tooling](/lessons/compiler-tooling/)   |
| CI, upgrades, semver, release evidence               | [Shipping](/lessons/shipping/)                   |

## Error-oriented index

| Diagnostic family                            | What to inspect                                                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| TS2322: not assignable                       | Required shape, possible absence, function direction; [structural typing](/lessons/structural-typing/) |
| TS2345: argument not assignable              | Parameter contract and narrowing; [generics](/lessons/generics/)                                       |
| TS18046: unknown value                       | Evidence at the boundary; [runtime validation](/lessons/runtime-validation/)                           |
| TS2532 / TS18047: possibly undefined or null | Presence policy; [errors and null](/lessons/errors-and-null/)                                          |
| TS2353: extra property                       | Fresh literal versus wider object; [structural typing](/lessons/structural-typing/)                    |
| TS2375: exact optional properties            | Missing versus explicit undefined; [tsconfig](/lessons/tsconfig/)                                      |
| TS2540: readonly write                       | Mutation ownership; [objects](/lessons/objects-arrays-tuples/)                                         |
| TS1361: type-only import used as value       | Erased binding versus runtime import; [modules](/lessons/modules/)                                     |
| TS2578: unused expect-error                  | Stale or ineffective negative test; [testing](/lessons/testing/)                                       |

Exact diagnostics depend on source and the pinned compiler. The numbered lessons show real captured diagnostics, including locations and alternatives, rather than a universal error-text promise.
