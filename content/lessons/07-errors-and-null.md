{"number": 7, "slug": "errors-and-null", "title": "Errors & nullable values", "stage": 1, "description": "Make absence and failure explicit without turning every operation into a ceremony."}

## Where you are

You can narrow unions and define contracts. Now represent expected failure and missing data. A successful empty result, an invalid request, and an unavailable service are different states; callers need enough information to act on them.

## Mental model

Absence means there is no value. Failure means an operation did not meet its contract. Exceptions transfer control to a catch boundary; result unions return a value that represents either outcome. Choose the mechanism according to who can recover and how often failure is expected.

## JavaScript reality

Optional chaining stops a property or call chain when its receiver is nullish. It does not catch exceptions thrown inside a method or validate the receiver's other properties. Nullish coalescing chooses a fallback only for null or undefined, preserving zero, false, and empty strings. Boolean OR falls back for every falsy value instead.

JavaScript allows throwing any value, including a string. An Error object is preferable because it carries a message and often useful stack information. A catch boundary must still treat the caught value as unknown. Rethrowing can preserve the original error; wrapping with a cause can add context without discarding it.

## TypeScript model

With strict null checking, a possibly absent lookup cannot be used as a definite value. Narrow it or choose an intentional fallback. A non-null assertion removes the warning but supplies no runtime check. If absence is a normal result, include it in the return contract.

A result union connects success to a payload and failure to a structured error. Use stable error codes for programmatic decisions and useful messages for people. Do not parse an English message to decide whether to retry. Exceptions remain a good fit for unexpected I/O failures or violations handled at an application boundary; routine validation errors can be easier to compose as values.

## Working example

{{example}}

{{output}}

A zero retry count is preserved by nullish coalescing. Negative input becomes a domain error rather than an ambiguous undefined. The switch on `ok` provides access to precisely one payload.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The lookup may not have a first item. Use an explicit branch, return an optional result, or define a nonempty input contract backed by validation. Adding `!` merely moves the problem to execution.

## Runtime drill

Change nullish coalescing to Boolean OR in the example. Run it and observe zero become three. Both versions compile: the checker knows the operation's types, not your intended policy. This is a behavior test worth keeping because it protects a meaningful user choice.

## Professional pattern

Catch at the boundary where recovery or reporting is possible. Preserve error causes, avoid logging the same exception at every layer, and never print credentials from configuration or request headers. Give a CLI a nonzero exit status on failure. Translate internal errors into a stable external response rather than exposing stack traces to HTTP clients.

## Exercise

Build a lookup returning either a found job, a not-found error, or an invalid-ID error. Add a formatter that distinguishes all outcomes. Support an optional retry count where zero disables retries. Write behavior tests for missing data, empty IDs, zero, and an unexpected thrown string. Explain which failures belong in a result and which should reach the application boundary.

## Checkpoint

- You can use nullish coalescing without changing zero's meaning.
- You handle a caught unknown value safely.
- You distinguish optional data from failed operations.
- You are ready for [Build 1: the data utility](/builds/data-utility/).

## Sources

[Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) and [strictNullChecks](https://www.typescriptlang.org/tsconfig/strictNullChecks.html).
