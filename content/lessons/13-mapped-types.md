{"number": 13, "slug": "mapped-types", "title": "Mapped types", "stage": 2, "description": "Transform property types without confusing type changes with runtime changes."}

## Where you are

You can derive a key union and look up each value. A mapped type iterates over a key set in the type system to describe a related object contract. It generates no runtime loop.

## Mental model

Read a mapped type as: for each selected key, describe this property. Modifiers can make properties optional or readonly, or remove those modifiers. Key remapping can rename or omit keys. The result describes a shape another piece of JavaScript must actually provide.

## JavaScript reality

Making a type partial does not create an object with defaults. Making a type readonly does not freeze existing data. Renaming keys at the type level does not rename serialized JSON fields. A runtime adapter must perform the corresponding operation when one is needed.

## TypeScript model

Standard utilities cover many everyday needs: Partial makes properties optional, Required removes optionality, Readonly creates a readonly view, Pick selects keys, and Omit removes selected keys. These transformations are generally shallow. A nested mutable object can remain mutable through its own properties.

Mapped modifiers use `-readonly` and `-?` to remove restrictions. Remapping uses an `as` clause and can produce never to omit a key. Template literal names can improve generated event or getter contracts, but can also produce noisy editor output. Prefer the standard utility when it already expresses your intent.

## Working example

{{example}}

{{output}}

The patch contract only includes editable fields and makes them optional. ID cannot be supplied as part of that patch. The Getters transformation remaps each string key into a capitalized getter name and preserves that property’s return type. It describes an API; it does not construct those functions. The emitted JavaScript still performs a shallow spread; there is no generic validation implied by Partial or Pick.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The patch intentionally excludes ID. An update command that changes identity should be a separate domain operation with its own rules. Widening every patch to Partial of the entire database object can expose internal fields and permit invalid transitions.

## Runtime drill

Supply a patch from JSON through unknown. Before spreading it into a job, reject unknown keys and validate each present value. Otherwise the runtime can still replace the ID even though typed callers cannot. Test an object with `id`, a wrong attempts type, and an explicitly absent optional field.

## Professional pattern

Treat mapped types as internal contract reuse, not authorization. Define the allowed mutation surface first, then derive convenience forms. Avoid recursive DeepPartial by default: it leaves ambiguous whether arrays replace, append, or merge, and whether undefined means delete or ignore.

## Exercise

Create an editable subset of a job containing label and retry limit. Derive a patch type, then write a runtime patch parser with an explicit unknown-key policy. Apply the patch immutably. Test that omitted fields preserve existing values while valid zero values are retained. Compare a hand-written named patch interface with the derived form and choose the clearer public API.

## Checkpoint

- You can read mapped modifiers and key remapping.
- You distinguish shallow transformations from deep operations.
- You use standard utility types where they suffice.
- You keep authorization and runtime parsing separate from typing.

## Sources

[Mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html) and [utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html).
