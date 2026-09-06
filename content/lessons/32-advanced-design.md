{"number": 32, "slug": "advanced-design", "title": "Practical advanced types", "stage": 5, "description": "Use brands, builders, recursion, and type-state when they make an API easier to use."}

## Where you are

You can publish and measure a typed library. Advanced design now means judgment: which mistakes deserve static prevention, which invariants belong at runtime, and what complexity will consumers inherit?

## Mental model

A sophisticated type earns its place by preserving a useful relationship that a simpler contract loses. Evaluate call-site clarity, error quality, inference, compiler cost, and maintenance. A parser implemented at the type level is not automatically a better parser.

## JavaScript reality: classes and prototypes

A class creates a runtime constructor. Instances use prototype lookup to share methods, while fields belong to individual objects. Extends links prototype behavior; super invokes the base initialization or method. Ordinary methods receive this from their call form, so extracting a method can lose its receiver. Arrow fields capture the instance but create per-instance functions.

TypeScript private is primarily a checker restriction; JavaScript #private fields enforce runtime private access. Readonly fields still do not freeze referenced objects. Interfaces and implements checks disappear, while the class remains. Prefer composition for changing capabilities; inheritance can couple initialization order and mutable base state in ways types do not fully protect.

The class lab in `labs/classes` demonstrates prototype lookup, a generic class, an override, and a receiver-safe method call. Use a class when it owns state and behavior with a clear lifecycle, not just to give a plain data object a name.

## TypeScript model

A brand intersects a base type with a unique marker so ordinary values cannot accidentally substitute. Runtime validation creates evidence for the brand; one localized assertion can bridge the invariant the checker cannot express. The marker is not runtime authentication and can be forged by an assertion.

A type-state builder can distinguish incomplete and ready phases. Keep the implementation honest about transition order and consider a simple separate Ready object instead of a generic state parameter with many conditions. A fluent API should not force users into a chain when an ordinary options object would be easier to inspect.

Recursive types can model bounded nested data, but unrestricted recursive conditional transformations can become expensive or hit compiler limits. NoInfer can prevent one argument from influencing inference when another argument should be the source of truth; use it to improve a concrete ambiguous API rather than controlling every inference step.

## Working example

{{example}}

{{output}}

The single assertion follows a real nonempty-ID check. The comment states why it is necessary. It is not suitable for unvalidated external input or proof of authorization. The branded value remains a string in emitted JavaScript.

## Type-checker drill

{{invalid}}

{{diagnostic}}

A raw string has not passed the brand's construction boundary. Call the parser. Do not export a convenient unchecked cast as the default constructor, or the brand ceases to protect the domain relationship it was introduced for.

## Runtime drill

Serialize and deserialize a branded value. Its marker is gone because it was always a static convention. Parse again at the restored-data boundary. Then deliberately forge the brand in an isolated test to demonstrate why it cannot authorize access to someone else's job.

## Professional pattern

Maintain a short complexity budget for public APIs: a clear ordinary call, a readable error for one common misuse, and bounded checking cost. Prefer a concrete data structure and runtime algorithm for open-ended transformations. A single documented internal assertion can be better than exposing a sprawling type workaround to every consumer.

## Exercise

Add distinct JobId and UserId types backed by parsers. Prove accidental mixing is rejected. Build a two-phase request constructor using either separate interfaces or a type-state builder, then compare the consumer experience. Add a small generic repository class with a #private Map and explain its runtime ownership and structural compatibility.

## Checkpoint

- You can justify a brand with an actual domain mix-up risk.
- You understand class runtime identity and prototype behavior.
- You evaluate advanced types through consumer and compiler costs.
- You can choose a simpler API with confidence.

## Sources

[Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html), [conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html), and [NoInfer](https://www.typescriptlang.org/docs/handbook/utility-types.html#noinfertype).
