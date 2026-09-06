{"number": 5, "slug": "narrowing", "title": "Unions, literals & narrowing", "stage": 1, "description": "Use runtime evidence and control flow to make union types useful."}

## Where you are

Objects describe one shape. Real input often has several possible shapes. A union is the set of values from either member. Before you know which member arrived, you may only perform operations safe for every remaining possibility.

## Why this matters

A useful TypeScript program often consists of ordinary JavaScript checks that carry type information forward. Repeated assertions are frequently a sign that the program has not expressed its evidence clearly enough.

## Mental model

Narrowing removes possibilities along a control-flow path. If a value starts as string or number and the string path returns, the remaining path contains a number. The declared type controls legal assignments; the narrowed type describes what the checker currently knows at a point in the program.

## JavaScript reality

`typeof` distinguishes basic runtime categories, but arrays and null need additional checks. Truthiness rejects `0`, `false`, `""`, `null`, `undefined`, and `NaN`. If zero is a meaningful result, `if (value)` is the wrong presence test. `value !== undefined` expresses a different policy.

The `in` operator observes a property on an object or its prototype chain. It does not prove the property has a valid payload. `instanceof` follows prototype relationships with a runtime constructor; it cannot test a type alias or interface and can be surprising across browser realms. Equality checks compare actual values. Choose the evidence appropriate to the boundary.

## TypeScript model

Literal types restrict values to specific strings, numbers, or booleans. A union of object types with a common literal property is a discriminated union. Checking that discriminant connects the associated payload to its case. That relationship is stronger than independent optional properties.

A custom predicate such as a return type `value is User` lets an API claim a refinement. The checker trusts the predicate's declared contract; it does not verify that every successful return established all fields. Test guards with malformed values, especially null, arrays, inherited properties, and wrong primitive types. Small local checks are often easier to audit.

## Working example

Trace the possible input type after the first return, and explain why zero survives.

{{example}}

{{output}}

The finite check is a domain constraint beyond `typeof`. Returning early leaves only a validated number in the success branch. The result's discriminant makes the error payload unavailable in the success case and vice versa.

## Type-checker drill

{{invalid}}

{{diagnostic}}

`toUpperCase` does not exist on every union member. Narrow with `typeof` and format each member appropriately. Converting both members with `String` is a simpler alternative when the domain only needs display text. Widening to `any` discards exactly the information that exposed the bug.

## Runtime drill

Try `"0"`, `0`, `""`, `"Infinity"`, and `null` at the parsing boundary. The example accepts already typed string-or-number input; an external JSON value must first be narrowed from unknown. Add that outer boundary before claiming the parser can accept arbitrary JSON. A compiler signature is not an input sanitizer.

## Professional pattern

Put checks near the boundary and return a trusted internal representation. Preserve related data in the same union member. Avoid destructuring a discriminant and payload into unrelated mutable variables, which can make their relationship harder to preserve. Use exhaustive handling when the cases represent a closed application state model.

## Exercise

Parse a job priority from unknown input. Accept integers from zero through five and decimal digit strings representing that range. Return a discriminated success/error union. Reject booleans, arrays, empty strings, null, fractions, and infinity. Then write a formatter that handles the result without an assertion. Explain why truthiness would reject one valid priority.

## Checkpoint

- You can trace a type before and after an early return.
- You can choose between presence, truthiness, and category checks.
- You can explain why a predicate can lie.
- You can access a discriminated payload without casting.

## Sources

[Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) and [type compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html).
