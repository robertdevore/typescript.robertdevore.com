{"number": 3, "slug": "functions", "title": "Functions & useful contracts", "stage": 1, "description": "Model callers, callbacks, closures, and return values without annotation noise."}

## Where you are

You can distinguish a value from its static type. Functions connect those values. A function signature is a promise to callers: what they may supply and what they may receive. The implementation must honor that promise at runtime.

## Why this matters

Most TypeScript APIs are function APIs. A misleading callback signature or an unnecessary generic can make ordinary application code hard to use. Start with concrete parameters and a meaningful return value. Add abstraction only when callers need a relationship preserved.

## JavaScript reality

A function is a value that can be passed, stored, returned, and invoked. A closure retains access to the lexical bindings where the function was created. It does not copy all those values at creation time. A callback can therefore observe a variable after it changes.

Function declarations can be used earlier in their scope; a const-bound arrow must be initialized before use. Ordinary functions receive `this` from the call form, while arrows capture `this` from their surrounding scope. Passing `object.method` as a bare callback can lose its receiver. Binding explicitly or wrapping the call makes the intended receiver clear.

Default parameters apply when the caller omits an argument or passes `undefined`; passing `null` is different. A rest parameter gathers remaining arguments into an array. JavaScript permits extra arguments, but a TypeScript signature can reject callers who likely misunderstand the API.

## TypeScript model

Annotate parameters at the function boundary. Return inference is often precise and avoids repeating the implementation. A public return annotation can intentionally prevent an accidental API change or force all branches to satisfy the same contract. Optional parameters introduce `undefined` inside the function; check or default them before use.

A function type describes both arguments and return values. Contextual typing flows from that type into an inline callback. If a callback accepts a string, the callback's parameter does not need another `: string`. Don't make a callback parameter optional merely because some callers ignore it; optional means the implementation may omit it.

## Working example

The closure tracks each call. Predict the counter after calling the same function twice.

{{example}}

{{output}}

A new call to `makeFormatter` creates a new counter. Calling an existing formatter reuses its captured binding. The rest parameter is an array of strings; `join` has ordinary JavaScript behavior. Nothing about the counter exists only in the type system.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The callback contract supplies strings, and the function body must treat its parameter accordingly. Converting with `Number` might be appropriate for parsing text, but requires a validity check. Changing the callback contract to numeric input is a different API.

## Runtime drill

Create two formatters and interleave their calls. Verify they have independent counters. Then capture a mutable prefix variable outside the factory and change it between calls. Explain why the closure sees its new value. This is a useful way to diagnose callbacks that use stale or unexpectedly updated state.

## Professional pattern

Keep input arguments ordinary data where possible. Accept callback functions with precisely the information you actually provide. Use a union parameter when one implementation accepts multiple kinds of input with the same return relationship. Overloads are useful when different input forms guarantee different output forms; the implementation signature alone is not a public overload. Lesson 26 examines that distinction.

## Common failure modes

A function annotated `void` communicates that callers should ignore its return; it does not describe an asynchronous operation. Use a promise-returning contract for awaited work. Avoid capturing mutable state unless its lifetime is intentional. Avoid default values that quietly conceal required configuration.

## Exercise

Build a formatter factory accepting a prefix and an optional separator. It should return a function accepting any number of strings. Write a callback-based operation that invokes the formatter once per row and provides a zero-based index. Test independent factories, empty input, omitted separators, and an explicitly empty separator. Explain which return types benefit from annotations.

## Checkpoint

- You can trace a closure across multiple calls.
- You can explain defaults, optional parameters, and rest arguments.
- You use contextual typing for callbacks.
- You know when a return annotation stabilizes a public boundary.

## Sources

[More on functions](https://www.typescriptlang.org/docs/handbook/2/functions.html) and [ECMAScript functions](https://tc39.es/ecma262/#sec-ecmascript-function-objects).
