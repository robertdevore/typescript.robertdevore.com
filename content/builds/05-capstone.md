{"slug": "capstone", "title": "Capstone: typed job execution platform", "stage": 5, "description": "Design, implement, test, package, and operate a complete job system through explicit milestones."}

## The brief

Build a typed job execution platform with a CLI, HTTP API, reusable domain package, runtime validation, asynchronous executor, cancellation, persistence, structured logs, and tested consumer contracts. This is a milestone brief, not a solved platform. Reuse earlier techniques but make and defend the architecture decisions yourself.

Budget 15–25 focused hours after the core lessons. Scope the platform to a single process initially. Execute a fixed registry of owned handlers, such as summarizing job data or calling a configured fixture API. Do not execute arbitrary shell commands or user-supplied JavaScript. TypeScript types cannot sandbox untrusted code.

## Deliverables

- A domain package with job definitions, attempt states, validated identifiers, and transition operations.
- A CLI that submits, lists, inspects, and cancels jobs through an application service or HTTP client.
- An HTTP API with runtime request parsing, explicit status and error contracts, and a documented authorization boundary.
- An executor with a positive concurrency limit, bounded queue policy, cooperative cancellation, and owned cleanup.
- Persistence that survives restart under a documented durability and recovery model.
- A reusable package with declarations, exports, documentation, and an independent tarball consumer.
- Runtime, integration, type-contract, lifecycle, and package tests, plus an operator runbook.

## Milestone 1 — Model identity and state

Start with a written model: a job definition is not an execution attempt. Give each an ID and preserve the relationship. Define queued, running, succeeded, failed, and cancelled attempt states with only their relevant payloads.

Decide legal transitions before implementing the scheduler. Specify what happens when cancellation races with successful completion. Use a revision or generation check so a stale callback cannot overwrite a newer terminal state. An exhaustive formatter should fail compilation when a state is added without handling.

Acceptance evidence: a transition table, exhaustive type-checking, runtime tests for every legal transition, and rejected-transition tests. Include a stale completion after cancellation.

## Milestone 2 — Establish runtime contracts

Parse submission input from unknown. Validate handler names against the actual registry, argument shape, queue limits, timeout bounds, and identifier grammar. Parse persisted data separately because it may come from an older schema version.

Define output projection so internal error stacks or operator secrets cannot leak in API responses. A return annotation does not remove runtime fields. If users are represented, check authorization through an explicit policy at every read and mutation boundary; a branded ID only distinguishes domains.

Acceptance evidence: malformed JSON, missing fields, extra fields, wrong types, oversized requests, unknown handlers, and unsupported schema versions all have tests with intentional outcomes.

## Milestone 3 — Build the executor

The scheduler admits at most N active attempts and observes a bounded queue. Validate N as a positive integer before startup. Starting every promise and then waiting in small groups does not enforce a concurrency cap; ownership must begin at task admission.

Pass AbortSignals to the actual I/O or handler. A timeout requests cancellation and records a terminal policy, but it cannot forcibly stop arbitrary synchronous JavaScript. Keep handlers cooperative and document this limit. CPU-bound work needs worker or process isolation if it must not block the API.

Acceptance evidence: instrument active work and assert peak concurrency never exceeds N. Test N=1, multiple independent tasks, one rejection, cancellation before start, cancellation during work, and a handler ignoring its signal. Define what happens to that last case without falsely claiming the promise was stopped.

## Milestone 4 — Persist and recover

Choose a simple persistence layer. For a single-process file implementation, write a versioned snapshot through a temporary file and deliberate replacement policy; explain crash windows and filesystem assumptions. A database can offer stronger transaction guarantees but does not remove schema validation or recovery decisions.

On restart, decide how to treat attempts persisted as running. Requeue only when retry is safe and idempotency is available; otherwise mark them interrupted or failed and require an explicit retry. Exactly-once execution is not a promise you obtain by adding types to a retry loop.

Acceptance evidence: restart from each state, malformed storage, unsupported schema, interrupted write, and repeated retry request. Document whether more than one process may own the store. Do not claim multi-process safety for an uncoordinated JSON file.

## Milestone 5 — Expose HTTP and CLI adapters

Keep application services independent of Node request and response objects. Translate HTTP input into validated commands, invoke the service, and project stable DTOs. Use meaningful statuses for invalid input, missing jobs, conflicts, busy admission, and unexpected failures.

The CLI should preserve stdout for requested results, stderr for errors, and meaningful exit codes. Accept a signal or handle termination so requests do not leave invisible work behind. An external adapter should use a configured allowed origin, bounded response parsing, cancellation, and a documented retry policy.

Acceptance evidence: end-to-end submission, inspection, completion, cancellation, and restart through the actual HTTP and CLI boundaries. Test an upstream status error and invalid payload without relying on live internet services.

## Milestone 6 — Package the owned contracts

Select a stable public surface for domain types, parsing, and the client. Avoid exposing the entire internal scheduler or storage implementation through inferred declarations. Export useful relationships that callers can use without explicit type arguments.

Build and pack the package, install it in a fresh consumer, verify declarations and runtime imports, and run positive and negative type tests. If you choose dual module output, prove both runtime and declaration conditions and evaluate stateful module identity.

Acceptance evidence: reviewed tarball contents, independent consumer output, a rejected invalid call, useful inferred result, and documented support matrix. The capstone need only be publish-ready; a public registry upload is optional and should use an owned package name.

## Milestone 7 — Own production lifecycle

Parse typed configuration before opening resources. On shutdown stop admissions, cancel or drain active attempts according to policy, persist terminal or interrupted state, close servers, and enforce a final deadline. Make shutdown idempotent.

Emit structured events with stable attempt IDs, transitions, durations, and bounded error categories. Do not log complete request bodies or authorization values. Provide health/readiness behavior that reflects admission state rather than always returning success during shutdown.

Acceptance evidence: send SIGTERM during active work and observe bounded cleanup. Restart and inspect recovered state. Demonstrate that logs explain what happened without disclosing secrets.

## Milestone 8 — Release and defend the design

Run strict compilation, runtime and integration tests, type tests, lint, format checks, package validation, and supported-runtime consumers from a clean checkout. Record compiler version, runtime version, and technical verification date. Inspect current release notes and dependency support before upgrading.

Write a design review answering: where does data become trusted, which types preserve useful relationships, what remains deliberately dynamic, how can cancellation fail, which state transitions are legal, and what can a consumer rely on across versions? Measure checking performance if advanced type changes affect it.

## Final review rubric

| Area        | Required evidence                                                 |
| ----------- | ----------------------------------------------------------------- |
| Domain      | Explicit states, transitions, identity, and stale-result policy   |
| Boundaries  | Parsers, output projections, size limits, authorization ownership |
| Async       | Concurrency proof, cancellation cases, resource cleanup           |
| Persistence | Versioning, restart tests, documented durability limits           |
| API         | Clear errors, useful inference, small owned public surface        |
| Package     | Real tarball consumer, declarations, module support tests         |
| Operations  | Structured logs, shutdown test, runbook, rollback plan            |
| Judgment    | Justified generics/assertions, readable types, no fake guarantees |

## Diagnostic challenge

Add a new state and watch every exhaustive consumer report the missing case. Then introduce a runtime payload that falsely claims an existing state and watch validation reject it. These two failures demonstrate the course's central distinction: static completeness and runtime evidence are complementary.

## Completion checkpoint

The capstone is complete when another developer can install, operate, test, and explain your platform without relying on your private context. Keep a concise evidence bundle: commands, versions, test outcomes, artifact identity, and known limits. A thoughtful documented limitation is better than an unsupported claim of production safety.
