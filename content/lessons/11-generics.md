{"number": 11, "slug": "generics", "title": "Generics that preserve relationships", "stage": 2, "description": "Design reusable functions whose outputs retain useful information about their inputs."}

## Where you are

You know concrete contracts and unions. Generics help when the same operation should preserve a relationship across many caller-selected types. They are not a badge to add to every helper.

## Mental model

A type parameter is chosen for a call and relates positions in its signature. A generic mapping operation connects each input element to the callback parameter and each callback result to the output element. A function whose type parameter appears only in its return cannot conjure that type from nowhere.

## JavaScript reality

A generic function is an ordinary function after emit. There is no runtime T to inspect. You cannot validate arbitrary T without a runtime parser supplied by the caller. JavaScript callbacks decide the actual results; the type system describes their relationships.

## TypeScript model

A constraint establishes minimum capabilities without replacing the caller's specific type. A constrained object can retain extra properties when returned. Defaults make selected type parameters optional to specify, but should not conceal an unclear API. Inference usually spares callers from writing explicit type arguments.

Generic interfaces and classes can bind a type parameter across multiple operations, such as a store's set/get pair. This is useful when the object owns a consistent collection. Generic callbacks can themselves need to work for every type chosen by their caller; that differs from a callback specialized to one inferred type.

Do not promise `T` when returning a freshly constructed value that only satisfies T's constraint. The caller may have selected a more specific subtype with additional requirements. Return the constraint, preserve the original input, or accept a factory that can construct T.

## Working example

{{example}}

{{output}}

The wrapper preserves the caller's job shape. The mapper infers a numeric result without requiring explicit type arguments. Readonly input allows the helper to accept more callers and communicates that it does not mutate the list.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The factory cannot guarantee every possible T has only an ID. A caller could request a labeled job. Return `{ id: string }`, or accept and return a caller value, or accept a constructor callback. Casting the constructed value to T makes a false universal promise.

## Runtime drill

Supply a callback that produces NaN. The output remains `number[]`; the generic relationship is correct but the domain result may be unsuitable. Add behavior checks where finite results matter. Type relationships are not business validation.

## Professional pattern

Design the ordinary call site first. Ask whether the editor infers the expected result without explicit type parameters or assertions. Keep constraints as small as the implementation needs. Prefer a concrete function when every real caller uses the same domain type.

## Exercise

Implement `groupBy` for a readonly list and a key selector. Choose a Map return so arbitrary keys do not require a dishonest Object.keys assertion. Verify that job elements retain all their fields and key inference stays specific. Test empty input and multiple elements sharing a key. Explain where each type parameter appears and which relationship would be lost without it.

## Checkpoint

- You can explain a generic in terms of input/output relationships.
- You know constraints do not allow constructing arbitrary subtypes.
- You let callers benefit from inference.
- You can recognize a needless type parameter.

## Sources

[Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) and [function type parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html).
