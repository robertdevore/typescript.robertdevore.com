{"number": 9, "slug": "any-unknown-never-void", "title": "any, unknown, never & void", "stage": 2, "description": "Choose the right meaning for unchecked values, unknown inputs, impossible cases, and ignored returns."}

## Where you are

You understand assignability. Four frequently confused types sit at important edges of that model. Their short names conceal very different contracts; none is a universal replacement for the others.

## Mental model

`unknown` says the value exists but its useful properties have not been established. `any` opts out of normal checking for operations involving that value. `never` represents no possible value. `void` describes a return value the caller should not meaningfully consume.

## JavaScript reality

All four are erased. A value annotated unknown could be anything at runtime. A void callback can return a number, because JavaScript still returns whatever its implementation returns. A never-returning function must actually fail to return normally, for example by throwing; a type annotation does not create that behavior.

## TypeScript model

You can assign ordinary values to unknown, but must narrow before reading their properties. Any permits such operations without evidence and can contaminate values derived from it. Prefer unknown at JSON, configuration, plugin, and message boundaries. A generic is more useful than either when preserving a known caller relationship.

Never is a subtype of every type and disappears from ordinary unions. It is useful when a branch has no remaining possible cases. It differs from void: an ordinary function can finish and produce an ignored result, while a never-returning function cannot finish normally.

A function assigned to a void-returning callback contract may return a value that consumers ignore. This accommodates common callbacks such as pushing into an array. It also means an async callback can accidentally be accepted where its promise will be ignored. A void signature is not a guarantee that asynchronous failures will be awaited.

## Working example

{{example}}

{{output}}

The unknown input requires a category check. The void contract allows the array mutation's numeric return to be ignored. The fail helper really throws. Use the right contract for each role rather than one broad escape type.

## Type-checker drill

{{invalid}}

{{diagnostic}}

Unknown blocks property access until you have evidence. Check `typeof value === "string"` before uppercasing, or make the function accept a string if validation belongs to its caller. An assertion only changes what the checker believes.

## Runtime drill

Replace the unknown boundary with a locally justified demonstration of any and pass a number to the uppercase operation. Catch and record the resulting TypeError. This intentional unsafe experiment illustrates the escape hatch; do not carry any into the library implementation. The repository's boundary test executes the failure separately.

## Professional pattern

Contain intentional any behind the smallest adapter and document why unknown, a generic, or a specific type cannot express the operation. Treat old declaration files returning any as untrusted boundaries. Use exhaustive never checks for closed state models, but remember external data must first be parsed into that model.

## Exercise

Audit your Stage 1 utility for any and assertions. Replace unknown-boundary escape hatches with parsing. Add a function that always throws and annotate its return. Create one callback whose return is ignored and one asynchronous callback whose promise must be awaited; explain why their signatures differ.

## Checkpoint

- You explain all four types without calling them interchangeable.
- You can narrow unknown and identify any propagation.
- You can distinguish ignored returns from absent execution.
- You can justify each intentional escape hatch.

## Sources

[More on functions](https://www.typescriptlang.org/docs/handbook/2/functions.html) and [unknown and never](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).
