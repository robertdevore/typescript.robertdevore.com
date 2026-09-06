{"number": 20, "slug": "runtime-validation", "title": "Runtime validation & trusted boundaries", "stage": 3, "description": "Parse external data before using it as a trusted application value."}

## Where you are

Your module boundaries are explicit. The more important boundary is now data: HTTP, disk, environment variables, browser storage, and messages all come from outside the checker's proof.

## Mental model

External bytes become an unknown runtime value. Parsing checks structure and domain rules, then constructs a trusted application representation. The sequence matters: a trusted annotation placed before validation is only an unsupported claim.

## JavaScript reality

JSON.parse checks JSON syntax, not your schema. Fetch response.json also parses syntax but does not establish that a user ID is a string. An annotation on its result does not inspect fields. JSON can contain null, arrays, unexpected keys, nested malformed values, and numbers outside your business range.

## TypeScript model

Assign parsed data to unknown immediately. Narrow to a non-null object before reading properties, then check each field. Return a fresh domain object when you want to strip unknown fields. If unknown fields should be rejected, explicitly inspect and reject them instead. Neither policy is universally correct; document yours.

A hand-written parser works well for a small shape and makes the trust boundary visible. A maintained schema library can reduce repetitive nested checks and provide structured error paths. Zod 4 was reviewed for this edition; it is an optional comparison, not a permanent course dependency. Infer types from schemas when possible so runtime and static definitions do not drift, and compare unknown-key behavior, coercion, async validation, and bundle cost before adoption.

## Working example

{{example}}

{{output}}

This parser constructs only the fields it owns. It rejects an invalid ID or retry count, including NaN and fractional values. A successful return is evidence about this parsed value at this moment; later mutation through shared references would require another ownership policy.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The unknown boundary refuses property access before validation. Add a non-null object check and then property checks. A predicate claiming the whole shape without checking each field would be no stronger than an unchecked assertion.

## Runtime drill

Call the parser with null, an array, missing fields, wrong primitive types, negative counts, fractions, and extra fields. Record the chosen extra-field policy. The verified example demonstrates rejection of an invalid shape; the package tests cover a fuller matrix. Test both parser success and useful failure reporting.

## Professional pattern

Validate once at an owned ingress and pass trusted values internally. Revalidate when crossing another independent trust boundary, such as persisted data from an older schema. Separate normalization from validation so callers know whether whitespace is trimmed or strings are coerced. Preserve a structured path for nested errors without including sensitive input in logs.

## Exercise

Extend the job parser with a list of task names and an optional timeout. Reject unknown fields, require nonempty names, and bound list length. Compare your parser against a maintained schema library using the same fixtures. Explain how the inferred output type changes if coercion or defaults are enabled. Keep the simpler implementation that meets the boundary's needs.

## Checkpoint

- You cannot mistake annotated JSON for validated JSON.
- You can parse unknown without broad any or double assertions.
- You define coercion and unknown-key policy explicitly.
- You test malformed data rather than only a happy object.

## Sources

[TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) and [Zod documentation](https://zod.dev/).
