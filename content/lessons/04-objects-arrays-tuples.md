{"number": 4, "slug": "objects-arrays-tuples", "title": "Objects, arrays & tuples", "stage": 1, "description": "Describe data shape while keeping aliasing, optionality, and mutation visible."}

## Where you are

Functions need useful data models. This lesson builds object and collection contracts for a job utility. Focus on what callers can rely on, not on making every object resemble a class.

## Mental model

An object type describes properties available through a reference. An array describes a sequence with the same element contract. A tuple describes a sequence whose positions carry distinct meanings. None of these descriptions changes JavaScript storage.

## JavaScript reality

Assigning an object to another variable copies a reference. Both names can observe mutations to the same object. Destructuring reads properties into bindings; primitive property values are copied, while nested object values remain references. Object spread makes a shallow copy. A spread clone of a job still shares nested metadata unless you copy that too.

An absent property and a property containing `undefined` can behave differently under `in`, `Object.keys`, and serialization. Arrays are objects with indexed properties; reading beyond their length returns `undefined`. A tuple is still an array at runtime.

## TypeScript model

Required properties must be present in an assignable value. Optional properties can be absent. With `exactOptionalPropertyTypes`, an optional string property does not automatically accept an explicitly assigned `undefined`; its read type still includes `undefined` because it may be missing.

`readonly` prevents writes through the typed reference. It does not freeze the runtime object or prevent writes through a mutable alias. Readonly arrays remove mutating methods from that reference. A readonly tuple can express a fixed result pair and prevent accidental reassignment of its positions.

Fresh object literals receive excess property checking to catch likely misspellings. This is not an exact-object guarantee: a previously stored value with extra properties can still be structurally assignable. Lesson 8 explains why that is intentional.

## Working example

Predict which nested object the original and copied job share.

{{example}}

{{output}}

The original's attempts count changed even though the outer object was copied. The tuple encodes a label/count pair. With unchecked-index protection enabled, an arbitrary array lookup requires an absence check; a known in-range tuple position has a known type.

## Type-checker drill

{{invalid}}

{{diagnostic}}

A readonly view disallows this assignment. Create a new value for an immutable update, or deliberately accept a mutable contract if mutation is the purpose of the operation. An assertion that discards readonly would evade the agreement with the caller.

## Runtime drill

Extend the example with a readonly view of the original job. Mutate the nested attempts count through the original mutable alias, then read through the readonly view. The observation changes. Decide whether your domain requires convention, deep copying, or runtime freezing. Each has different costs; shallow `Object.freeze` does not recursively freeze children.

## Professional pattern

Prefer named objects for larger result structures; tuples work well when there are only a few universally understood positions. Accept readonly arrays when you only read, so callers can provide mutable or immutable sequences. Copy at ownership boundaries intentionally instead of spreading objects everywhere and assuming isolation.

## Exercise

Implement a summary function accepting a readonly list of jobs and returning a readonly pair of total jobs and total attempts. Add an optional owner and define whether missing differs from explicitly empty. Implement an update that changes one job's nested attempts count without changing the input. Test zero jobs, out-of-range lookup, and shared nested references.

## Checkpoint

- You distinguish missing properties from explicit undefined.
- You choose arrays, tuples, and objects by their contract.
- You can demonstrate a shallow-copy alias bug at runtime.
- You can explain the limits of readonly without calling it a freeze.

## Sources

[Object types](https://www.typescriptlang.org/docs/handbook/2/objects.html) and [exactOptionalPropertyTypes](https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html).
