{"number": 16, "slug": "exhaustiveness", "title": "Discriminated unions & exhaustiveness", "stage": 2, "description": "Describe valid states and catch missing cases when they change."}

## Where you are

You already use result unions. Now extend the same idea to a job's entire lifecycle. Several independent booleans permit combinations your business does not understand. A state union makes the permitted combinations explicit.

## Mental model

Each union member represents one meaningful state and only the data available in that state. Queued jobs do not have completion timestamps. Failed jobs carry a reason. A discriminant ties the state name and payload together.

## JavaScript reality

A type does not enforce transitions at runtime. A running job can still be loaded from corrupt storage, and a stale callback can try to complete an already-cancelled job. Parse persisted values and check transitions against current state. A static union helps describe the vocabulary; domain operations enforce lifecycle rules.

## TypeScript model

A switch narrows the member for each discriminant. Once every member has been handled, the remaining value is never. Passing that value to a never-accepting helper makes a new unhandled member a compile error. Keep the helper throwing so a violated runtime assumption does not silently return undefined.

A union of states does not itself prove that every state can legally follow every other. For simple systems a transition function with a result union is clearer than a highly generic state-machine framework. Type-state APIs can be useful later when construction phases need compile-time ordering.

## Working example

{{example}}

{{output}}

The formatter handles every current state. Add a cancelled member and recompile before adding a switch branch. The error is a maintenance prompt, not an inconvenience to silence with a default message.

## Type-checker drill

{{invalid}}

{{diagnostic}}

One member remains possible in the final branch. Implement it explicitly. Replacing the never helper with an arbitrary string would hide missing cases when the union evolves.

## Runtime drill

Pretend storage contains `{"kind":"finished"}` with no duration. A cast to the state union lets the formatter run with invalid assumptions. Add parsing before the formatter and reject the missing payload. Exhaustiveness is relative to a trusted static vocabulary, not a proof about arbitrary JSON.

## Professional pattern

Keep related fields inside the same member. Make transitions named operations that inspect current state. Record stable IDs so late asynchronous results can be matched to the correct job generation. Review new union members for storage compatibility, API serialization, UI rendering, and cancellation behavior.

## Exercise

Replace loading/failed/complete booleans with queued, running, succeeded, failed, and cancelled states. Implement a total formatter and a transition function that rejects completion of a cancelled job. Write tests for invalid transitions and malformed persisted states. Explain which invariants the compiler proves and which require runtime checks.

## Checkpoint

- You can make a newly added state produce useful compiler feedback.
- You keep state payloads correlated with their discriminants.
- You do not confuse valid states with valid transitions.
- You validate persisted state before exhaustive handling.

## Sources

[Discriminated unions and never](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).
