{"number": 6, "slug": "interfaces-and-aliases", "title": "Interfaces & type aliases", "stage": 1, "description": "Choose interfaces or type aliases to suit your data and public APIs."}

## Where you are

You can model objects and unions. Both interfaces and type aliases can name object shapes. The useful question is which form expresses the contract and its intended extension points, rather than which keyword is universally superior.

## Mental model

A name for a type helps people communicate. It does not allocate an object, validate input, or create a runtime identity. The compiled JavaScript does not contain an interface declaration that can be called or tested with `instanceof`.

## JavaScript reality

Objects carry properties at runtime regardless of which static name describes them. Passing an object to a function does not remove fields the parameter type omits. Intersections are not runtime merges. A spread expression can merge object properties, but later properties overwrite earlier ones; intersecting incompatible property types is a different operation.

## TypeScript model

An interface describes an object contract and can extend other interfaces. Compatible declarations with the same interface name can merge. This is useful for deliberately open extension points, but accidental ambient declarations can also merge unexpectedly. Public interfaces should have a considered extension policy.

A type alias names an arbitrary type expression, including a union, tuple, primitive, mapped type, or intersection. Aliases do not reopen through declaration merging. An intersection requires satisfying both constituents; it does not mean either constituent. If one requires a string ID and the other requires a number ID, the resulting property can become impossible to populate.

Interface extension reports incompatible properties at the extension declaration. An intersection may defer the resulting impossibility until a later use. That difference affects error quality and maintainability. For a large ordinary object contract, explicit named properties and interface extension can be easier for readers and the compiler than a stack of intersections.

## Working example

{{example}}

{{output}}

The implementation receives a value satisfying both ID and label requirements. The result union uses an alias because a choice among shapes is not an interface extension. Notice that the extra owner field remains on the original runtime object even when a narrower parameter contract hides it from that function.

## Type-checker drill

{{invalid}}

{{diagnostic}}

Extension cannot redefine a string ID as a number. Decide which domain owns the ID representation. If an adapter receives a numeric external ID, model that separately and convert it deliberately. Intersecting the incompatible types does not solve the disagreement.

## Runtime drill

Serialize the job before and after calling the summary function. Verify that passing through a smaller interface does not strip extra fields. For a public HTTP response, explicitly construct the allowed output rather than expecting the annotation to prevent an internal owner or secret from being serialized.

## Professional pattern

Use a type alias for closed unions and transformations. Use an interface when an object contract benefits from extension or intentional merging. Both work for many ordinary objects; team consistency can decide the overlap. Keep global augmentation rare and documented. Public API consumers should not need to understand an internal inheritance hierarchy to call a function.

## Common failure modes

An intersection of conflicting fields can become uninhabitable. Treating interface conformance as validation permits malformed external data. Globally augmenting common names creates surprising coupling between packages. Choosing a keyword by dogma distracts from the contract itself.

## Exercise

Model an external job response with a numeric ID and an internal job with a string ID. Implement a conversion function and a public summary projection. Define a result union for conversion failure. Then deliberately create conflicting interface extension and intersection variants and compare where their diagnostics appear. Record which error is clearer to a future maintainer.

## Checkpoint

- You can explain extension versus intersection.
- You know which declarations can merge.
- You can choose a union alias without trying to force it into an interface.
- You know an annotation never strips runtime properties.

## Sources

[Object types](https://www.typescriptlang.org/docs/handbook/2/objects.html) and [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).
