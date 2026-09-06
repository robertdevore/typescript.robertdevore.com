{"number": 21, "slug": "async", "title": "Async TypeScript & cancellation", "stage": 3, "description": "Understand promises and scheduling before modeling concurrent operations."}

## Where you are

You can parse a response. Fetching it introduces time, cancellation, and failure. TypeScript describes promise results but JavaScript controls when callbacks run and the host controls I/O resources.

## JavaScript reality

A Promise represents eventual fulfillment or rejection. Its executor starts synchronously; then callbacks run asynchronously as promise jobs, commonly called microtasks. Async functions start executing immediately and return a promise. Await pauses that function's continuation, not the whole runtime thread.

The event loop coordinates host tasks and microtasks. A long synchronous loop still blocks progress; marking the containing function async does not move CPU work to another thread. Worker threads or another process address CPU isolation. A resolved promise schedules continuation rather than making await a synchronous no-op.

## Mental model

Starting work and waiting for work are separate decisions. Two sequential awaits can unnecessarily serialize independent operations. Starting both and awaiting Promise.all permits overlap. Promise.all rejects when a member rejects but does not cancel the other operations. Promise.allSettled is useful when every outcome must be collected.

## TypeScript model

An async function returning a number has a Promise<number> result. Await unwraps promise-like values according to promise semantics. The fulfilled type says nothing about the rejection value; catch it as unknown. Tuples passed to Promise.all preserve per-position result types more usefully than an unnecessarily widened array.

An AbortSignal communicates cooperative cancellation. APIs must observe it, and your own work must check it at useful points. Use an AbortController when an owner can request cancellation. Timeout signals can bound an operation, but racing a promise against a timer alone leaves the losing operation running.

## Working example

{{example}}

{{output}}

Predict the sequence before running it. The synchronous log occurs before promise continuation. The aborted timer observes its signal and rejects; the catch boundary reports that cancellation occurred without relying on an unchecked error cast.

## Type-checker drill

{{invalid}}

{{diagnostic}}

An async function cannot satisfy a plain numeric result. Await it inside an async owner or keep its Promise<number> contract and let the caller await. Casting to number does not wait for anything.

## Runtime drill

Replace the aborting timer with a promise that never reads the signal. Aborting the controller no longer stops it. Then try Promise.all with one failing operation and another delayed side effect. Observe the side effect unless you explicitly cancel and settle the remaining work. Cancellation is an ownership policy, not a property of the Promise type.

## Async iteration and streams

An async iterable supplies values over time through a promise-returning iterator. `for await` consumes them sequentially and can stop early. Streams add buffering and backpressure concerns: do not collect an unbounded stream into one array merely to make the types easier. Close resources when iteration ends or the consumer cancels.

## Professional pattern

Pass signals down to the actual I/O operation. Bound concurrency separately from the total number of tasks. On shutdown, stop admitting work, request cancellation, and await settlement within a deadline. Keep cleanup in finally, and remove listeners or timers that outlive an operation.

## Exercise

Fetch three independent fixture endpoints concurrently with a shared cancellation owner. Add a maximum of two active operations. Test success, one rejection, cancellation before start, and cancellation during work. Record active count at every transition and assert it never exceeds two. Explain why Promise.all alone does not enforce that limit.

## Checkpoint

- You can predict synchronous versus microtask ordering.
- You know async does not move CPU work to another thread.
- You propagate cancellation to owned resources.
- You distinguish concurrency, sequencing, and backpressure.

## Sources

[Node timers and AbortSignal](https://nodejs.org/docs/latest-v24.x/api/timers.html) and [ECMAScript promises](https://tc39.es/ecma262/#sec-promise-objects).
