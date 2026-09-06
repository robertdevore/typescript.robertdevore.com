{"number": 12, "slug": "keyof-typeof-indexed-access", "title": "keyof, typeof & indexed access", "stage": 2, "description": "Keep property names and their values connected in reusable APIs."}

## Where you are

Generics can retain a whole input type. Sometimes the contract needs one of its keys or one of its property types. Type operators let you derive those relationships instead of duplicating definitions that drift.

## Mental model

`keyof T` forms a union of keys visible in T. Type-position `typeof value` asks for the statically known type of an existing value. `T[K]` looks up a property type. These are type operations; runtime `typeof` is a JavaScript expression producing a category string.

## JavaScript reality

Objects can have string and symbol keys; numeric property access is coerced for ordinary objects. `Object.keys` returns own enumerable string keys, excluding symbols and inherited properties. Its result is not safely every key of an arbitrary static object type, because the runtime object may have additional properties hidden by a narrower view.

## TypeScript model

A generic key constrained by `keyof T` ensures a legal property lookup. Returning `T[K]` preserves the particular selected property's type. Returning a broad union of all property values would lose that relationship.

For arrays, indexed access with `number` retrieves the element type. For a readonly tuple of literals, it produces their literal union. String index signatures affect keyof because number keys can address the same runtime properties. Unions and intersections can produce less intuitive sets of usable keys; ask which operations are safe on every possible value.

## Working example

{{example}}

{{output}}

`attempts` is inferred as number, while `id` remains string. No overload is needed for each property. The phase union is derived from the maintained tuple so runtime configuration and static names share a source.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The chosen key is outside the object's visible keys. Correct the spelling or extend the model deliberately. Accepting arbitrary strings would require a different contract, such as a dictionary whose lookups can be absent.

## Runtime drill

Store a richer object behind a smaller type, call Object.keys on it, and inspect the extra runtime key. This explains why asserting every Object.keys result to `Array<keyof T>` is not a generally sound reusable helper. Keep a trusted key list or perform targeted property reads when the domain requires a closed set.

## Professional pattern

Derive DTO field types from an owned schema only when that coupling is intended. Separate public DTOs when they have independent versioning or disclosure rules. A clever property accessor should improve the call site; normal dot access is clearer for a fixed property.

## Exercise

Implement a property selector taking an object and one valid key. Add compile-time rejection for a misspelled key and verify the exact output type for two different properties. Derive a phase union from a readonly tuple and use it in a parser backed by the tuple's runtime values. Explain why deriving types does not itself validate a string.

## Checkpoint

- You distinguish runtime typeof from type-position typeof.
- You preserve a selected key's exact value relationship.
- You know Object.keys and keyof describe different things.
- You can derive element unions without duplicating strings.

## Sources

[keyof](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html), [typeof](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html), and [indexed access](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html).
