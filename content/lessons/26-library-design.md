{"number": 26, "slug": "library-design", "title": "Designing library APIs", "stage": 4, "description": "Build APIs with useful inference, clear diagnostics, and stable behavior."}

## Where you are

An application can tolerate internal refactoring under one owner. A library has callers you cannot edit. Its exported types, inferred returns, declaration files, runtime behavior, and documented compatibility envelope are all part of the product.

## Mental model

Design from a consumer's editor outward. Write the simplest ordinary call, inspect its inferred result, then write common mistakes and read the errors. An API that requires consumers to supply several type arguments or assertions may be failing to preserve information naturally.

## JavaScript reality

Overloads do not dispatch at runtime. One implementation receives all supported inputs and must distinguish them with ordinary checks. A callback can throw, mutate shared data, or return a promise; decide what the library owns and document it.

## TypeScript model

Use a union parameter when every supported input shares the same output relationship. Use overloads when input forms guarantee different outputs and the resulting call sites are clearer. The implementation signature is not an extra public overload. A broad implementation accepting a union does not automatically let callers pass that union unless a public signature permits it.

Public return annotations can protect against accidental declaration changes from internal refactoring. Inference remains valuable inside the implementation. Export domain contracts deliberately and keep implementation-specific helper types internal. A generic that appears only once often adds little beyond its constraint.

## Working example

{{example}}

{{output}}

The literal key determines the numeric return, while the omitted key returns the whole summary. The implementation checks an actual argument. Try calling with a union key expression and decide whether an additional overload is useful or an ordinary union API is clearer.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The caller supplied a key outside the advertised contract. Better diagnostics come from a small key union than from a deeply nested conditional failure. Keep the implementation honest; assertions cannot add a real supported field.

## Runtime drill

Change the implementation to return the wrong numeric field while leaving signatures unchanged. Type tests can still accept the declared contract; runtime tests with distinct fixture values reveal the bug. Now change the public return to a broad union while preserving values and observe the consumer type regression.

## Professional pattern

Review exported declarations in code review. Test typical and mistaken call sites. Minimize exposed dependencies so a private schema-library change does not force every consumer to upgrade. Document mutability, error behavior, async ownership, and cancellation, not just parameter names.

## Exercise

Take the Stage 2 utility and design three consumer examples: a basic summary, a custom grouping, and invalid input. Keep the default call free of explicit type arguments. Add one justified overload and compare it to a union alternative. Write a short API review explaining the choice through inference, diagnostics, runtime behavior, and future compatibility.

## Checkpoint

- You can evaluate an API from the caller's editor.
- You understand overload declarations versus implementation signatures.
- You treat inferred public types as versioned contracts.
- You use generic restraint to improve readability.

## Sources

[More on functions](https://www.typescriptlang.org/docs/handbook/2/functions.html) and [declaration do's and don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html).
