{"number": 17, "slug": "variance", "title": "Variance & function compatibility", "stage": 2, "description": "Debug callback assignability using the values an implementation can actually handle."}

## Where you are

You can design generic contracts. A common remaining surprise is the direction of function compatibility: why can't a callback accepting a specialized job handle every job? Think about the caller's freedom and the callback's requirements.

## Mental model

Covariance preserves an assignability direction, commonly for produced values. Contravariance reverses it, commonly for consumed values. Invariance allows neither direction freely. Bivariance allows either direction and can permit unsafe calls. These are descriptions of relationships, not design goals to maximize.

## JavaScript reality

A function that reads `job.owner.toUpperCase()` fails if called with a job lacking an owner. A type assignment cannot change its implementation. Before accepting a callback, ask what values the receiving API is allowed to pass to it.

## TypeScript model

With strictFunctionTypes, ordinary function parameter types are checked contravariantly. A callback capable of accepting every job can be used where only owned jobs will arrive. The reverse is unsafe. Returning an owned job where an ordinary job is required is useful because the consumer only needs the ordinary fields.

Method declarations have a deliberate bivariance exception for compatibility with common JavaScript patterns, including mutable collections. A function-valued property and a method signature can therefore behave differently. Do not rely on method syntax to silence a real unsafe callback requirement.

Mutable arrays illustrate a related tradeoff: a more specific array can sometimes be viewed as a wider array, permitting insertion of values that violate the original view. Readonly collection contracts limit these mutation hazards. Explicit variance annotations exist for some generic declarations, but are advanced tools for describing measured relationships, not a repair mechanism for an incorrect API.

## Working example

{{example}}

{{output}}

The broad consumer works in a context promising specialized input because it requires less. The specialized producer works in a context consuming an ordinary result because it supplies more.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The assigned function assumes a label that the callback contract does not promise. Broaden the implementation or narrow the API's accepted inputs honestly. Casting the callback would preserve the unsafe runtime assumption.

## Runtime drill

Create a method-shaped callback container accepting a specialized job, assign it through a broader method-shaped interface, and invoke it with a basic job. Observe the permitted assignment and failing operation in a controlled test. Compare a function-valued property version under strictFunctionTypes. This is a deliberate compatibility limit, not evidence that all callbacks are safe.

## Professional pattern

Prefer function-valued properties for public callback contracts when strict parameter checking matters. Accept readonly inputs for read-only operations. When a variance diagnostic appears, write down an actual value the consumer may pass and step through the implementation before changing type syntax.

## Exercise

Create a subscription API that emits basic jobs and try registering a handler requiring owned jobs. Explain the rejection using a concrete missing-owner object. Then make a separate subscription genuinely emit owned jobs and show which broader callbacks remain valid. Add a negative type test to preserve the safe direction.

## Checkpoint

- You can explain a parameter-compatibility error without a theory lecture.
- You know the method bivariance exception.
- You distinguish input requirements from output guarantees.
- You are ready for [Build 2: library and CLI](/builds/library-cli/).

## Sources

[Type compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html) and [TypeScript FAQ: method bivariance](https://github.com/microsoft/TypeScript/wiki/FAQ#why-method-bivariance).
