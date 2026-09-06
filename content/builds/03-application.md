{"slug": "application", "title": "Build 3: validated HTTP application", "stage": 3, "description": "Build a bounded, observable Node service with a real external boundary and graceful lifecycle."}

## The brief

Build a Node HTTP service that reads jobs from a configured upstream API and returns a validated summary. It must own configuration, cancellation, timeouts, resource limits, errors, structured logs, and shutdown. Start with Node's built-in HTTP server so framework defaults do not hide the lifecycle.

Budget five to eight hours. The comparison implementation in `labs/application` is a bounded teaching service: it binds loopback, exposes health and summary routes, and uses an operator-controlled upstream. It is not an internet authentication service. Your deployment architecture must add authentication and authorization before exposing private jobs.

## Observable contract

`GET /health` reports readiness while the application accepts work. `GET /summary` fetches and validates the upstream list, then returns totals. Unknown routes produce 404 and unsupported methods produce 405. Upstream failures do not become empty success responses.

The upstream URL comes from validated operator configuration, never a query parameter. This matters because an arbitrary user-selected URL could make the server reach unintended networks. For public deployment, also constrain the allowed origin and network destinations according to the environment.

## Milestone 1 — Parse startup configuration

Parse PORT and UPSTREAM_URL before opening the server. Reject empty numeric values, invalid ranges, unsupported protocols, and embedded credentials. Keep a parsed Config independent of process.env. Defaults should be explicit, documented, and sensible.

Acceptance: invalid configuration exits before a listening socket exists. Error messages identify the field and constraint without dumping the environment.

## Milestone 2 — Build a trustworthy client

Check fetch transport failure, status, body availability, JSON syntax, and job schema separately. Propagate an AbortSignal. Bound the response while reading the stream; a limit checked after buffering the whole response does not protect memory. Decide redirect policy before attaching credentials.

The comparison client limits its body to one MiB, rejects redirects, and validates at most 10,000 jobs. Its timeout is two seconds and applies through the signal. Those are teaching defaults, not universal production limits. Explain your chosen budgets.

Acceptance: a 200 response with invalid shape fails validation. A 500 status fails even if the body looks valid. An oversized body stops consumption and frees the reader.

## Milestone 3 — Own application concurrency

Limit concurrent summary requests rather than allowing every request to start upstream I/O. Return an explicit busy response when capacity is exhausted. Keep controllers in an owned set and remove them after every outcome.

Decide how disconnects affect work. If a caller goes away before receiving a response, cancel work that no longer has a consumer. Clear timers and detach listeners after settlement. Do not let a promise rejection escape from an unobserved request handler.

Acceptance: an integration test records peak active operations and proves it stays under the configured cap. Tests include cancellation before and during an upstream response.

## Milestone 4 — Make errors and logs useful

Keep public responses stable and small. Log event names, bounded counters, and error categories. Avoid raw payloads, authorization headers, and stack traces in public responses. Choose one layer to report each failure rather than logging duplicates in the client, service, and route.

Acceptance: invalid upstream JSON returns an error response, creates a structured event, and does not expose the raw body. A successful summary produces a useful count event.

## Milestone 5 — Shut down gracefully

Make shutdown idempotent. Stop accepting new requests, abort active upstream work, close idle connections, and wait for the server to close. Add a deadline that destroys remaining connections if necessary. Handle SIGTERM and SIGINT at the process entry point.

Do not immediately process.exit after starting cleanup. A successful cleanup should let the process finish naturally; failures should set an unsuccessful exit status and still settle resources.

Acceptance: a child-process test sends a termination signal during delayed upstream work and observes bounded exit. A second signal must not create a second inconsistent cleanup sequence.

## Milestone 6 — Test both seams and real HTTP

Use Response fixtures to test malformed bodies and size limits deterministically. Also start a real loopback upstream server and the real application for a successful exchange, status error, invalid payload, and cancellation. Close both in finally or test cleanup hooks.

The course root automates these checks:

```sh
npm ci
npm run check:labs
npm test
```

To run the comparison service interactively, first start `node labs/upstream-fixture.mjs` in one terminal. In another terminal:

```sh
UPSTREAM_URL=http://127.0.0.1:3101/jobs PORT=3100 node labs/application/dist/main.js
```

Visit the local `/health` and `/summary` routes, then terminate both processes when finished. Windows PowerShell users can set the two environment variables separately before invoking Node.

## Type-checker and runtime drills

Change the client return type to an unchecked generic and show how a caller can request an invented payload. Restore the parser-backed return. Then return an invalid but syntactically valid JSON body from the upstream: the compiler cannot observe it, so the integration test must.

## Production review

Write a runbook covering configuration, binding address, traffic limits, authentication boundary, upstream ownership, logs, readiness, graceful shutdown, and rollback. List what a reverse proxy or deployment platform owns. Do not call a teaching sample production-ready merely because it starts successfully.

## Completion checkpoint

The build is complete when strict compilation, unit and integration tests, type contracts, lint, and format checks pass; limits are enforced at runtime; shutdown is demonstrated; and another developer can operate the service from the runbook.
