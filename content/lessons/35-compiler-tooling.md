{"number": 35, "slug": "compiler-tooling", "title": "Compiler, language service & LSP", "stage": 5, "description": "Understand diagnostics and editor behavior without assuming the old compiler API is permanent."}

## Where you are

You can organize a large application. A conceptual view of the toolchain helps diagnose surprising errors, editor disagreements, slow navigation, and integration breakage during compiler upgrades.

## Mental model

Parsing turns source text into an abstract syntax tree. Binding associates declarations and names into scopes and symbols. Checking establishes types and compatibility. Emit produces JavaScript, declarations, and maps when requested. The language service answers interactive questions using related knowledge. LSP transports those questions and responses between editor and server.

## JavaScript and tooling reality

None of these stages executes your application's external requests to discover their true results. The checker analyzes source and declarations. A transpiler that only removes syntax does not perform the same work as the checker. Source maps connect emitted locations back to source; they do not change runtime control flow.

An editor may be attached to an inferred project rather than your intended config. Another extension may embed a different compiler. Check the selected version, project membership, and diagnostics source before assuming a compiler bug. A minimal CLI reproduction removes many editor variables.

## TypeScript 7 model

The current stable 7.0.2 uses a native compiler written in Go and an LSP-based language service. Parallel parsing/checking/building changes implementation and performance characteristics without making types exist at runtime. The legacy JavaScript compiler API is not a stable native API surface.

The current 7.1 iteration plan includes API stabilization work. A scheduled item is PROPOSED until released; do not teach imports from an imagined native API. Tools that need the older programmatic compiler can remain on a compatible TypeScript 6 dependency while application checks use the native CLI, provided the split is explicit and tested.

## Working example

{{example}}

{{output}}

Inspect this example's .ts, .js, .d.ts, and .js.map outputs. The source contains the public implementation, JavaScript contains runtime behavior, declarations contain the callable contract, and the map contains location relationships. This is an inspectable compiler pipeline without depending on an unstable programmatic API.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The misspelled name fails name resolution before any interesting generic behavior matters. Fix the identifier and rerun. When debugging diagnostics, distinguish unresolved names from valid names with incompatible types; they suggest different investigations.

## Runtime drill

Run the generated JavaScript with source maps enabled, introduce an exception inside the helper, and inspect its stack. Then remove the map and compare locations. Finally run a syntax-stripping development path and show that a deliberately incorrect annotation does not automatically become a check failure there.

## Professional pattern

Create small reproducible cases using the exact installed compiler and config. Record expected behavior, actual diagnostic, version, and whether the editor agrees. Reduce dependencies before filing a compiler issue. For tooling integrations, check released API documentation and supported versions rather than copying old compiler-construction tutorials unchanged.

## Exercise

Write a diagnostic report for a module that the editor accepts but the CLI rejects under different configs. Identify the responsible project and reconcile the settings. Add a script reporting compiler version and effective config. Design a future code-generation tool around a stable CLI boundary unless a current released API meets its needs.

## Checkpoint

- You can explain parser, binder, checker, emit, and language service.
- You know LSP is a protocol, not a runtime.
- You can reduce an editor disagreement to a reproducible check.
- You distinguish stable native tools from proposed API integrations.

## Sources

[TypeScript 7 release](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), [native compiler repository](https://github.com/microsoft/typescript-go), and [7.1 iteration plan](https://github.com/microsoft/TypeScript/issues/63703).
