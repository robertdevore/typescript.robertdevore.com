{"number": 30, "slug": "performance", "title": "Compiler & editor performance", "stage": 4, "description": "Find what slows the compiler or editor before changing your types."}

## Where you are

Your package graph has explicit boundaries. Before changing types for speed, identify the slow command, its inputs, the machine, and the compiler version. Native code improves the baseline but does not make arbitrary type complexity free.

## Mental model

Separate program loading, parsing, checking, declaration emit, and editor requests. Runtime benchmarks measure the running JavaScript. A faster JavaScript algorithm does not necessarily make a conditional type cheaper, and a simpler type may change no emitted JavaScript at all.

## Runtime and tooling reality

Editor responsiveness includes file watching, filesystem cost, extension activity, project discovery, and language-service requests. A quick CLI check does not prove a slow editor is using the same version or project. Record the selected workspace language server and compare the same file set.

## TypeScript model

Large unions, repeated intersections, recursive conditionals, and enormous generated declarations can increase work. Named intermediate types can improve readability and avoid repeated expansion, but do not claim a universal speedup without measurement. Prefer interfaces for ordinary extension when they communicate the model more clearly; measure before rewriting a repository.

TypeScript 7's native architecture supports parallel checking and parallel project builds. More checkers can increase memory. Keep the configuration fixed when comparing results, and record whether the cache is cold or warm. Legacy compiler tracing recipes may not exist unchanged in the native compiler; inspect current help and documentation before recommending a flag.

## Working example

{{example}}

{{output}}

The simple contract avoids encoding arbitrary recursive JSON traversal at the type level. Its runtime loop is straightforward and independent of compiler tuning.

## Measurement lab

Run these from a project root and save the output with compiler and Node versions:

```sh
npx tsc --version
npx tsc --help --all
npx tsc --noEmit --extendedDiagnostics
```

Use the diagnostic timing categories to decide where to investigate. For project references, compare clean and incremental `tsc -b` separately. Repeat enough times to notice variance; report the median and the machine used. Do not use the release blog's benchmark multiplier as your own measurement.

## Type-checker drill

{{invalid}}

{{diagnostic}}

A recursively self-expanding alias cannot produce a finite useful result here. The failure is more basic than slow checking. Replace it with a bounded representation or runtime algorithm instead of increasing recursion complexity until diagnostics become unreadable.

## Runtime drill

Compare a simple declared API and a heavily transformed equivalent while inspecting their emitted JavaScript. If the runtime code is identical, a runtime benchmark cannot evaluate the type-checking cost. Conversely, optimizing the type expression will not accelerate network requests.

## Professional pattern

Reduce a slow type to a small reproducible case before changing public contracts. Track editor symptoms separately from build timings. Place generated types behind stable interfaces when consumers do not need the entire generated structure. Keep declaration output understandable and avoid forcing downstream users to repeatedly evaluate private transformations.

## Exercise

Create two equivalent public contracts: one with a named object model and one with nested mapped/intersection helpers. Measure checking and declaration output on a repeated consumer fixture. Record size, timings, and error quality. Choose the simpler version unless the complex one provides a demonstrated consumer benefit. Document uncertainty if the timing difference is noise.

## Checkpoint

- You separate runtime, compiler, and editor performance.
- You collect a reproducible baseline before tuning.
- You understand CPU/memory tradeoffs in native parallelism.
- You resist complexity without measurable value.

## Sources

[TypeScript 7 architecture and controls](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) and [TypeScript performance guidance](https://github.com/microsoft/TypeScript/wiki/Performance).
