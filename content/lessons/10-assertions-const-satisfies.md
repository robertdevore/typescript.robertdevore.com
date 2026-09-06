{"number": 10, "slug": "assertions-const-satisfies", "title": "Assertions, as const & satisfies", "stage": 2, "description": "Compare annotations, assertions, const assertions, and satisfies."}

## Where you are

Unknown taught you to earn property access with evidence. This lesson separates three things often confused in code review: defining a variable's type, claiming a different type, and checking compatibility while retaining useful expression information.

## Mental model

An annotation establishes a declared contract. An assertion tells the checker to trust a claim it cannot otherwise derive. `satisfies` checks an expression against a target without replacing the expression's resulting type with that target. Contextual typing still participates, so satisfies is not a magical guarantee that every original literal always stays identical.

## JavaScript reality

Assertions and satisfies disappear from emitted JavaScript. Neither validates incoming JSON, converts a string to a number, freezes an object, or throws when the claim is false. A non-null assertion does not create a DOM element. A const assertion does not stop a JavaScript consumer from mutating an object.

## TypeScript model

`as const` preserves literal values and produces readonly properties or tuple positions for literal expressions. This is useful for configuration keys and event names. It is not a general deep immutability operation on arbitrary referenced objects.

A broad annotation can hide useful specific keys from a configuration object. Satisfies can verify the shape while leaving those keys available to inference. Use it to catch a misspelled option without immediately widening the whole object to a general record.

Assertions are sometimes warranted at a carefully audited library implementation boundary where the runtime algorithm preserves a relationship the checker cannot express. Localize that claim and test its public contract. Double assertions through unknown remove many compatibility checks and deserve particular scrutiny.

## Working example

{{example}}

{{output}}

The configuration must contain finite-shaped numeric settings according to its static contract, while callers retain its known keys. This still does not prove the numeric values obey a business range. The readonly route tuple produces a closed union of known route names in later lessons.

## Type-checker drill

{{invalid}}

{{diagnostic}}

Satisfies catches the string where a number belongs. Parse external text to a number and validate it before constructing the configuration. If the literal was simply mistyped, fix it directly. Appending `as unknown as number` hides the mismatch and changes nothing at runtime.

## Runtime drill

Parse the JSON text `{"id":42}` and assert that the result has a string ID. Call an uppercase method and observe failure. Then repeat with an unknown variable and a real guard. Compare the emitted JavaScript. The repository's boundary regression test makes this false assertion fail in a controlled way.

## Professional pattern

Ask what evidence backs each assertion. At an external boundary the answer is usually a parser. Inside a generic implementation the answer may be an invariant and tests. At a DOM boundary the answer is checking the element's actual constructor. Do not write a larger type puzzle to avoid one justified, well-contained claim, but do not normalize cast-driven application code.

## Exercise

Create a route configuration with a closed method union and numeric timeout. Use satisfies to check it and indexed access to preserve each key. Introduce an invalid method and observe the diagnostic. Write a paragraph distinguishing a compile-time configuration check from validating configuration loaded from disk.

## Checkpoint

- You distinguish annotation, assertion, and satisfies.
- You know what const assertions preserve and what they do not freeze.
- You can identify the runtime evidence behind an assertion.
- You avoid using assertions as JSON validation.

## Sources

[TypeScript 4.9 satisfies](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html) and [literal inference](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).
