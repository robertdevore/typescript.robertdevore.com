{"number": 14, "slug": "conditional-types", "title": "Conditional types & infer", "stage": 2, "description": "Express useful type relationships and understand distribution before adding complexity."}

## Where you are

Mapped types transform properties. Conditional types select a type based on an assignability relationship. They become useful when an API's output shape depends on an input type, rather than merely on one concrete property.

## Mental model

`T extends U ? A : B` asks a type-level assignability question. It is not a runtime conditional. `infer` introduces a type variable from a matched shape, such as the result inside a promise-like type. Read the relationship in words before expanding the syntax.

## JavaScript reality

A conditional type does not branch over a value or await a promise. Your JavaScript implementation must perform any runtime test or asynchronous operation. A generic implementation can need an overload or a simpler return union because the checker cannot always reduce a conditional on an unresolved type parameter inside its body.

## TypeScript model

A conditional with a naked type parameter on the left distributes over unions. Substituting string-or-number evaluates each member and joins the results. Wrapping both sides in tuples checks the whole union together and disables this distribution.

Never represents an empty union, so distributive conditionals on never can produce never without evaluating the branch you expected. Unknown and any have special behavior too. Avoid pretending a conditional helper is universally correct after testing only one friendly input.

`Awaited`, `ReturnType`, `Parameters`, `Extract`, and `Exclude` cover common transformations. Prefer them to reimplementing subtle promise assimilation or overload rules. A small custom helper is useful when it captures a domain relationship the standard utilities do not provide.

## Working example

{{example}}

{{output}}

The type assertions in this lab are compile-time equality constraints, not runtime casts. Distribution yields separate arrays for the individual union members; the tuple-wrapped version produces one array whose elements may be either member. The printed value only demonstrates the runtime collection.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The equality constraint proves the predicted type is wrong. Rewrite your prediction based on whether distribution occurs, then check again. These diagnostics are captured from the real compiler, not invented editor hovers.

## Runtime drill

Map an array of mixed values to strings and compare that JavaScript operation with merely declaring a conditional alias. The alias emits no transformation. This distinction matters when a public function claims a transformed return type but simply returns its original input.

## Professional pattern

Name intermediate transformations, keep error output understandable, and test boundaries such as never and unions. If a concrete overload gives callers a clearer result, use it. Do not make application developers learn a recursive conditional implementation to understand one function call.

## Exercise

Define a helper that extracts the success payload from your result union. Test a success member, an error member, their union, and never. Then use the extracted type in a consumer test while keeping the runtime code's discriminant check. Explain why extracting the success type does not prove an operation succeeded.

## Checkpoint

- You can predict distribution and disable it deliberately.
- You can explain infer as extraction from a matched shape.
- You know a type conditional emits no branch.
- You can reject an overcomplicated abstraction when a union suffices.

## Sources

[Conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) and [utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html).
