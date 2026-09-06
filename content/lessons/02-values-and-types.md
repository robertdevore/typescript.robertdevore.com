{"number": 2, "slug": "values-and-types", "title": "JavaScript values & TypeScript types", "stage": 1, "description": "Separate runtime values from static types and learn when inference is enough."}

## Where you are

You have a local compiler and can run emitted JavaScript. Now inspect the things your program actually manipulates. Keep two columns in your notes: runtime value and static type. These columns often contain different information.

## Mental model

A type describes a set of permitted values and operations. An annotation constrains what assignments the checker accepts; it does not convert a value. Inference derives a type from the expression and its context. Use annotations to communicate boundaries and inference for obvious local values.

## JavaScript reality

JavaScript primitives include strings, numbers, booleans, bigint, symbols, `null`, and `undefined`. Numbers are floating-point values, including `NaN` and infinities. Bigints represent integers and cannot be freely mixed with numbers. Symbols create unique keys. Objects, arrays, and functions have identity; two separately created objects are not equal merely because their properties match.

`null` usually represents intentional absence, while `undefined` also occurs for a missing property, missing argument, or function without a return value. Establish a domain convention instead of treating them as synonyms everywhere. `typeof null` returns `"object"`, an old runtime quirk that guards must account for.

Arithmetic and comparison use JavaScript semantics. Adding a string can concatenate rather than add numbers. Prefer explicit conversion at input boundaries and then check the result: `Number("not a number")` is still a number by `typeof`, but is not finite. TypeScript's `number` type does not mean valid currency, positive integer, or finite duration.

## TypeScript model

`let name = "Robert"` infers `string`: a mutable binding can later hold another string. `const status = "ready"` preserves a literal type because the binding cannot be reassigned. But `const config = { status: "ready" }` still permits property mutation; its property typically widens to `string`. Const is about the binding, not recursive immutability.

Annotating a local name as `string` usually adds no information. Annotating a parameter does, because the implementation alone often cannot determine its intended callers. An annotation can also intentionally widen a variable that starts as `null` but will hold a value later.

## Working example

Predict the runtime output, including the object comparison and invalid numeric conversion.

{{example}}

{{output}}

The variables exported by the lab also produce declaration files during verification. The reference site's small type explorer reads compiler-produced declaration output, so its types are checked facts rather than handwritten hover guesses.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The initializer established `string`. Reassignment does not make the variable an arbitrary value container. If the domain intentionally allows a number or a string, say so with a union; otherwise fix the source of the wrong assignment.

## Runtime drill

The working example compiles and prints `false` for finiteness. Add tests for `""`, `"  "`, `"0"`, `"1e3"`, and `"Infinity"` as numeric inputs. Decide whether each should count as a valid job limit. Conversion is a runtime policy, and merely avoiding a compiler error does not define that policy.

## Professional pattern

Name units: `timeoutMs` is more informative than `value`. Validate integer ranges at a boundary before using a number as a concurrency limit. Keep raw input distinct from parsed values. Preserve inference for intermediate expressions, but annotate public contracts and variables whose later assignments need a broader type.

## Common failure modes

Using wrapper types such as `String` instead of primitive `string` adds confusion. Expecting object equality to compare data leads to lookup bugs. Treating a parsed number as automatically finite creates faulty arithmetic. Adding annotations to every local variable increases reading cost without improving the contract.

## Exercise

Write a value inspector that reports `null`, arrays, primitives, and other objects separately. Write a duration parser that accepts decimal digits, rejects an empty string, and returns a positive finite integer. Keep a table of accepted and rejected inputs. Explain why the runtime checks cannot be replaced with an annotation.

## Checkpoint

- You distinguish bindings, object mutation, values, and types.
- You can predict literal preservation versus widening.
- You know why `number` includes values unsuitable for your domain.
- You can choose a useful annotation without duplicating inference.

## Sources

[Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) and [ECMAScript language specification](https://tc39.es/ecma262/).
