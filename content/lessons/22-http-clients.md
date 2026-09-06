{"number": 22, "slug": "http-clients", "title": "HTTP clients & external APIs", "stage": 3, "description": "Build an HTTP client that checks responses and handles failures, retries, and cancellation."}

## Where you are

You can use promises and parse unknown values. A typed API client combines these skills while keeping failure modes distinguishable. The client should make successful calls convenient without disguising remote uncertainty.

## Mental model

A request can fail before a response exists, receive an unsuccessful status, fail while reading the body, contain invalid JSON, or contain JSON violating the domain contract. These failures need different recovery policies. Do not collapse them into an empty successful list.

## JavaScript and HTTP reality

Fetch usually fulfills with a Response for HTTP 404 and 500; inspect status or ok yourself. Headers describe representation and caching behavior, but do not prove a body matches its advertised type. A response body is consumable; do not attempt to read it twice without a deliberate clone and awareness of buffering costs.

Cancellation must reach fetch and response consumption. Bound input size when the source is untrusted; checking after response.text has buffered everything is not a memory limit. The application lab reads a stream with a byte limit. Timeouts should cover the whole operation, including body parsing where possible.

## TypeScript model

Give the client a concrete validated return type or accept a parser from unknown to T. A generic `fetchJson<T>` that merely casts its response is a false contract. Inject a narrow transport dependency for tests so fixtures can supply Response objects while the parser still runs.

Model errors by stable categories such as transport, HTTP status, malformed payload, and cancellation. Keep secrets out of diagnostic context. A retryable status is an input to policy, not automatic permission to repeat every request.

## Working example

{{example}}

{{output}}

The fake transport makes the example deterministic and offline. It still exercises response handling and validation. The server lab tests a real loopback HTTP exchange to catch integration mistakes that a fake alone could miss.

## Type-checker drill

{{invalid}}

{{diagnostic}}

The returned shape does not meet the client's promise. Fix the parser or contract. Calling response.json with a desired annotation would not establish the missing field at runtime.

## Retry, pagination, and rate limits

Retry only bounded operations with known semantics. A GET may be safe to repeat; a job-creation POST may duplicate work unless the server supports idempotency keys. Use a maximum attempt count, a total deadline, backoff with jitter, and Retry-After when applicable. Do not retry validation failures indefinitely.

For pagination, preserve the server's cursor and detect repeated cursors or excessive pages. An async iterator can expose bounded pages without collecting everything. Restrict follow-up URLs to the intended origin if credentials are attached. Respect rate limits across concurrent operations, not just inside each individual request.

## Runtime drill

Return a 200 response with a numeric ID from the fixture. Then return a 429 response, malformed JSON, and an aborted request. Verify these produce distinct failures. A happy-path fixture that skips the parser cannot validate your trust boundary.

## Exercise

Build a paginated job client accepting a signal and a parser. Test first and last page, repeated cursor, non-OK status, invalid shape, timeout, and cancellation. Add retries only for a documented subset of idempotent failures. Keep retry tests deterministic by injecting delay and randomness instead of sleeping for real backoff intervals.

## Checkpoint

- You handle status separately from transport rejection.
- You return validated application data.
- You can explain retry safety and total limits.
- You preserve cancellation and bounded resource use.

## Sources

[Node globals: fetch](https://nodejs.org/docs/latest-v24.x/api/globals.html#fetch) and [Fetch standard](https://fetch.spec.whatwg.org/).
